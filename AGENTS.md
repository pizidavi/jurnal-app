# Jurnal - Copilot Instructions

React Native/Expo voice journaling app with TypeScript + TailwindCSS via Uniwind

## Commands

- `yarn run typecheck` - TypeScript validation
- `yarn run lint` - ESLint
- `yarn run format` - Prettier

## Key Files

- `src/component/*`: Components (shared and screen-specific)
- `src/component/navigation/Navigation.tsx`: Top-level navigation container
- `src/component/navigation/BaseScreen.tsx`: Screen wrapper with safe area insets
- `src/config/*`: Configuration files
- `src/database/*`: Database schema and configuration
- `src/locale/*`: Localization files
- `src/service/*`: Services (AI, LLM, Audio, Note processing)
- `src/type/*`: Type definitions
- `src/utils/*`: Utility functions

## Guardrails

- DO NOT write code comments, or for complex logic keep the minimum.

## Code Conventions

### Component Structure

One component per file, default export. Use function declarations for components, arrow functions for utilities.

Component structure order:

1. Hook (e.g., `useNavigation()`)
2. Global state
3. State (`useState`)
4. Reference (`useRef`)
5. API (`useQuery`)
6. Memo (`useMemo`, `useDerivedValue`, `useStyle`)
7. Callback (`useCallback`)
8. Imperative handle
9. Method (plain functions)
10. Effect (`useEffect`)
11. Render

Add a comment above each section with the section name.

### Styling

- **TailwindCSS via uniwind**: Use className prop on React Native components.
- **Class merging**: Use `clx()` helper from `src/util/util.ts` (wraps `twMerge`) for conditional classes.
- **Global styles**: Modify `src/global.css` for Tailwind imports.
