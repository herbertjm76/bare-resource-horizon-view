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

## 5. User Role Management (CRITICAL)

### Problem
User roles determine access to critical features (ALLOCATE, admin panels, etc.). 
Roles MUST be persisted in `user_roles` table - NOT in profiles or localStorage.
If roles are not properly assigned, users lose access to features they should have.

### Architecture
- Roles are stored in `user_roles` table (never in profiles)
- RLS on `user_roles` prevents client-side inserts for new users
- Database triggers handle role assignment automatically via `SECURITY DEFINER`

### Role Assignment Flow
| Scenario | Role Source | Mechanism |
|----------|-------------|-----------|
| Company owner signup | 'owner' | Trigger on profiles insert |
| Invite acceptance | invite.role | Trigger reads from invites table |
| Admin adding member | Specified role | Direct insert (admin has permissions) |

### ❌ DON'T DO THIS
```typescript
// Client-side role insert will fail for new users due to RLS
await supabase.from('user_roles').insert({ user_id, role, company_id });
```

### ✅ DO THIS
```typescript
// Roles are set automatically by database triggers
// Just ensure the invite has the correct role before user claims it
await supabase.from('invites').update({ role: 'admin' }).eq('id', inviteId);
```

### Debugging Role Issues
1. Check `user_roles` table: `SELECT * FROM user_roles WHERE user_id = '<id>'`
2. If empty, check if trigger failed in Supabase logs
3. Use `verify_user_role_setup(user_id)` function to debug
4. Manually fix with: `INSERT INTO user_roles (user_id, company_id, role) VALUES (...)`

---

*Last updated: 2026-01-16*
