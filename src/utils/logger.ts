/**
 * Development-only logger utility
 * Wraps console methods to only log in development mode
 * In production, all logs are silently ignored
 */

const isDev = import.meta.env.DEV;

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const createLogMethod = (level: LogLevel) => {
  return (...args: unknown[]) => {
    if (isDev) {
      console[level](...args);
    }
  };
};

export const logger = {
  log: createLogMethod('log'),
  info: createLogMethod('info'),
  warn: createLogMethod('warn'),
  error: createLogMethod('error'),
  debug: createLogMethod('debug'),
  
  // Group methods for organized logging
  group: (label: string) => {
    if (isDev) console.group(label);
  },
  groupEnd: () => {
    if (isDev) console.groupEnd();
  },
  groupCollapsed: (label: string) => {
    if (isDev) console.groupCollapsed(label);
  },
  
  // Table for structured data
  table: (data: unknown) => {
    if (isDev) console.table(data);
  },
  
  // Time tracking
  time: (label: string) => {
    if (isDev) console.time(label);
  },
  timeEnd: (label: string) => {
    if (isDev) console.timeEnd(label);
  },
};

export default logger;
