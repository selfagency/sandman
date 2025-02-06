/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { dirname, join } = require('path');

export default {
  cacheDirectory: join(dirname(), '.puppeteer'),
};
