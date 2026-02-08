---
description: Linting configuration, tooling workflow, and development commands
applyTo: '**/*.{ts,tsx,js,jsx}'
---

# Linting & Tooling

## ESLint

- Flat config: TypeScript, React, React Native, Prettier plugins
- Strict type safety: enabled

## Console

- Console statements: errors
- Use logger from `src/util/logger.ts`

## Workflow

1. `yarn typecheck`
2. `yarn lint`
3. `yarn format`
