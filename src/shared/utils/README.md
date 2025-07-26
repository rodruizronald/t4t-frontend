# React Logger

A comprehensive logging solution for React applications built on top of Winston, with support for external log aggregation services.

## Features

- React-specific logging methods (component lifecycle, user actions, performance metrics)
- Automatic context enrichment (component names, actions, timestamps)
- Sensitive data sanitization (passwords, tokens, API keys)
- Performance metric tracking
- External log service integration
- Colorized console output in development
- Session tracking for better debugging
- Custom React hook for component-level logging

## Installation

```bash
npm install winston
```

## Configuration

The logger uses a configuration object from `@app/config`. Ensure your config includes:

```typescript
interface Config {
  isProduction: boolean
  isDevelopment: boolean
  logEndpoint?: string // Optional: External logging service URL
  logApiKey?: string // Optional: API key for external service
}
```

## Basic Usage

### Import the Logger

```typescript
import reactLogger from '@/utils/logger'
// or use the hook
import { useLogger } from '@/utils/logger'
```

### Direct Logger Usage

```typescript
// Log an error
reactLogger.error(
  'Failed to fetch user data',
  {
    component: 'UserProfile',
    userId: '123',
  },
  new Error('Network error')
)

// Log a warning
reactLogger.warn('API response slow', {
  component: 'Dashboard',
  responseTime: 3000,
})

// Log info
reactLogger.info('User logged in', {
  component: 'LoginForm',
  userId: '123',
})

// Log debug (only visible in development)
reactLogger.debug('State updated', {
  component: 'Settings',
  previousValue: 'dark',
  newValue: 'light',
})
```

### Using the React Hook

The `useLogger` hook automatically includes the component name in all logs:

```typescript
import { useLogger } from '@/utils/logger';

function UserProfile({ userId }: { userId: string }) {
  const logger = useLogger('UserProfile');

  useEffect(() => {
    logger.info('Component initialized', { userId });

    fetchUserData(userId)
      .then(data => {
        logger.debug('User data fetched', { dataSize: data.length });
      })
      .catch(error => {
        logger.error('Failed to fetch user data', { userId }, error);
      });
  }, [userId]);

  const handleClick = () => {
    logger.userAction('button-click', { buttonId: 'save-profile' });
  };

  return <button onClick={handleClick}>Save Profile</button>;
}
```

## React-Specific Methods

### Component Lifecycle Logging

```typescript
// Log component mount
reactLogger.componentMount('UserProfile', { userId: '123', theme: 'dark' })

// Log component unmount
reactLogger.componentUnmount('UserProfile')
```

### User Actions

```typescript
// Log user interactions
reactLogger.userAction('form-submit', 'ContactForm', {
  formId: 'contact-us',
  fields: ['name', 'email', 'message'],
})

// Using the hook
const logger = useLogger('Navigation')
logger.userAction('menu-toggle', { isOpen: true })
```

### API Call Logging

```typescript
// Log API requests
const startTime = Date.now()

try {
  const response = await fetch('/api/users')
  const duration = Date.now() - startTime

  reactLogger.apiCall('GET', '/api/users', response.status, duration)
} catch (error) {
  reactLogger.apiCall('GET', '/api/users', 0, Date.now() - startTime)
}
```

### Performance Metrics

```typescript
// Track render times
const renderStart = performance.now()
// ... component renders ...
const renderTime = performance.now() - renderStart

reactLogger.performance('render-time', renderTime, 'UserList')

// Using the hook
const logger = useLogger('DataTable')
logger.performance('sort-duration', 45.2)
```

## Log Levels

The logger uses different log levels based on the environment:

- **Production**: Only `warn` and `error` levels are logged
- **Development**: All levels are logged (`debug`, `info`, `warn`, `error`)

## External Log Service Integration

When configured with a log endpoint, the logger automatically sends logs to your external service in production:

```typescript
// Logs are automatically sent with additional context:
{
  level: 'error',
  message: 'Failed to save user',
  component: 'UserForm',
  userId: '123',
  error: 'Network timeout',
  stack: '...',
  timestamp: '2024-01-15T10:30:00.000Z',
  userAgent: 'Mozilla/5.0...',
  url: 'https://app.com/users/123',
  sessionId: 'session-1705316400000-abc123'
}
```

## Sensitive Data Protection

The logger automatically sanitizes sensitive fields to prevent accidental logging of secrets:

```typescript
// This will log: { password: '[REDACTED]', apiKey: '[REDACTED]' }
reactLogger.componentMount('LoginForm', {
  username: 'john@example.com',
  password: 'super-secret',
  apiKey: 'sk-12345',
})
```

Fields containing these keywords are redacted: `password`, `token`, `apiKey`, `secret`, `key`

## Session Tracking

The logger automatically creates and tracks session IDs using sessionStorage, helping you trace all logs from a single user session. The session ID is included in all external log submissions.

## Best Practices

1. **Use the Hook in Components**: Prefer `useLogger` hook for automatic component context

   ```typescript
   const logger = useLogger('MyComponent')
   ```

2. **Log User Actions**: Track important user interactions for better debugging

   ```typescript
   logger.userAction('filter-applied', { filterType: 'date', value: '2024-01' })
   ```

3. **Include Relevant Context**: Add meaningful data to help with debugging

   ```typescript
   logger.error(
     'Payment failed',
     {
       orderId: order.id,
       amount: order.total,
       paymentMethod: 'card',
     },
     error
   )
   ```

4. **Track Performance**: Monitor critical operations

   ```typescript
   logger.performance('api-response-time', responseTime)
   ```

5. **Avoid Over-Logging**: In production, focus on warnings and errors to reduce noise

## TypeScript Support

The logger is fully typed. You can extend the `ReactLogContext` interface for your specific needs:

```typescript
import type { ReactLogContext } from '@/utils/logger'

interface MyLogContext extends ReactLogContext {
  customField?: string
  metrics?: {
    cpu: number
    memory: number
  }
}
```

## Examples

### Error Boundary Integration

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    reactLogger.error('React error boundary triggered', {
      component: errorInfo.componentStack,
      error: error.message,
      stack: error.stack,
    })
  }
}
```

### Redux Action Logging

```typescript
const loggerMiddleware = store => next => action => {
  reactLogger.debug('Redux action dispatched', {
    action: action.type,
    payload: action.payload,
  })

  return next(action)
}
```

### Form Validation Logging

```typescript
function ContactForm() {
  const logger = useLogger('ContactForm')

  const handleSubmit = async values => {
    logger.userAction('form-submit-attempt', { formId: 'contact' })

    try {
      await validateForm(values)
      logger.info('Form validation passed')
    } catch (error) {
      logger.warn('Form validation failed', {
        errors: error.validationErrors,
      })
    }
  }
}
```
