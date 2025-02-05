import { log } from './util';
import { parse as toml } from 'smol-toml';
import { readFile } from 'fs/promises';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { execa } from 'execa';

async function main() {
  const app = new Hono();

  const scripts = toml(await readFile(`${process.cwd()}/config.toml`, 'utf8'));

  for (const script in scripts) {
    const current = scripts[script] as unknown as Record<string, string>;

    log.debug(current);

    app.post(`/hooks/${current.id}`, async c => {
      try {
        let data;
        try {
          data = await c.req.json();
          const result = await execa('tsx', [`${process.cwd()}/scripts/${current.script}`, JSON.stringify(data)]);
          return c.json(result);
        } catch {
          return c.json({ success: false, status: 400 });
        }
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
