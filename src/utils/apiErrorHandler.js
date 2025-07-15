/**
 * Handle API errors and provide user-friendly messages
 */

export const API_ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
}

/**
 * Determine error type from response or error object
 * @param {Error|Response} error - Error object or response
 * @returns {string} Error type constant
 */
export const getErrorType = error => {
  if (!navigator.onLine) {
    return API_ERROR_TYPES.NETWORK_ERROR
  }

  if (error.status) {
    if (error.status === 404) return API_ERROR_TYPES.NOT_FOUND
    if (error.status === 401 || error.status === 403)
      return API_ERROR_TYPES.UNAUTHORIZED
    if (error.status >= 400 && error.status < 500)
      return API_ERROR_TYPES.VALIDATION_ERROR
    if (error.status >= 500) return API_ERROR_TYPES.SERVER_ERROR
  }

  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return API_ERROR_TYPES.NETWORK_ERROR
  }

  return API_ERROR_TYPES.UNKNOWN_ERROR
}

/**
 * Get user-friendly error message
 * @param {string} errorType - Error type constant
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = errorType => {
  switch (errorType) {
    case API_ERROR_TYPES.NETWORK_ERROR:
      return 'Unable to connect to the server. Please check your internet connection.'

    case API_ERROR_TYPES.SERVER_ERROR:
      return 'Server is temporarily unavailable. Please try again later.'

    case API_ERROR_TYPES.NOT_FOUND:
      return 'The requested resource was not found.'

    case API_ERROR_TYPES.UNAUTHORIZED:
      return 'You are not authorized to access this resource.'

    case API_ERROR_TYPES.VALIDATION_ERROR:
      return 'Invalid request. Please check your search parameters.'

    default:
      return 'An unexpected error occurred. Please try again.'
  }
}
