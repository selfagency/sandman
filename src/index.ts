import { execa } from 'execa';
import { Hono } from 'hono';
import { isEmpty } from 'radashi';
import { parse as toml } from 'smol-toml';
import { readFile } from 'fs/promises';
import { serve } from '@hono/node-server';
import { basicAuth } from 'hono/basic-auth';
import { logger } from 'hono/logger';
import { AsyncQueue } from '@sapphire/async-queue';
import stripAnsi from 'strip-ansi';

import { log } from './util';

async function main() {
  // check for required environment variables
  if (isEmpty(process.env.LOG_KEY)) {
    log.error('LOG_KEY environment variable is required');
    process.exit(1);
  }

  // import configuration
  let scripts;
  try {
    scripts = toml(await readFile(`${process.cwd()}/config.toml`, 'utf8'));
  } catch (err) {
    log.error('Failed to read configuration file', err);
    process.exit(1);
  }

  // instantiate web server
  const app = new Hono();
  app.use(logger((str: string, ...rest: string[]) => log.info(stripAnsi(str), ...rest)));

  // instantiate queue
  const queue = new AsyncQueue();

  // iterate over scripts and create routes
  for (const script in scripts) {
    const s = scripts[script] as unknown as Record<string, string>;

    if (s.auth && isEmpty(s.password)) {
      log.error(`'auth' is set to 'true' but 'password' is not set for script: ${script}`);
    }

    app.post(
      // current endpoint
      `/hooks/${s.id}`,

      // authentication
      s.auth && !isEmpty(s.password)
        ? basicAuth({ username: '', password: s.password })
        : async (c, next) => {
            await next();
          },

      // handle request
      async c => {
        try {
          await queue.wait();

          let data;
          try {
            // parse request body
            data = await c.req.json();

            // execute script
            const result = await execa(s.js ? 'node' : 'tsx', [
              '--env-file=.env',
              '--experimental-specifier-resolution=node',
              `${process.cwd()}/scripts/${script}.${s.js ? 'js' : 'ts'}`,
              !isEmpty(data) ? JSON.stringify(data) : '',
            ]);

            // return result
            return c.json(result);
          } catch {
            // log error
            log.error('Failed to execute hook', script);

            // return error
            return c.json({ success: false, status: 400 });
          }
        } catch (err) {
          // log error
          log.error('Failed to execute hook', script, err);

          // return error
          return c.json({ success: false, error: (err as Error).message });
        } finally {
          queue.shift();
        }
      }
    );
  }

  // log endpoint
  app.post('/log', basicAuth({ username: '', password: process.env.LOG_KEY as string }), async c => {
    const { level, message }: Record<string, string> = await c.req.json();

    switch (level) {
      case 'info':
        log.info(message);
        break;
      case 'error':
        log.error(message);
        break;
      case 'warn':
        log.warn(message);
        break;
      case 'debug':
      default:
        log.debug(message);
        break;
    }

    return c.json({ logged: true });
  });

  // health check
  app.get('/health', c => c.json({ status: 'OK' }));

  // start server
  serve({ fetch: app.fetch, port: 3000 });
}

main();
