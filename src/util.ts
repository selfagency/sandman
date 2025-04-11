import { consola } from 'consola';
import errsole from 'errsole';
import ErrsoleSQLite from 'errsole-sqlite';
import { isEmpty } from 'radashi';
import stripAnsi from 'strip-ansi';

consola.wrapConsole();

errsole.initialize({
  appName: 'sandman',
  collectLogs: [],
  enableConsoleOutput: true,
  storage: new ErrsoleSQLite(`${process.cwd()}/data/logs.sqlite`),
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
