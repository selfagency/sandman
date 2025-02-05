import { log } from './common';

async function main() {
  try {
    log.info('Hello, world!');
  } catch (err) {
    console.error(err);
  }
}

main();
