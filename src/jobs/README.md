# Jobs Domain

## Purpose

Contains all code related to the jobs feature - the main business domain of the application. This includes job search, filtering, display, and management functionality.

## What Goes Here

- **components/**: JobCard, JobDetails, JobFilters, JobSearch, etc.
- **hooks/**: useJobSearch, useJobFilters, useJobPagination, etc.
- **services/**: Job API calls, data transformations
- **utils/**: Job-specific date formatting, filter logic
- **constants/**: Filter options, job types, default values

## Usage Guidelines

- Keep all job-related code within this domain
- Components should use hooks for business logic
- Hooks should call services for data operations
- Use shared utilities only for generic functionality
- Maintain clear separation from other potential features

## Dependencies

- Can import from `shared/` directory
- Should NOT import from other feature directories
- External libraries and services are allowed
