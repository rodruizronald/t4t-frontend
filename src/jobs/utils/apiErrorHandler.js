/**
 * Error types for better categorization
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
}

/**
 * Determine error type from error object
 * @param {Error} error - The error object
 * @returns {string} Error type constant
 */
export function getErrorType(error) {
  if (!error) return ERROR_TYPES.UNKNOWN

  // Network/Connection errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_TYPES.NETWORK
  }

  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return ERROR_TYPES.TIMEOUT
  }

  // HTTP status errors
  if (error.message.includes('404')) {
    return ERROR_TYPES.NOT_FOUND
  }

  if (error.message.includes('400') || error.message.includes('422')) {
    return ERROR_TYPES.VALIDATION
  }

  if (
    error.message.includes('500') ||
    error.message.includes('502') ||
    error.message.includes('503')
  ) {
    return ERROR_TYPES.SERVER
  }

  return ERROR_TYPES.UNKNOWN
}

/**
 * Get user-friendly error message for console logging
 * @param {string} errorType - Error type from getErrorType()
 * @param {Error} originalError - Original error object
 * @returns {string} Formatted error message
 */
export function getErrorMessage(errorType, originalError = null) {
  const baseMessages = {
    [ERROR_TYPES.NETWORK]:
      'Network connection failed - check internet connection',
    [ERROR_TYPES.TIMEOUT]: 'Request timed out - server may be slow',
    [ERROR_TYPES.SERVER]: 'Server error - try again later',
    [ERROR_TYPES.NOT_FOUND]: 'API endpoint not found - check configuration',
    [ERROR_TYPES.VALIDATION]: 'Invalid request parameters',
    [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred',
  }

  let message = baseMessages[errorType] || baseMessages[ERROR_TYPES.UNKNOWN]

  if (originalError?.message) {
    message += ` (${originalError.message})`
  }

  return message
}

/**
 * Enhanced console error logging with context
 * @param {string} context - Where the error occurred (e.g., 'Job Search API')
 * @param {Error} error - The error object
 * @param {Object} additionalData - Extra context data
 */
export function logApiError(context, error, additionalData = {}) {
  const errorType = getErrorType(error)
  const errorMessage = getErrorMessage(errorType, error)

  console.group(`🚨 API Error: ${context}`)
  console.error('Error Type:', errorType)
  console.error('Message:', errorMessage)
  console.error('Original Error:', error)

  if (Object.keys(additionalData).length > 0) {
    console.error('Additional Context:', additionalData)
  }

  console.groupEnd()
}
