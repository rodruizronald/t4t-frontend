import { config } from '@app/config'
import { Box, Button, Container, Typography } from '@mui/material'
import { type ErrorInfo, type ReactElement, type ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { logger } from '@/services/logging'

interface Props {
  error: Error
  resetErrorBoundary: () => void
}

interface ErrorBoundaryProviderProps {
  children: ReactNode
}

function handleError(error: Error, errorInfo: ErrorInfo) {
  const errorContext = {
    component: 'ErrorBoundaryProvider',
    action: 'catch-error',
    componentStack: errorInfo.componentStack ?? 'No component stack available',
    errorBoundary: true,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  }
  logger.error('React Error Boundary caught an error', errorContext, error)
}

function GlobalErrorFallback({ error, resetErrorBoundary }: Props) {
  const handleRetry = () => {
    // Log retry attempt
    logger.userAction('error-boundary-retry', 'ErrorBoundaryProvider', {
      errorMessage: error.message,
    })
    resetErrorBoundary()
  }

  const handleRefresh = () => {
    // Log refresh attempt
    logger.userAction('error-boundary-refresh', 'ErrorBoundaryProvider', {
      errorMessage: error.message,
    })
    window.location.reload()
  }

  return (
    <Container maxWidth='sm'>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minHeight='100vh'
        textAlign='center'
      >
        <Typography variant='h4' gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography variant='body1' color='text.secondary' paragraph>
          We're sorry for the inconvenience. Please try refreshing the page.
        </Typography>

        {/* Show error details in development */}
        {config.isDevelopment && (
          <Box mt={2} p={2} bgcolor='grey.100' borderRadius={1}>
            <Typography variant='caption' color='error' paragraph>
              <strong>Error:</strong> {error.message}
            </Typography>
            {error.stack && (
              <Typography
                variant='caption'
                color='error'
                component='pre'
                sx={{ fontSize: '0.7rem' }}
              >
                {error.stack}
              </Typography>
            )}
          </Box>
        )}

        <Box mt={2}>
          <Button variant='contained' onClick={handleRetry} sx={{ mr: 1 }}>
            Try Again
          </Button>
          <Button variant='outlined' onClick={handleRefresh}>
            Refresh Page
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export function ErrorBoundaryProvider({
  children,
}: ErrorBoundaryProviderProps): ReactElement {
  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onError={handleError}
      resetKeys={[window.location.pathname]} // Reset when route changes
    >
      {children}
    </ErrorBoundary>
  )
}
