import errsole from 'errsole';
import ErrsoleSQLite from 'errsole-sqlite';

errsole.initialize({
  storage: new ErrsoleSQLite(`${process.cwd()}/data/logs.sqlite`),
  appName: 'sandman',
  enableConsoleOutput: true,
});

export { errsole as log };
