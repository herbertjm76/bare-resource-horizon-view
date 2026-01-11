/**
 * Allocation Rule Book - Runtime Diagnostics
 * 
 * RULE BOOK ENFORCEMENT:
 * - DB stores hours only
 * - Each (company_id, project_id, resource_id, allocation_date) has ONE row
 * - allocation_date is normalized to company week start
 * - All writes go through canonical API (saveResourceAllocation/deleteResourceAllocation)
 * - Weekly views read only resource_type='active'
 */

/**
 * Development-only warning when duplicate allocations are detected in fetched data.
 * This helps catch regressions during development.
 */
export function warnIfDuplicateAllocations(
  allocations: Array<{ resource_id: string; project_id?: string; allocation_date: string; id?: string }>,
  context: string
): void {
  if (process.env.NODE_ENV === 'production') return;

  const seen = new Map<string, string[]>();
  
  for (const alloc of allocations) {
    const key = `${alloc.resource_id}|${alloc.project_id || 'unknown'}|${alloc.allocation_date}`;
    const ids = seen.get(key) || [];
    ids.push(alloc.id || 'no-id');
    seen.set(key, ids);
  }

  const duplicates = Array.from(seen.entries()).filter(([, ids]) => ids.length > 1);
  
  if (duplicates.length > 0) {
    console.warn(
      `[RULE BOOK VIOLATION] ${context}: Found ${duplicates.length} duplicate allocation groups.`,
      duplicates.slice(0, 3).map(([key, ids]) => ({ key, ids }))
    );
  }
}

/**
 * Validates that an allocation date is on the expected week start day.
 */
export function validateWeekStart(
  allocationDate: string,
  expectedDayOfWeek: 0 | 1 | 6, // 0=Sunday, 1=Monday, 6=Saturday
  context: string
): boolean {
  const date = new Date(allocationDate + 'T00:00:00');
  const actualDow = date.getUTCDay();
  
  if (actualDow !== expectedDayOfWeek) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[RULE BOOK VIOLATION] ${context}: allocation_date ${allocationDate} is not on expected week start day (expected ${expectedDayOfWeek}, got ${actualDow})`
      );
    }
    return false;
  }
  
  return true;
}
