import logger from './logger'
import type { LogContext } from './types'

// Hook for easy component-level logging
export const useLogger = (componentName: string) => {
  return {
    error: (
      message: string,
      context?: Omit<LogContext, 'component'>,
      error?: Error
    ) => logger.error(message, { ...context, component: componentName }, error),

    warn: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.warn(message, { ...context, component: componentName }),

    info: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.info(message, { ...context, component: componentName }),

    debug: (message: string, context?: Omit<LogContext, 'component'>) =>
      logger.debug(message, { ...context, component: componentName }),

    userAction: (action: string, data?: Record<string, unknown>) =>
      logger.userAction(action, componentName, data),

    performance: (metric: string, value: number) =>
      logger.performance(metric, value, componentName),
  }
}
