/* Browser-safe structured logger — wraps console.* with consistent labelling */

type LogData = Record<string, unknown> | Error | unknown;

const isDev = process.env.NODE_ENV === 'development';

function prefix(level: string, context: string) {
  return `[${level.toUpperCase()}] [${context}]`;
}

export function createClientLogger(context: string) {
  return {
    info(msg: string, data?: LogData) {
      if (isDev) console.info(prefix('info', context), msg, ...(data !== undefined ? [data] : []));
    },
    warn(msg: string, data?: LogData) {
      console.warn(prefix('warn', context), msg, ...(data !== undefined ? [data] : []));
    },
    error(msg: string, data?: LogData) {
      console.error(prefix('error', context), msg, ...(data !== undefined ? [data] : []));
    },
    debug(msg: string, data?: LogData) {
      if (isDev) console.debug(prefix('debug', context), msg, ...(data !== undefined ? [data] : []));
    },
  };
}
