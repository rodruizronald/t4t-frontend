# Services Directory

## Purpose

Contains external service integrations and infrastructure code that connects the application to outside systems and APIs.

## Example Structure

```
services/
├── api/
│   ├── client.py
│   └── utils.py
├── database/
│   ├── models.py
│   └── connection.py
└── messaging/
    ├── queue.py
    └── broker.py
```

## What Goes Here

- **api/**: HTTP client setup, interceptors, base configuration
- **storage/**: Browser storage utilities (localStorage, sessionStorage)
- **analytics/**: Analytics service integration (future)
- **notifications/**: Push notifications, toast services (future)

## Usage Guidelines

- Focus on external integrations, not business logic
- Provide generic, reusable service configurations
- Keep feature-specific API calls in feature directories
- Handle cross-cutting concerns like authentication, logging
- Configure global interceptors and error handling

## Examples

- Axios/fetch client configuration
- API base URLs and headers
- Storage utilities for persisting user preferences
- Global error handling and logging

## vs. Feature Services

- **services/**: Generic, reusable service configuration
- **jobs/services/**: Job-specific API calls and business logic
