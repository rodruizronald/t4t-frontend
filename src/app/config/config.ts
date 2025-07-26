interface AppConfig {
  apiUrl: string
  isProduction: boolean
  isDevelopment: boolean
  environment: 'development' | 'production' | 'staging'
  logLevel: 'error' | 'warn' | 'info' | 'debug'
  logEndpoint: string
  logApiKey: string
}

const getValidEnvironment = (mode: string): AppConfig['environment'] => {
  const validEnvironments: AppConfig['environment'][] = [
    'development',
    'production',
    'staging',
  ]
  return validEnvironments.includes(mode as AppConfig['environment'])
    ? (mode as AppConfig['environment'])
    : 'development'
}

const getValidLogLevel = (level: string): AppConfig['logLevel'] => {
  const validLevels: AppConfig['logLevel'][] = [
    'error',
    'warn',
    'info',
    'debug',
  ]
  return validLevels.includes(level as AppConfig['logLevel'])
    ? (level as AppConfig['logLevel'])
    : 'info'
}

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  environment: getValidEnvironment(import.meta.env.MODE),
  logLevel: getValidLogLevel(import.meta.env.VITE_LOG_LEVEL),
  logEndpoint: import.meta.env.VITE_LOG_ENDPOINT || '',
  logApiKey: import.meta.env.VITE_LOG_API_KEY || '',
}

export default config
