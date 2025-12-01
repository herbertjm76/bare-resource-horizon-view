# Theme Color Migration Guide

## Problem
The app was using random/hardcoded colors instead of the company's theme settings from the database.

## Solution
All colors now derive from the company's theme, which is configured in Office Settings → Company → Theme.

## Color System

### Theme Variables (Set by Company Theme)
These are dynamically set based on the selected theme:
- `--gradient-start` - Start color of theme gradient
- `--gradient-mid` - Middle color of theme gradient  
- `--gradient-end` - End color of theme gradient
- `--theme-primary` - Derived from gradient-mid, use for branded UI elements
- `--theme-border` - Derived from gradient-start, use for themed borders

### How to Use Theme Colors

#### ❌ WRONG - Hardcoded colors
```tsx
<div className="bg-[#6465F0] text-[#111]">
<Button className="bg-purple-600">
<Icon className="text-violet-500" />
```

#### ✅ CORRECT - Theme-based colors
```tsx
// For backgrounds with theme color
<div className="bg-gradient-modern">  
<div className="bg-theme-primary">

// For borders
<div className="border border-theme-border">

// For text/icons that should match theme
<Icon className="text-theme-primary" />

// For gradients
<div className="bg-gradient-mesh">
```

## Migration Checklist

### Files that MUST NOT use hardcoded colors:
- [ ] All dashboard components (`src/components/dashboard/*`)
- [ ] All badge components  
- [ ] All icon components with colored backgrounds
- [ ] Any gradient backgrounds
- [ ] Project cards and displays
- [ ] Navigation elements
- [ ] Buttons with branded colors

### Search and Replace Patterns

1. **Replace hardcoded violet/purple colors:**
   - `brand-violet` → `theme-primary`
   - `brand-primary` → `theme-primary`
   - `#6465F0` → Use `theme-primary` class or `hsl(var(--theme-primary))`
   - `purple-600` → `theme-primary`
   - `violet-500` → `theme-primary`

2. **Replace gradient references:**
   - `from-brand-violet` → `from-[hsl(var(--gradient-start))]`
   - `via-purple-600` → `via-[hsl(var(--gradient-mid))]`
   - `to-indigo-600` → `to-[hsl(var(--gradient-end))]`
   - Or use pre-built: `bg-gradient-modern`

3. **Replace background colors:**
   - `bg-brand-violet` → `bg-theme-primary`
   - `bg-brand-violet/10` → `bg-theme-primary/10`
   - `bg-purple-50` → `bg-theme-primary/5`

## Testing

After migration, test with different themes:
1. Go to Office Settings → Company → Theme
2. Select each theme option
3. Navigate through the app
4. Verify all colored elements change to match the theme
5. Check that no elements remain with fixed purple/violet colors

## Common Patterns

### Card with theme accent
```tsx
<Card>
  <div className="p-2 rounded-lg bg-theme-primary/10">
    <Icon className="h-5 w-5 text-theme-primary" />
  </div>
  <span className="text-lg font-semibold text-theme-primary">Title</span>
</Card>
```

### Gradient background
```tsx
<div className="bg-gradient-modern text-white">
  Content
</div>
```

### Avatar with theme color
```tsx
<Avatar className="bg-theme-primary text-white">
  {initials}
</Avatar>
```

### Border with theme
```tsx
<div className="border-2 border-theme-primary rounded-lg">
  Content
</div>
```

## Notes

- All themes provide harmonious gradients from start → mid → end
- `theme-primary` (mid color) should be used for most UI elements
- `theme-border` (start color) provides a darker accent
- Always test theme changes affect the entire app consistently
