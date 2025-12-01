# App Settings Integration Guide

This document outlines how the company-wide app settings should be integrated across the application.

## Available Settings

The following settings are available via the `useAppSettings()` hook:

```typescript
import { useAppSettings } from '@/hooks/useAppSettings';

const {
  workWeekHours,              // number (default: 40)
  displayPreference,          // 'hours' | 'percentage' (default: 'hours')
  startOfWorkWeek,           // 'Monday' | 'Sunday' | 'Saturday' (default: 'Monday')
  hideFinancials,            // boolean (default: false)
  projectDisplayPreference   // 'code' | 'name' (default: 'code')
} = useAppSettings();
```

## Integration Points

### 1. Work Week Hours

**Purpose**: Define the standard working hours per week for capacity calculations

**Where to integrate**:
- `src/components/weekly-rundown/*` - Utilization calculations
- `src/components/resources/*` - Capacity displays
- `src/components/team-workload/*` - Workload percentages
- `src/components/week-resourcing/*` - Resource planning
- Any utilization calculation: `(allocatedHours / workWeekHours) * 100`

**Example**:
```typescript
const { workWeekHours } = useAppSettings();
const utilization = (allocatedHours / workWeekHours) * 100;
```

### 2. Display Preference (Hours vs Percentage)

**Purpose**: Choose how to display resource allocations throughout the app

**Where to integrate**:
- Resource allocation forms and inputs
- Project resourcing tables
- Weekly overview displays
- Team workload charts
- Any place showing allocation amounts

**Utility functions available**:
```typescript
import {
  formatAllocation,
  formatUtilization,
  getAllocationLabel,
  getAllocationPlaceholder,
  convertToHours,
  convertFromHours
} from '@/utils/displayFormatters';

// Display allocation
const displayText = formatAllocation(hours, capacity, displayPreference);

// Form label
const label = getAllocationLabel(displayPreference); // "Hours" or "Percentage"

// Convert user input
const hoursValue = convertToHours(inputValue, capacity, displayPreference);
```

**Files to update**:
- `src/components/weekly-rundown/AddProjectAllocation.tsx`
- `src/components/weekly-rundown/AddTeamMemberAllocation.tsx`
- `src/components/weekly-rundown/EditPersonAllocationsDialog.tsx`
- `src/components/resources/dialogs/ResourceAllocationDialog.tsx`
- `src/components/week-resourcing/*` (all resource cells)

### 3. Start of Work Week

**Purpose**: Define the first day of the work week for calendars and week calculations

**Where to integrate**:
- Date pickers and calendar components
- Week navigation controls
- Weekly overview week selection
- Any component calculating "week start" or "week end"

**Utility functions available**:
```typescript
import { getWeekStart, getWeekEnd, formatWeekRange } from '@/utils/weekUtils';

const weekStart = getWeekStart(new Date(), startOfWorkWeek);
const weekEnd = getWeekEnd(new Date(), startOfWorkWeek);
const weekLabel = formatWeekRange(new Date(), startOfWorkWeek);
```

**Files to update**:
- `src/components/weekly-rundown/WeeklyRundownView.tsx`
- `src/components/resources/modern/WeekSelector.tsx`
- `src/pages/WeeklyOverview/index.tsx`
- Any component with week-based date calculations

### 4. Hide Financial Data

**Purpose**: Opt out of displaying financial information across the app

**Where to integrate**:
- Project tables (hide budget, cost, revenue columns)
- Financial dashboards
- Project profit displays
- Invoice aging reports
- Any financial metrics or charts

**Example**:
```typescript
const { hideFinancials } = useAppSettings();

return (
  <>
    {!hideFinancials && (
      <div>
        <span>Budget: ${budget}</span>
        <span>Revenue: ${revenue}</span>
      </div>
    )}
  </>
);
```

**Files to update**:
- `src/components/projects/table/ProjectTableRow.tsx`
- `src/components/dashboard/*` (financial cards)
- `src/pages/FinancialControl/*`
- `src/pages/ProjectBilling/*`
- `src/pages/AgingInvoices/*`

### 5. Project Display Preference

**Purpose**: Choose whether to display projects by code or name primarily

**Where to integrate**:
- Project dropdowns and selects
- Project cards and lists
- Project tables
- Any place showing project information

**Utility functions available**:
```typescript
import {
  getProjectDisplayName,
  getProjectSecondaryText,
  getProjectFullDisplay
} from '@/utils/projectDisplay';

// Primary display (code or name based on preference)
const primary = getProjectDisplayName(project, projectDisplayPreference);

// Secondary display (the other one)
const secondary = getProjectSecondaryText(project, projectDisplayPreference);

// Full display with both
const full = getProjectFullDisplay(project, projectDisplayPreference);
```

**Already integrated in**:
- ✅ `src/components/weekly-rundown/ProjectRundownCard.tsx`
- ✅ `src/components/weekly-rundown/RundownGridView.tsx`

**Files to update**:
- `src/components/resources/dialogs/ResourceAllocationDialog.tsx`
- `src/components/resources/person-view/AddProjectRow.tsx`
- `src/components/projects/table/ProjectTableRow.tsx`
- `src/components/week-resourcing/NewResourceTable.tsx`
- Any project selector or dropdown

## Migration Strategy

### Phase 1: Core Display Components ✅
- [x] Project display utilities created
- [x] Weekly rundown cards updated
- [x] App settings hook created

### Phase 2: Resource Allocation (Next)
- [ ] Update allocation forms to respect hours/percentage preference
- [ ] Update allocation displays to respect hours/percentage preference
- [ ] Update resource dialogs to respect project display preference

### Phase 3: Financial Components
- [ ] Add conditional rendering based on hideFinancials
- [ ] Update project tables
- [ ] Update dashboards

### Phase 4: Date/Week Components
- [ ] Update week selectors to use startOfWorkWeek
- [ ] Update calendar components
- [ ] Update date pickers

## Testing Checklist

For each setting, verify:
- [ ] Setting persists after page refresh
- [ ] Setting applies immediately when changed
- [ ] Setting works across all relevant pages
- [ ] Default value is correct for new companies
- [ ] Setting respects company-level configuration
