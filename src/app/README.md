# App Directory

## Purpose

Contains application-level configuration, setup, and initialization code that affects the entire application.

## What Goes Here

- **providers/**: React context providers (theme, auth, global state)
- **router/**: Application routing configuration and route definitions
- **config/**: App-wide configuration settings and environment variables

## Usage Guidelines

- Code here should be application-wide, not feature-specific
- Providers should wrap the entire app or large sections
- Configuration should be environment-aware
- Keep this directory minimal and focused on app initialization

## Examples

- Theme provider setup
- Router configuration with all routes
- Global error boundaries
- App-wide context providers
- Environment configuration
