---
description: API client configuration, state management patterns, and data flow conventions
applyTo: 'src/**/*.{ts,tsx}'
---

# Data Flow & State Management

## API (`src/api/axios.ts`)

Axios interceptors:

- Request: logs API calls
- Response: validates `{code, message}`
- Error: logs and re-throws

## State

### Server State

- Library: TanStack Query
- Stale time: 60s

### Client State

- Library: Zustand
- Status: configured, not used

## Styling

- Library: TailwindCSS via uniwind
- Utility: `clx` for class merging
- Location: component-level + `src/global.css`
