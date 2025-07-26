import { config } from '@app/config'
import winston, { Logger } from 'winston'

// Simple external logging function
const sendLogToExternal = async (logData: any) => {
  if (!config.logEndpoint) return

  try {
    await fetch(config.logEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.logApiKey && {
          Authorization: `Bearer ${config.logApiKey}`,
        }),
      },
      body: JSON.stringify({
        ...logData,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: getSessionId(),
      }),
    })
  } catch (error) {
    console.warn('Failed to send log to external service:', error)
  }
}

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('log-session-id')
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('log-session-id', sessionId)
  }
  return sessionId
}

// Create logger instance
const logger: Logger = winston.createLogger({
  level: config.isProduction ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.metadata({
      fillExcept: ['message', 'level', 'timestamp', 'component', 'action'],
    }),
    winston.format.json()
  ),
  transports: [
    // Console transport with conditional formatting
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        config.isDevelopment
          ? winston.format.colorize()
          : winston.format.uncolorize(),
        winston.format.printf(
          ({ timestamp, level, message, component, action, ...meta }) => {
            const componentInfo = component ? `[${component}]` : ''
            const actionInfo = action ? `{${action}}` : ''
            const metaInfo =
              Object.keys(meta).length > 0 ? JSON.stringify(meta) : ''

            return `${timestamp} ${level}: ${componentInfo}${actionInfo} ${message} ${metaInfo}`
          }
        )
      ),
    }),
  ],

  // Handle uncaught exceptions and rejections
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
  exitOnError: false,
})

// React-specific logger interface
interface ReactLogContext {
  component?: string
  action?: string
  userId?: string
  props?: Record<string, any>
  state?: Record<string, any>
  metric?: string
  value?: number
  [key: string]: any
}

class ReactLogger {
  private logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  // Enhanced logging methods with React context
  error(message: string, context?: ReactLogContext, error?: Error) {
    const logData = {
      level: 'error',
      message,
      ...context,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    }

    this.logger.error(message, logData)

    // Send to external service in production
    if (config.isProduction) {
      sendLogToExternal(logData)
    }
  }

  warn(message: string, context?: ReactLogContext) {
    const logData = {
      level: 'warn',
      message,
      ...context,
      timestamp: new Date().toISOString(),
    }

    this.logger.warn(message, logData)

    if (config.isProduction) {
      sendLogToExternal(logData)
    }
  }

  info(message: string, context?: ReactLogContext) {
    const logData = {
      level: 'info',
      message,
      ...context,
      timestamp: new Date().toISOString(),
    }

    this.logger.info(message, logData)

    if (config.isProduction) {
      sendLogToExternal(logData)
    }
  }

  debug(message: string, context?: ReactLogContext) {
    const logData = {
      level: 'debug',
      message,
      ...context,
      timestamp: new Date().toISOString(),
    }

    this.logger.debug(message, logData)

    if (config.isProduction) {
      sendLogToExternal(logData)
    }
  }

  // React-specific methods
  componentMount(componentName: string, props?: Record<string, any>) {
    const context: ReactLogContext = {
      component: componentName,
      action: 'mount',
    }

    const sanitizedProps = this.sanitizeProps(props)
    if (sanitizedProps !== undefined) {
      context.props = sanitizedProps
    }

    this.info(`Component mounted`, context)
  }

  componentUnmount(componentName: string) {
    this.debug(`Component unmounted`, {
      component: componentName,
      action: 'unmount',
    })
  }

  userAction(action: string, component: string, data?: Record<string, any>) {
    this.info(`User action`, {
      component,
      action,
      ...data,
    })
  }

  apiCall(method: string, url: string, status?: number, duration?: number) {
    const level = status && status >= 400 ? 'error' : 'info'
    this.logger.log(level, `API call ${method} ${url}`, {
      action: 'api-call',
      method,
      url,
      status,
      duration,
    })
  }

  performance(metric: string, value: number, component?: string) {
    const context: ReactLogContext = {
      action: 'performance',
      metric,
      value,
    }

    if (component !== undefined) {
      context.component = component
    }

    this.debug(`Performance metric`, context)
  }

  // Sanitize props to avoid logging sensitive data
  private sanitizeProps(
    props?: Record<string, any>
  ): Record<string, any> | undefined {
    if (!props) return undefined

    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'key']
    const sanitized = { ...props }

    Object.keys(sanitized).forEach(key => {
      if (
        sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))
      ) {
        sanitized[key] = '[REDACTED]'
      }
    })

    return sanitized
  }
}

// Create and export the React logger instance
const reactLogger = new ReactLogger(logger)

export default reactLogger
export type { ReactLogContext }

// Hook for easy component-level logging
export const useLogger = (componentName: string) => {
  return {
    error: (
      message: string,
      context?: Omit<ReactLogContext, 'component'>,
      error?: Error
    ) =>
      reactLogger.error(
        message,
        { ...context, component: componentName },
        error
      ),

    warn: (message: string, context?: Omit<ReactLogContext, 'component'>) =>
      reactLogger.warn(message, { ...context, component: componentName }),

    info: (message: string, context?: Omit<ReactLogContext, 'component'>) =>
      reactLogger.info(message, { ...context, component: componentName }),

    debug: (message: string, context?: Omit<ReactLogContext, 'component'>) =>
      reactLogger.debug(message, { ...context, component: componentName }),

    userAction: (action: string, data?: Record<string, any>) =>
      reactLogger.userAction(action, componentName, data),

    performance: (metric: string, value: number) =>
      reactLogger.performance(metric, value, componentName),
  }
}
