# Coding Standards & Patterns

This document outlines critical coding patterns and standards that must be followed throughout the codebase to prevent bugs and ensure consistency.

---

## 1. Date & Timezone Handling (CRITICAL)

### Problem
JavaScript `Date` objects and date-fns functions operate in **local timezone**, which causes mismatches when comparing dates generated in different parts of the application or on different user machines.

### Solution: Always Use UTC-Based Date Keys

**All date-based keys (week keys, day keys) MUST use UTC-based calculations.**

#### Required Utilities (from `src/utils/dateKey.ts`)

```typescript
import { toUTCDateKey, parseUTCDateKey, startOfWeekUTC } from '@/utils/dateKey';
```

| Function | Purpose |
|----------|---------|
| `toUTCDateKey(date)` | Converts a Date to `YYYY-MM-DD` string using UTC |
| `parseUTCDateKey(key)` | Parses `YYYY-MM-DD` string to Date at UTC midnight |
| `startOfWeekUTC(date, weekStartsOn)` | Calculates week start in UTC (0=Sun, 1=Mon, 6=Sat) |

#### ❌ DON'T DO THIS
```typescript
// These use local timezone and will cause mismatches
import { startOfWeek, format } from 'date-fns';

const weekKey = format(startOfWeek(date), 'yyyy-MM-dd');
```

#### ✅ DO THIS
```typescript
import { toUTCDateKey, startOfWeekUTC } from '@/utils/dateKey';

const weekKey = toUTCDateKey(startOfWeekUTC(date, weekStartsOn));
```

### When This Applies
- Resource allocation date keys
- Grid week calculations
- Any date-based data aggregation
- Database queries with date filters
- Heatmap/calendar cell keys

---

## 2. Utilization Color Coding

### Standardized Colors
All utilization percentages must use the centralized color utilities from `src/utils/utilizationColors.ts`.

```typescript
import { 
  calculateUtilization,
  getUtilizationSolidBgColor, 
  getUtilizationSolidTextColor 
} from '@/utils/utilizationColors';

const utilization = calculateUtilization(hours, capacity);
const bgColor = getUtilizationSolidBgColor(utilization);
const textColor = getUtilizationSolidTextColor(utilization);
```

### Color Thresholds
| Utilization | Color | Meaning |
|-------------|-------|---------|
| 0% | Gray | No allocation |
| 1-49% | Orange | Underutilized |
| 50-79% | Yellow | Moderate |
| 80-100% | Green | Optimal |
| >100% | Red | Over-allocated |

---

## 3. Component Architecture

### File Size Limits
- Components should be < 300 lines
- Extract hooks for complex logic
- Create focused, single-responsibility components

### Naming Conventions
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- CSS files: `kebab-case.css`

---

## 4. Performance Patterns

### React.memo Usage
Use `React.memo` with custom comparison for list items (like PersonRow, ProjectRow).

### Query Keys
Use consistent query key patterns with TanStack Query.

---

*Last updated: 2026-01-12*
