# Project Architecture - Ticos in Tech Frontend

## Architecture Pattern: Feature-Based Domain-Driven Design

This project follows a **feature-based architecture** with clear separation between domain-specific code and shared resources. The structure is designed for scalability, maintainability, and developer productivity.

## Design Principles

1. **Domain-Driven**: Features are organized by business domain (jobs)
2. **Separation of Concerns**: Clear boundaries between feature logic and shared utilities
3. **Co-location**: Related code lives together for better discoverability
4. **Dependency Direction**: Features depend on shared, not vice versa
5. **Single Responsibility**: Each directory has one clear purpose

## Directory Structure

```
# Example directory structure
src/
├── features/
│   ├── jobs/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── jobsSlice.js
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
└── assets/
```

## Data Flow

1. **Components** use **hooks** for business logic
2. **Hooks** call **services** for data operations
3. **Services** handle external API communication
4. **Shared utilities** provide common functionality
5. **Constants** define configuration and options

## Benefits

- **Fast Development**: Easy to find related code
- **Clear Ownership**: Each feature has defined boundaries
- **Scalable**: Easy to add new features without affecting existing ones
- **Testable**: Clear separation makes testing easier
- **Maintainable**: Changes are localized to specific domains

## Adding New Features

When adding a new feature (e.g., `companies`):

1. Create `src/companies/` directory
2. Follow the same internal structure as `jobs/`
3. Keep shared code in `src/shared/`
4. Add feature-specific services if needed
