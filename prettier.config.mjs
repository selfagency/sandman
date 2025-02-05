/** @type {import("prettier").Config} */

const config = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  plugins: ['prettier-plugin-organize-attributes'],
  printWidth: 120,
  proseWrap: 'preserve',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
};

export default config;
