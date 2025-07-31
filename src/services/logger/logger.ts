import { config } from '@app/config'
import { pino } from 'pino'

import type { ReactLogContext } from './types'

// Session ID management
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('log-session-id')
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    sessionStorage.setItem('log-session-id', sessionId)
  }
  return sessionId
}

// External logging function with flexible typing
const sendLogToExternal = async (
  logEvent: Record<string, unknown>
): Promise<void> => {
  if (!config.logEndpoint || !config.isProduction) return

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
        ...logEvent,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: getSessionId(),
      }),
    })
  } catch (error) {
    console.warn('Failed to send log to external service:', error)
  }
}

// Create browser-compatible Pino logger
const baseLogger = pino({
  browser: {
    serialize: true,
    asObject: config.isProduction,
    transmit: {
      level: 'error',
      send: async (_level, logEvent) => {
        // Convert Pino's LogEvent to a plain object for external service
        await sendLogToExternal({ ...logEvent } as Record<string, unknown>)
      },
    },
  },
  level: config.logLevel,
  formatters: {
    level: label => {
      return { level: label.toUpperCase() }
    },
  },
})

class ReactLogger {
  private logger = baseLogger

  // Enhanced logging methods with React context
  error(message: string, context?: ReactLogContext, error?: Error) {
    const logData = {
      ...context,
      timestamp: new Date().toISOString(),
      ...(error && {
        err: error,
        errorMessage: error.message,
        errorStack: error.stack,
      }),
    }

    this.logger.error(logData, message)

    // Send simplified data to external service
    if (config.isProduction) {
      sendLogToExternal({
        level: 'error',
        message,
        ...logData,
      })
    }
  }

  warn(message: string, context?: ReactLogContext) {
    const logData = {
      ...context,
      timestamp: new Date().toISOString(),
    }

    this.logger.warn(logData, message)

    // Also send warnings to external service in production
    if (config.isProduction) {
      sendLogToExternal({
        level: 'warn',
        message,
        ...logData,
      })
    }
  }

  info(message: string, context?: ReactLogContext) {
    const logData = {
      ...context,
      timestamp: new Date().toISOString(),
    }

    this.logger.info(logData, message)

    // Optionally send info logs to external service
    if (config.isProduction) {
      sendLogToExternal({
        level: 'info',
        message,
        ...logData,
      })
    }
  }

  debug(message: string, context?: ReactLogContext) {
    const logData = {
      ...context,
      timestamp: new Date().toISOString(),
    }

    this.logger.debug(logData, message)
  }

  // React-specific methods
  componentMount(componentName: string, props?: Record<string, unknown>) {
    const context: ReactLogContext = {
      component: componentName,
      action: 'mount',
    }

    const sanitizedProps = this.sanitizeProps(props)
    if (sanitizedProps !== undefined) {
      context.props = sanitizedProps
    }

    this.info('Component mounted', context)
  }

  componentUnmount(componentName: string) {
    this.debug('Component unmounted', {
      component: componentName,
      action: 'unmount',
    })
  }

  userAction(
    action: string,
    component: string,
    data?: Record<string, unknown>
  ) {
    this.info('User action', {
      component,
      action,
      ...data,
    })
  }

  apiCall(method: string, url: string, status?: number, duration?: number) {
    const context: ReactLogContext = {
      action: 'api-call',
      method,
      url,
      ...(status !== undefined && { status }),
      ...(duration !== undefined && { duration }),
    }

    const isError = status && status >= 400
    const message = `API call ${method} ${url}`

    if (isError) {
      this.error(message, context)
    } else {
      this.info(message, context)
    }
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

    this.debug('Performance metric', context)
  }

  // Sanitize props to avoid logging sensitive data
  private sanitizeProps(
    props?: Record<string, unknown>
  ): Record<string, unknown> | undefined {
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
const reactLogger = new ReactLogger()

export default reactLogger
export type { ReactLogContext }
