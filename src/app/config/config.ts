import { z } from 'zod'

// Define the AppConfig interface for backward compatibility
interface AppConfig {
  apiUrl: string
  isProduction: boolean
  isDevelopment: boolean
  environment: 'development' | 'production' | 'staging'
  logLevel: 'error' | 'warn' | 'info' | 'debug'
  logEndpoint: string
  logApiKey: string
}

// Create the config using Zod
const createConfig = (): AppConfig => {
  const schema = z.object({
    apiUrl: z.url().catch('http://localhost:8080/api/v1'),

    isProduction: z.boolean(),
    isDevelopment: z.boolean(),

    environment: z
      .enum(['development', 'production', 'staging'])
      .catch('development'),

    logLevel: z.enum(['error', 'warn', 'info', 'debug']).catch('info'),

    logEndpoint: z.string().optional().default(''),
    logApiKey: z.string().optional().default(''),
  })

  try {
    return schema.parse({
      apiUrl: import.meta.env.VITE_API_BASE_URL,
      isProduction: import.meta.env.PROD,
      isDevelopment: import.meta.env.DEV,
      environment: import.meta.env.MODE,
      logLevel: import.meta.env.VITE_LOG_LEVEL,
      logEndpoint: import.meta.env.VITE_LOG_ENDPOINT,
      logApiKey: import.meta.env.VITE_LOG_API_KEY,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorDetails = error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ')

      console.error('Invalid Configuration:', errorDetails)
    }
    throw error
  }
}

// Create the config instance
const config: AppConfig = createConfig()

// Export as default to maintain compatibility
export default config
