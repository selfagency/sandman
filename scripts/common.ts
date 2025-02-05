async function transport(level: string, message: string, rest: string[]) {
  try {
    await fetch(`http://localhost:${process.env.PORT || 3000}/log`, {
      method: 'POST',
      body: JSON.stringify({ message, level, rest }),
      headers: {
        Authorization: `Basic ${btoa(':' + process.env.LOG_KEY)}`,
      },
    });

    return { message, success: true };
  } catch (err) {
    console.error(err);
    return { message, success: false };
  }
}

export const log = {
  error(message: string, ...rest: string[]) {
    const script = process.argv[1]
      .split('/')
      .pop()
      ?.replace(/\.[jt]s/, '') as string;
    const logMessage = `[${script}] ${message}`;
    transport('error', logMessage, rest).then(() => console.error(logMessage, ...rest));
  },
  warn(message: string, ...rest: string[]) {
    const script = process.argv[1]
      .split('/')
      .pop()
      ?.replace(/\.[jt]s/, '') as string;
    const logMessage = `[${script}] ${message}`;
    transport('warn', logMessage, rest).then(() => console.warn(logMessage, ...rest));
  },
  info(message: string, ...rest: string[]) {
    const script = process.argv[1]
      .split('/')
      .pop()
      ?.replace(/\.[jt]s/, '') as string;
    const logMessage = `[${script}] ${message}`;
    transport('info', logMessage, rest).then(() => console.info(logMessage, ...rest));
  },
  debug(message: string, ...rest: string[]) {
    const script = process.argv[1]
      .split('/')
      .pop()
      ?.replace(/\.[jt]s/, '') as string;
    const logMessage = `[${script}] ${message}`;
    transport('debug', logMessage, rest).then(() => console.debug(logMessage, ...rest));
  },
};
