import { log } from './util';
import { parse as toml } from 'smol-toml';
import { readFile } from 'fs/promises';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

async function main() {
  const app = new Hono();

  const scripts = toml(await readFile(`${process.cwd()}/config.toml`, 'utf8'));
  for (const script in scripts) {
    const current = scripts[script] as unknown as Record<string, string>;

    log.debug(current);

    app.post(`/hooks/${current.id}`, async c => {
      try {
        await import(`./scripts/${current?.script}`).then(async module => {
          let data;
          try {
            data = await c.req.json();
            const result = await module(data, log);
            return c.json(result);
          } catch {
            return c.json({ success: false, status: 400 });
          }
        });
      } catch (err) {
        log.error(err);
        return c.json({ success: false, error: (err as Error).message });
      }
    });
  }

  app.get('/', c => c.json({ status: 'OK' }));
  serve({ fetch: app.fetch, port: 3000 });
}

main();
