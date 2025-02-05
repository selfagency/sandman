export default async (data: Record<string, unknown>, log: Errsole.LoggerContext) => {
  log.info('Hello, world!', data);

  return { success: true };
};
