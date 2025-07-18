/**
 * API configuration utilities
 */

/**
 * Get the API base URL based on the current environment
 * @returns {string} The API base URL
 */
export const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) {
    console.warn('VITE_API_BASE_URL environment variable is not set')
    return 'http://localhost:8080/api/v1' // fallback for development
  }

  return baseUrl
}

/**
 * Get the current environment mode
 * @returns {string} The current mode (development, production, etc.)
 */
export const getEnvironmentMode = (): string => {
  return import.meta.env.MODE
}

/**
 * Check if we're in development mode
 * @returns {boolean} True if in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV
}

/**
 * Check if we're in production mode
 * @returns {boolean} True if in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD
}
