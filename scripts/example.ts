import { log, payload } from './common';

async function main() {
  try {
    log.info('Hello, world!', payload);
  } catch (err) {
    log.error((err as Error).message);
  }
}

main();
