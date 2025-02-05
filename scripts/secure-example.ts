import type { LoggerContext } from 'errsole';

export default async (data: Record<string, unknown>, log: LoggerContext) => {
  log.info('Hello, world!', data);

  return { success: true };
};
