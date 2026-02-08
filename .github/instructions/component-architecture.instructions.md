---
description: Component structure, organization, and architectural patterns for React Native components
applyTo: 'src/**/*.{ts,tsx}'
---

# Component Architecture

- **One component/file**, default export
- **Component = function**, utility = arrow const
- **Component order**: Hook → Global state → State → Reference → API → Memo → Callback → Imperative handle → Method → Effect → Render

```tsx
type ComponentProps = {};

function Component(props: ComponentProps) {
  // Hook
  const navigation = useNavigation();
  // Global state
  const user = useRecoilValue(userState);
  // State
  const [state, setState] = useState();
  // Reference
  const myRef = useRef();
  // Api
  const apiQuery = useQuery();
  // Memo
  const memo = useMemo(() => {}, []);
  const animationValue = useDerivedValue(() => {}, []);
  const viewStyle = useStyle(() => {}, []);
  // Callback
  const callback = useCallback(() => {}, []);
  // Imperative handle
  useImperativeHandle(ref, () => {}, []);
  // Method
  const method = () => {};
  // Effect
  useEffect(() => {}, []);
  // Render
  return <View />;
}

export default Component;
```

## Navigation (`src/component/navigation/Navigation.tsx`)

Top-level navigation container

## Views (`src/view/`)

Stack navigators for screen transitions

- Each view wraps related screens
- Platform-specific animations

## Screens (`src/screen/`)

Wrapped in `BaseScreen`

- Consistent layout with safe area insets
- `view` and `scroll` modes

## Components (`src/component/`)

Reusable UI components
