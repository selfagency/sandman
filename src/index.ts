import type { Context } from 'hono';

import { serve } from '@hono/node-server';
import { AsyncQueue } from '@sapphire/async-queue';
import { execa } from 'execa';
import { readdir, readFile } from 'fs/promises';
import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { logger } from 'hono/logger';
import { isEmpty } from 'radashi';
import { parse as toml } from 'smol-toml';

import { log } from './util';

function configCheck(script: string, config: Record<string, unknown>) {
  if (config.auth && isEmpty(config.password)) {
    log.warn(`'auth' is set to 'true' but 'password' is not set for script`, `\`${script}\``);
  }
}

// instantiate web server
function instantiateServer() {
  const app = new Hono();
  app.use(
    logger((str: string, ...rest: string[]) => {
      log.log(str, ...rest);
    })
  );
  return app;
}

// import configuration
async function loadConfig() {
  try {
    const config = toml(await readFile(`${process.cwd()}/config.toml`, 'utf8'));
    log.info('Configurations detected:', Object.keys(config));

    // check for scripts
    let scriptsPath = `${process.cwd()}/scripts`;
    if (!isEmpty(process.env.OUTDIR)) {
      scriptsPath = `${scriptsPath}/${process.env.OUTDIR}`;
      log.info('Using build folder:', scriptsPath);
    }
    const files = (await readdir(scriptsPath)).filter(
      f => (f.endsWith('.ts') || f.endsWith('.js')) && !f.startsWith('common')
    );
    if (files.length === 0) {
      log.error(`No scripts found in \`${scriptsPath}\``);
      process.exit(1);
    } else {
      log.info('Scripts detected:', files);
    }

    return config;
  } catch (err) {
    log.error('Failed to load configuration', err);
    process.exit(1);
  }
}

async function main() {
  runChecks();
  const scripts = await loadConfig();
  const app = instantiateServer();
  const queue = new AsyncQueue();

  // iterate over scripts and create routes
  for (const script in scripts) {
    const config = scripts[script] as unknown as Record<string, string>;
    configCheck(script, config);

    app.post(
      // current endpoint
      `/hooks/${config.id}`,

      // authentication
      config.auth && !isEmpty(config.password)
        ? basicAuth({ password: config.password, username: '' })
        : async (c, next) => {
            await next();
          },

      // run script
      async c => runScript(script, config, c, queue)
    );
  }

  // log endpoint
  app.post('/log', basicAuth({ password: process.env.LOG_KEY as string, username: '' }), async c => {
    const { level, message, rest }: Record<string, unknown> = await c.req.json();

    switch (level) {
      case 'error':
        log.error(message as string, ...(rest as string[]));
        break;
      case 'info':
        log.info(message as string, ...(rest as string[]));
        break;
      case 'warn':
        log.warn(message as string, ...(rest as string[]));
        break;
      case 'debug':
      default:
        log.debug(message as string, ...(rest as string[]));
        break;
    }

    return c.json({ logged: true });
  });

  // health check
  app.get('/health', c => c.json({ status: 'OK' }));

  // start server
  serve({ fetch: app.fetch, port: 3000 });
  log.info(`Sandman is accessible at http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`);
}

// check for required environment variables
function runChecks() {
  if (isEmpty(process.env.LOG_KEY)) {
    log.error('LOG_KEY environment variable is required');
    process.exit(1);
  }
}

async function runScript(script: string, config: Record<string, unknown>, ctx: Context, queue: AsyncQueue) {
  try {
    // wait for queue
    await queue.wait();

    // parse request body
    let payload;
    try {
      payload = await ctx.req.json();
    } catch {
      payload = await ctx.req.text();
    }

    log.info(`Executing \`${script}\` with payload:`, payload);

    // execute script
    let scriptsPath = `${process.cwd()}/scripts`;
    if (!isEmpty(process.env.OUTDIR)) scriptsPath = `${scriptsPath}/${process.env.OUTDIR}`;
    return ctx.json(
      await execa(config.js ? 'node' : './node_modules/.bin/tsx', [
        '--env-file=.env',
        '--experimental-specifier-resolution=node',
        `${scriptsPath}/${script}.${config.js ? 'js' : 'ts'}`,
        !isEmpty(payload) ? JSON.stringify(payload) : '',
      ])
    );
  } catch (error) {
    // return error
    log.error('Failed to execute hook', `\`${script}\``, error);
    return ctx.json({ status: 400, success: false });
  } finally {
    queue.shift();
  }
}

main();
