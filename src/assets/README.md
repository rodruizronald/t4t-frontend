# Assets Directory

## Purpose

Contains static assets that are imported and processed by the build system (Vite). These assets are optimized, bundled, and can be imported in components.

## What Goes Here

- **images/**: Component images, illustrations, photos
- **icons/**: SVG icons, icon sets used in components
- **fonts/**: Custom fonts (if not loaded via CDN)

## Usage Guidelines

- Import assets in components: `import logo from '../assets/images/logo.svg'`
- Use for assets that need build-time optimization
- Organize by type (images, icons, fonts)
- Use descriptive filenames

## vs. public/ Directory

- **assets/**: Imported in code, processed by build tool, optimized
- **public/**: Served directly, accessed via absolute URLs, not processed

## Examples

```javascript
import companyLogo from '../assets/images/company-logo.png'
import SearchIcon from '../assets/icons/search.svg'
```
