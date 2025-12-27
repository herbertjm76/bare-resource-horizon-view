# Theme Audit Report - Hardcoded Colors

Generated: 2025-12-27

## Summary

This audit identifies all remaining hardcoded colors that should be replaced with semantic tokens for proper dark mode support.

| Pattern | Files Affected | Matches |
|---------|---------------|---------|
| `bg-white` | 84 | 764 |
| `text-gray-*` | 135 | 2067 |
| `border-gray-*` | 64 | 542 |
| `bg-gray-*` | 83 | 756 |
| `#[hex]` | 128 | 7001 |
| `text-black` | 8 | 74 |
| `bg-slate-*` | 3 | 38 |

**Total: ~11,242 instances across 200+ files**

---

## Priority 1: Critical (Breaks Dark Mode)

### 1.1 `bg-white` → `bg-card` or `bg-background`
**Files requiring changes:**
- `src/components/resources/ProjectRow.tsx` (line 60)
- `src/pages/ProjectResourcing/components/ProjectResourcingFilterRow.tsx` (lines 106, 114, 139, 153, 156, 200)
- `src/components/dashboard/mobile/MobilePerformanceGauge.tsx` (line 15)
- `src/components/dashboard/mobile/MobileUpcomingEvents.tsx` (line 10)
- `src/components/landing/pricing/PricingCard.tsx` (line 30)
- `src/components/common/VisualElements.tsx` (line 53)
- `src/components/dashboard/TeamInviteSection.tsx` (line 25)
- `src/components/profile/EditableProfileSection.tsx` (line 66)
- And 80+ more files...

**Recommended replacements:**
- Card backgrounds: `bg-card`
- Page backgrounds: `bg-background`
- Popover/dropdown: `bg-popover`
- Hover states: `hover:bg-accent`

### 1.2 `text-gray-*` → Semantic tokens
**Common patterns:**
- `text-gray-900` → `text-foreground`
- `text-gray-800` → `text-foreground`
- `text-gray-700` → `text-foreground` or `text-muted-foreground`
- `text-gray-600` → `text-muted-foreground`
- `text-gray-500` → `text-muted-foreground`
- `text-gray-400` → `text-muted-foreground/80`
- `text-gray-300` → `text-muted-foreground/60`
- `text-gray-200` → Label text on dark backgrounds (keep or use `text-muted`)

**High-impact files:**
- `src/components/dashboard/TeamInvitesTable.tsx`
- `src/components/dashboard/HolidaysList.tsx`
- `src/components/dashboard/cards/LeavePlanningCard.tsx`
- `src/components/dashboard/insights/components/InsightItem.tsx`
- `src/components/CompanyRegistrationForm/*.tsx`
- `src/components/workload/components/WorkloadHeaderControls.tsx`

### 1.3 `border-gray-*` → `border-border`
**Files requiring changes:**
- `src/components/week-resourcing/row/ExpandedRowView.tsx`
- `src/components/week-resourcing/LongCapacityBar.tsx`
- `src/components/dashboard/HerbieChat.tsx`
- `src/components/dashboard/DashboardLoadingState.tsx`
- And 60+ more files...

### 1.4 `bg-gray-*` → Semantic tokens
**Common patterns:**
- `bg-gray-50` → `bg-muted/50`
- `bg-gray-100` → `bg-muted`
- `bg-gray-200` → `bg-muted` or `bg-accent`
- `bg-gray-300` → `bg-muted-foreground/20`
- `bg-gray-400` → `bg-muted-foreground/40`
- `bg-gray-500` → `bg-muted-foreground/60`

**High-impact files:**
- `src/components/AppHeader.tsx`
- `src/components/week-resourcing/CapacityBar.tsx`
- `src/components/tour/InteractiveAppTour.tsx`
- `src/components/team-member-detail/TeamMemberResourceOverview.tsx`

---

## Priority 2: High (Visual Inconsistency)

### 2.1 Hardcoded hex colors `#xxxxxx`
**Critical brand colors being hardcoded:**
- `#6465F0` - Primary brand (should use `hsl(var(--theme-primary))`)
- `#6F4BF6` - Brand violet (should use `hsl(var(--theme-primary))`)
- `#E5DEFF` - Light purple (should use `bg-theme-primary/10`)
- `#212172` - Dark text (should use `text-foreground`)

**Files with hex colors:**
- `src/components/workload/WorkloadCalendar.tsx` (lines 68-91, 129)
- `src/components/dashboard/teamSummary/constants/teamSummaryConstants.ts` (line 3)
- `src/styles/resource-table/expanded-view.css` (lines 42, 47-48)
- `src/components/resources/css/base-layout.css` (lines 20, 35, 49, 67-84)
- `src/components/projects/table/ProjectTableRow.tsx` (lines 80-82, 101, 219)

### 2.2 `text-black` → `text-foreground`
**Files:**
- `src/components/profile/ProfileContactInfo.tsx`
- `src/components/settings/office-overview/CompanyInfoDisplay.tsx`
- `src/components/landing/Navbar.tsx`
- `src/components/profile/ProfileDisplaySection.tsx`
- `src/components/profile/ProfileStats.tsx`

### 2.3 `bg-slate-*` → Semantic tokens
**Files:**
- `src/components/week-resourcing/row/MemoizedCompactRowView.tsx`
- `src/components/week-resourcing/ProjectRowTable.tsx`
- `src/components/ui/scroll-area.tsx`

---

## Priority 3: Medium (Functional but Inconsistent)

### 3.1 Status/Semantic colors (may be intentional)
These colors convey meaning and may need careful consideration:
- `bg-green-*` / `text-green-*` - Success states
- `bg-red-*` / `text-red-*` - Error/danger states
- `bg-yellow-*` / `text-yellow-*` - Warning states
- `bg-orange-*` / `text-orange-*` - Caution states
- `bg-blue-*` / `text-blue-*` - Info states

**Recommendation:** Create semantic status tokens:
```css
--status-success: 142 76% 36%;
--status-warning: 38 92% 50%;
--status-error: 0 84% 60%;
--status-info: 217 91% 60%;
```

### 3.2 CSS files with hardcoded colors
**Files:**
- `src/styles/resource-table/expanded-view.css`
- `src/components/resources/css/base-layout.css`

---

## Recommended Token Mappings

### Background Colors
| Hardcoded | Semantic Token |
|-----------|---------------|
| `bg-white` | `bg-card` or `bg-background` |
| `bg-gray-50` | `bg-muted/50` |
| `bg-gray-100` | `bg-muted` |
| `bg-gray-200` | `bg-accent` |
| `hover:bg-gray-50` | `hover:bg-accent/50` |
| `hover:bg-gray-100` | `hover:bg-accent` |

### Text Colors
| Hardcoded | Semantic Token |
|-----------|---------------|
| `text-gray-900` | `text-foreground` |
| `text-gray-800` | `text-foreground` |
| `text-gray-700` | `text-foreground` |
| `text-gray-600` | `text-muted-foreground` |
| `text-gray-500` | `text-muted-foreground` |
| `text-gray-400` | `text-muted-foreground/80` |
| `text-black` | `text-foreground` |

### Border Colors
| Hardcoded | Semantic Token |
|-----------|---------------|
| `border-gray-200` | `border-border` |
| `border-gray-300` | `border-border` |
| `border-gray-100` | `border-border/50` |

### Brand Colors
| Hardcoded | Semantic Token |
|-----------|---------------|
| `#6465F0` | `hsl(var(--theme-primary))` |
| `#6F4BF6` | `hsl(var(--theme-primary))` |
| `bg-purple-*` | `bg-theme-primary` |
| `text-purple-*` | `text-theme-primary` |

---

## Migration Script Suggestions

### Search & Replace Patterns (use with caution)

1. **Simple text colors:**
   - `text-gray-900` → `text-foreground`
   - `text-gray-600` → `text-muted-foreground`
   - `text-gray-500` → `text-muted-foreground`

2. **Simple backgrounds:**
   - `bg-white` → `bg-card` (for cards) or `bg-background` (for pages)
   - `bg-gray-50` → `bg-muted/50`
   - `bg-gray-100` → `bg-muted`

3. **Borders:**
   - `border-gray-200` → `border-border`
   - `border-gray-300` → `border-border`

---

## Files Requiring Manual Review

These files have complex color logic that needs careful manual migration:

1. **`src/components/workload/WorkloadCalendar.tsx`** - Inline styles with hex colors
2. **`src/components/dashboard/teamSummary/constants/teamSummaryConstants.ts`** - Department color constants
3. **`src/components/resources/css/base-layout.css`** - CSS with gradients and scrollbar colors
4. **`src/styles/resource-table/expanded-view.css`** - CSS focus states
5. **`src/components/projects/table/ProjectTableRow.tsx`** - Dynamic stage colors
6. **`src/components/landing/pricing/PricingCard.tsx`** - Gradient with conditional logic

---

## Next Steps

1. **Phase 1:** Fix all `bg-white` instances (highest visual impact)
2. **Phase 2:** Fix `text-gray-*` instances
3. **Phase 3:** Fix `border-gray-*` and `bg-gray-*` instances
4. **Phase 4:** Fix hex colors and CSS files
5. **Phase 5:** Create semantic status tokens and migrate status colors
6. **Phase 6:** Test with all theme options to ensure consistency
