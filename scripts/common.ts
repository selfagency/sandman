export async function log(script: string, level: string, message: string) {
  try {
    const logMessage = `[${script}] ${message}`;

    switch (level) {
      case 'info':
        console.info(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'debug':
      default:
        console.debug(logMessage);
        break;
    }

    const res = await fetch(`http://localhost:${process.env.PORT || 3000}/log`, {
      method: 'POST',
      body: JSON.stringify({ script, message, level }),
      headers: {
        Authorization: `Basic ${btoa(':' + process.env.LOG_KEY)}`,
      },
    });

    if (res.status !== 200) {
      throw new Error(res.statusText);
    }
  } catch (err) {
    console.error('Failed to log', err);
  }
}
