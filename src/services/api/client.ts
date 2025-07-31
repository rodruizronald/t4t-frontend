import { config } from '@app/config'
import logger from '@services/logger/logger'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ApiError {
  message: string
  type: string
  status?: number
}

export class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string = config.apiUrl) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      request => {
        // Add request ID for tracking
        const requestId = this.generateRequestId()
        request.headers['X-Request-ID'] = requestId

        // Add timestamp for request timing
        const timestamp = Date.now()
        request.headers['X-Request-Timestamp'] = timestamp.toString()

        // Log request
        logger.info('API request initiated', {
          method: request.method?.toUpperCase() ?? 'UNKNOWN',
          url: request.url ?? 'unknown',
          requestId,
          timestamp: new Date(timestamp).toISOString(),
        })

        return request
      },
      error => {
        logger.error('API request setup failed', {}, error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      response => {
        const duration =
          Date.now() - parseInt(response.config.headers['X-Request-Timestamp'])
        const requestId = response.config.headers['X-Request-ID']

        logger.apiCall(
          response.config.method?.toUpperCase() ?? 'UNKNOWN',
          response.config.url ?? 'unknown',
          response.status,
          duration
        )

        logger.debug('API response received', {
          status: response.status,
          requestId: requestId ?? 'unknown',
          duration,
          url: response.config.url ?? 'unknown',
        })

        return response
      },
      error => {
        return this.handleError(error)
      }
    )
  }

  private handleError(error: unknown): Promise<never> {
    let apiError: ApiError

    if (axios.isAxiosError(error) && error.response) {
      // Server responded with error status
      const { status, data } = error.response
      const requestId = error.config?.headers?.['X-Request-ID']
      const duration = error.config?.headers?.['X-Request-Timestamp']
        ? Date.now() - parseInt(error.config.headers['X-Request-Timestamp'])
        : undefined

      switch (status) {
        case 400:
          apiError = {
            message:
              data?.message ?? 'Invalid request. Please check your input.',
            type: 'BAD_REQUEST',
            status: 400,
          }
          break
        case 403:
          apiError = {
            message: 'Access forbidden.',
            type: 'FORBIDDEN',
            status: 403,
          }
          break
        case 404:
          apiError = {
            message: 'Resource not found.',
            type: 'NOT_FOUND',
            status: 404,
          }
          break
        case 429:
          apiError = {
            message: 'Too many requests. Please try again later.',
            type: 'RATE_LIMITED',
            status: 429,
          }
          break
        case 500:
          apiError = {
            message: 'Internal server error. Please try again later.',
            type: 'SERVER_ERROR',
            status: 500,
          }
          break
        case 503:
          apiError = {
            message: 'Service temporarily unavailable. Please try again later.',
            type: 'SERVICE_UNAVAILABLE',
            status: 503,
          }
          break
        default:
          apiError = {
            message: data?.message ?? `Request failed with status ${status}`,
            type: 'API_ERROR',
            status,
          }
      }

      // Log API call with error status
      logger.apiCall(
        error.config?.method?.toUpperCase() ?? 'UNKNOWN',
        error.config?.url ?? 'unknown',
        status,
        duration
      )

      // Log detailed error information
      logger.error('API request failed', {
        errorType: apiError.type,
        status,
        requestId: requestId ?? 'unknown',
        url: error.config?.url ?? 'unknown',
        method: error.config?.method?.toUpperCase() ?? 'UNKNOWN',
        responseData: data,
      })
    } else if (axios.isAxiosError(error) && error.request) {
      // Network error - no response received
      apiError = {
        message: 'Network error. Please check your connection.',
        type: 'NETWORK_ERROR',
      }

      logger.error('Network error occurred', {
        errorType: 'NETWORK_ERROR',
        url: error.config?.url ?? 'unknown',
        method: error.config?.method?.toUpperCase() ?? 'UNKNOWN',
        requestId: error.config?.headers?.['X-Request-ID'],
      })
    } else if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      // Request timeout
      apiError = {
        message: 'Request timeout. Please try again.',
        type: 'TIMEOUT_ERROR',
      }

      logger.error('Request timeout', {
        errorType: 'TIMEOUT_ERROR',
        url: error.config?.url ?? 'unknown',
        method: error.config?.method?.toUpperCase() ?? 'UNKNOWN',
        timeout: error.config?.timeout,
        requestId: error.config?.headers?.['X-Request-ID'],
      })
    } else {
      // Other error
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'
      apiError = {
        message: errorMessage,
        type: 'UNKNOWN_ERROR',
      }

      logger.error(
        'Unknown API error',
        {
          errorType: 'UNKNOWN_ERROR',
          errorMessage,
        },
        error instanceof Error ? error : undefined
      )
    }

    return Promise.reject(apiError)
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  // Generic HTTP methods
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config)
    return response.data
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config)
    return response.data
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config)
    return response.data
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(
      url,
      data,
      config
    )
    return response.data
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config)
    return response.data
  }

  // Utility methods for common patterns

  /**
   * Make multiple requests in parallel
   */
  async all<T extends unknown[]>(requests: Promise<unknown>[]): Promise<T> {
    logger.debug('Executing parallel requests', {
      requestCount: requests.length,
    })
    return Promise.all(requests) as Promise<T>
  }

  /**
   * Create a cancel token for request cancellation
   */
  createCancelToken() {
    const cancelToken = axios.CancelToken.source()
    logger.debug('Cancel token created')
    return cancelToken
  }

  /**
   * Check if error is a cancellation
   */
  isCancel(error: unknown): boolean {
    const isCancelled = axios.isCancel(error)
    if (isCancelled) {
      logger.debug('Request was cancelled')
    }
    return isCancelled
  }

  /**
   * Retry a request with exponential backoff
   */
  async retry<T>(
    fn: () => Promise<T>,
    options: {
      retries?: number
      delay?: number
      backoff?: number
      shouldRetry?: (error: ApiError) => boolean
    } = {}
  ): Promise<T> {
    const {
      retries = 3,
      delay = 1000,
      backoff = 2,
      shouldRetry = error =>
        error.status === 503 || error.type === 'NETWORK_ERROR',
    } = options

    logger.debug('Starting retry operation', {
      retries,
      delay,
      backoff,
    })

    let lastError: ApiError | undefined

    for (let i = 0; i < retries; i++) {
      try {
        const result = await fn()
        if (i > 0) {
          logger.info('Retry operation succeeded', {
            attempt: i + 1,
            totalRetries: retries,
          })
        }
        return result
      } catch (error) {
        lastError = error as ApiError

        logger.warn('Retry attempt failed', {
          attempt: i + 1,
          totalRetries: retries,
          errorType: lastError.type,
          errorMessage: lastError.message,
          willRetry: i < retries - 1 && shouldRetry(lastError),
        })

        if (i === retries - 1 || !shouldRetry(lastError)) {
          logger.error('Retry operation failed permanently', {
            totalAttempts: i + 1,
            finalError: lastError.type,
          })
          throw lastError
        }

        const waitTime = delay * Math.pow(backoff, i)
        logger.debug('Waiting before retry', {
          waitTime,
          nextAttempt: i + 2,
        })
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    // This point should never be reached due to the throw in the catch block,
    // but TypeScript needs this for type safety
    throw lastError ?? new Error('Retry failed')
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient()

// Export types
export type { AxiosRequestConfig, AxiosResponse }
