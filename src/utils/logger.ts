/**
 * @fileoverview Development-only logger utility
 * 
 * This module provides a console wrapper that only logs in development mode.
 * In production builds, all log calls are silently ignored, preventing
 * sensitive information from appearing in browser consoles.
 * 
 * @module utils/logger
 * 
 * @example
 * ```ts
 * import { logger } from '@/utils/logger';
 * 
 * // Basic logging
 * logger.info('User logged in:', userId);
 * logger.error('Failed to fetch data:', error);
 * 
 * // Grouped logging for related operations
 * logger.group('API Request');
 * logger.log('URL:', url);
 * logger.log('Method:', method);
 * logger.groupEnd();
 * 
 * // Performance timing
 * logger.time('fetchData');
 * await fetchData();
 * logger.timeEnd('fetchData'); // Logs: fetchData: 123ms
 * 
 * // Tabular data
 * logger.table(users);
 * ```
 */

const isDev = import.meta.env.DEV;

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

/**
 * Creates a log method that only executes in development mode
 * @param level - The console method to wrap
 * @returns A function that logs only in development
 */
const createLogMethod = (level: LogLevel) => {
  return (...args: unknown[]) => {
    if (isDev) {
      console[level](...args);
    }
  };
};

/**
 * Development-only logger instance
 * 
 * All methods are no-ops in production builds, making it safe to leave
 * logging statements in production code.
 */
export const logger = {
  /**
   * General purpose logging (console.log equivalent)
   * @param args - Values to log
   */
  log: createLogMethod('log'),
  
  /**
   * Informational messages (console.info equivalent)
   * @param args - Values to log
   */
  info: createLogMethod('info'),
  
  /**
   * Warning messages (console.warn equivalent)
   * @param args - Values to log
   */
  warn: createLogMethod('warn'),
  
  /**
   * Error messages (console.error equivalent)
   * @param args - Values to log
   */
  error: createLogMethod('error'),
  
  /**
   * Debug messages (console.debug equivalent)
   * @param args - Values to log
   */
  debug: createLogMethod('debug'),
  
  /**
   * Start a named console group (expanded by default)
   * @param label - Group label displayed in console
   */
  group: (label: string) => {
    if (isDev) console.group(label);
  },
  
  /**
   * End the current console group
   */
  groupEnd: () => {
    if (isDev) console.groupEnd();
  },
  
  /**
   * Start a named console group (collapsed by default)
   * @param label - Group label displayed in console
   */
  groupCollapsed: (label: string) => {
    if (isDev) console.groupCollapsed(label);
  },
  
  /**
   * Display tabular data in a formatted table
   * @param data - Array or object to display as table
   */
  table: (data: unknown) => {
    if (isDev) console.table(data);
  },
  
  /**
   * Start a named timer for performance measurement
   * @param label - Timer identifier (used with timeEnd)
   */
  time: (label: string) => {
    if (isDev) console.time(label);
  },
  
  /**
   * Stop a named timer and log the elapsed time
   * @param label - Timer identifier (started with time)
   */
  timeEnd: (label: string) => {
    if (isDev) console.timeEnd(label);
  },
};

export default logger;
