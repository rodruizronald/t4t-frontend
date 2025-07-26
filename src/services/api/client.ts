import { config } from '@app/config'
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
        request.headers['X-Request-ID'] = this.generateRequestId()

        // Add timestamp for request timing
        request.headers['X-Request-Timestamp'] = Date.now().toString()

        // Log request in development
        if (config.isDevelopment) {
          console.log(
            `API Request: ${request.method?.toUpperCase()} ${request.url}`
          )
        }

        return request
      },
      error => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      response => {
        // Log response in development
        if (config.isDevelopment) {
          const duration =
            Date.now() -
            parseInt(response.config.headers['X-Request-Timestamp'])
          console.log(
            `API Response: ${response.status} ${response.config.url} (${duration}ms)`
          )
        }

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
    } else if (axios.isAxiosError(error) && error.request) {
      // Network error - no response received
      apiError = {
        message: 'Network error. Please check your connection.',
        type: 'NETWORK_ERROR',
      }
    } else if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      // Request timeout
      apiError = {
        message: 'Request timeout. Please try again.',
        type: 'TIMEOUT_ERROR',
      }
    } else {
      // Other error
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'
      apiError = {
        message: errorMessage,
        type: 'UNKNOWN_ERROR',
      }
    }

    // Log error in development
    if (config.isDevelopment) {
      console.error('API Error:', apiError)
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
    return Promise.all(requests) as Promise<T>
  }

  /**
   * Create a cancel token for request cancellation
   */
  createCancelToken() {
    return axios.CancelToken.source()
  }

  /**
   * Check if error is a cancellation
   */
  isCancel(error: unknown): boolean {
    return axios.isCancel(error)
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

    let lastError: ApiError | undefined

    for (let i = 0; i < retries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as ApiError

        if (i === retries - 1 || !shouldRetry(lastError)) {
          throw lastError
        }

        const waitTime = delay * Math.pow(backoff, i)
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
