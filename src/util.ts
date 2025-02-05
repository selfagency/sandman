import errsole from 'errsole';
import ErrsoleSQLite from 'errsole-sqlite';
import { consola } from 'consola';
import stripAnsi from 'strip-ansi';
import { isEmpty } from 'radashi';

consola.wrapConsole();

errsole.initialize({
  storage: new ErrsoleSQLite(`${process.cwd()}/data/logs.sqlite`),
  appName: 'sandman',
  enableConsoleOutput: true,
  collectLogs: [],
});

const log = {
  debug(message: string, ...rest: unknown[]) {
    if (isEmpty(process.env.NODE_ENV) || process.env.NODE_ENV === 'development') {
      consola.debug(message, ...rest);
      errsole.debug(stripAnsi(message), ...rest);
    }
  },
  error(message: string, ...rest: unknown[]) {
    consola.error(message, ...rest);
    errsole.error(stripAnsi(message), ...rest);
  },
  info(message: string, ...rest: unknown[]) {
    consola.info(message, ...rest);
    errsole.info(stripAnsi(message), ...rest);
  },
  log(message: string, ...rest: unknown[]) {
    consola.log(message, ...rest);
    errsole.log(stripAnsi(message), ...rest);
  },
  warn(message: string, ...rest: unknown[]) {
    consola.warn(message, ...rest);
    errsole.warn(stripAnsi(message), ...rest);
  },
};

export { errsole, log };
