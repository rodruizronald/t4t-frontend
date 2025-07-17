# Shared Directory

## Purpose

Contains reusable code that can be used across multiple features or throughout the entire application. This is the foundation layer that features build upon.

## Structure

```
# Example directory tree
shared/
├── utils/
│   ├── helper.js
│   └── logger.js
├── models/
│   ├── user.js
│   └── product.js
└── services/
    ├── auth.js
    └── payment.js
```

## What Goes Here

- **components/ui/**: Button, Input, Modal, Chip - generic UI elements
- **components/layout/**: Header, Footer, Sidebar - layout components
- **components/feedback/**: Loading, Error, Empty states
- **hooks/**: useDebounce, useLocalStorage, useApi - generic hooks
- **utils/**: Date formatters, validators, helpers - pure functions
- **constants/**: Routes, configuration - app-wide constants

## Usage Guidelines

- Code must be generic and reusable across features
- No feature-specific logic or dependencies
- Components should be highly configurable via props
- Utilities should be pure functions with no side effects
- Follow single responsibility principle

## Quality Standards

- Well-documented with clear APIs
- Thoroughly tested (unit tests)
- TypeScript types for better developer experience
- Consistent naming conventions

## Dependencies

- Can only import from other shared modules
- Should NOT import from feature directories
- External libraries are allowed for generic functionality
