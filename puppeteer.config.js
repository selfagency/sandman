import { dirname, join } from 'node:path';

export default {
  cacheDirectory: join(dirname(), '.puppeteer'),
};
