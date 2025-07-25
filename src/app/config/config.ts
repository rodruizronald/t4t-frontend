interface AppConfig {
  apiUrl: string
  isProduction: boolean
  environment: 'development' | 'production' | 'staging'
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

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  isProduction: import.meta.env.PROD,
  environment: getValidEnvironment(import.meta.env.MODE),
}

export default config
