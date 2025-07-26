import { config } from '@app/config'
import { QueryProvider } from '@app/providers/query'
import JobLayout from '@shared/components/layout/JobLayout'
import { useLogger } from '@shared/utils/logger'
import { type ReactElement } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

function App(): ReactElement {
  const logger = useLogger('App')

  logger.info('Application started with configuration', {
    environment: config.environment,
    logLevel: config.logLevel,
    apiUrl: config.apiUrl,
    logEndpoint: config.logEndpoint,
    logApiKey: config.logApiKey,
    isProduction: config.isProduction,
    isDevelopment: config.isDevelopment,
  })

  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/jobs/search' replace />} />
          <Route path='/jobs/search' element={<JobLayout />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  )
}

export default App
