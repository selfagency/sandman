import { log } from './common';

async function main() {
  try {
    await log('secure-example', 'info', 'Hello, world!');
  } catch (err) {
    console.error(err);
  }
}

main();
