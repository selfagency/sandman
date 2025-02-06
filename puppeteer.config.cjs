/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { dirname, join } = require('path');

module.exports = {
  cacheDirectory: join(dirname(), '.puppeteer'),
};
