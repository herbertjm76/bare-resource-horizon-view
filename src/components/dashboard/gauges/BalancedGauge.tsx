import React from 'react';

interface BalancedGaugeProps {
  value: number;          // utilization percentage
  min?: number;           // default 0
  mid?: number;           // default 100 (center)
  max?: number;           // default 200 (right end)
  height?: number;        // track height in px (default 14)
  showLabels?: boolean;   // show left/center/right labels
}

// A horizontal gauge where `mid` is centered. Values < mid move left, > mid move right.
export const BalancedGauge: React.FC<BalancedGaugeProps> = ({
  value,
  min = 0,
  mid = 100,
  max = 200,
  height = 14,
  showLabels = false,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    setWidth(el.clientWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clamped = Math.max(min, Math.min(value, max));
  // map min..max -> 0..1 with mid at 0.5
  const pos = (clamped - min) / (max - min); // 0..1
  const x = width * pos; // px from left
  const isRight = clamped >= mid;

  // distance from center in px
  const centerX = width / 2;
  const dist = Math.abs(x - centerX);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative w-full" style={{ height }}>
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-muted" />

        {/* Left half (under) gradient */}
        <div
          className="absolute left-0 top-0 h-full rounded-l-full"
          style={{ width: '50%', background: 'linear-gradient(to right, hsl(var(--success, 142 76% 36%)), hsl(var(--success, 142 76% 36%) / 0.5))' }}
        />
        {/* Right half (over) gradient */}
        <div
          className="absolute right-0 top-0 h-full rounded-r-full"
          style={{ width: '50%', background: 'linear-gradient(to right, hsl(var(--brand-violet)), hsl(var(--destructive, 346 77% 49%)))' }}
        />

        {/* Center marker (100%) */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-foreground/30" />

        {/* Fill from center to pointer */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left: isRight ? centerX : centerX - dist,
            width: dist,
            background: isRight
              ? 'linear-gradient(to right, hsl(var(--brand-violet)), hsl(var(--destructive, 346 77% 49%)))'
              : 'linear-gradient(to left, hsl(var(--success, 142 76% 36%)), hsl(var(--success, 142 76% 36%) / 0.6))',
            boxShadow: '0 6px 16px hsla(0,0%,0%,0.15)'
          }}
        />

        {/* Thumb */}
        <div
          className="absolute -top-1.5" // center vertically roughly
          style={{
            left: Math.max(0, Math.min(width, x)) - 10,
            width: 20,
            height: 20,
            borderRadius: 9999,
            background: isRight
              ? 'linear-gradient(135deg, hsl(var(--brand-violet)), hsl(var(--destructive, 346 77% 49%)))'
              : 'linear-gradient(135deg, hsl(var(--success, 142 76% 36%)), hsl(var(--success, 142 76% 36%) / 0.85))',
            boxShadow: '0 6px 18px hsla(0,0%,0%,0.25), 0 0 0 3px rgba(255,255,255,0.8)'
          }}
        />
      </div>

      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Low</span>
          <span className="font-medium">100%</span>
          <span>Over</span>
        </div>
      )}
    </div>
  );
};
