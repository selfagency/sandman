import { log } from './common';

async function main() {
  try {
    log.info('Hello, world!');
  } catch (err) {
    log.error((err as Error).message);
  }
}

main();
