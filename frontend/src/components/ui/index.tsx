import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

export function Panel({ children, className, title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <div className={cn('card flex flex-col', className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-300/60">
          <h3 className="section-title">{title}</h3>
          {action}
        </div>
      )}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, unit, icon, trend, accent = 'primary' }: {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  accent?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
}) {
  const accentMap = {
    primary: 'text-primary-400',
    success: 'text-success-400',
    warning: 'text-warning-400',
    error: 'text-error-400',
    accent: 'text-accent-400',
  };
  return (
    <div className="card p-3 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-surface-600 uppercase tracking-wide">{label}</span>
        {icon && <span className={accentMap[accent]}>{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn('metric-value text-xl', accentMap[accent])}>{value}</span>
        {unit && <span className="text-xs text-surface-600">{unit}</span>}
      </div>
      {trend && (
        <span className={cn('text-xs', trend === 'up' ? 'text-success-400' : trend === 'down' ? 'text-error-400' : 'text-surface-600')}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trend}
        </span>
      )}
    </div>
  );
}

export function ProgressBar({ value, className, color = 'primary' }: { value: number; className?: string; color?: 'primary' | 'success' | 'warning' | 'error' }) {
  const colorMap = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };
  return (
    <div className={cn('h-1.5 w-full bg-surface-300 rounded-full overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all duration-500', colorMap[color])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <button onClick={onChange} className="flex items-center gap-2 group">
      <span className={cn('relative w-9 h-5 rounded-full transition-colors', checked ? 'bg-primary-600' : 'bg-surface-400')}>
        <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform', checked && 'translate-x-4')} />
      </span>
      {label && <span className="text-sm text-surface-800">{label}</span>}
    </button>
  );
}

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg className={cn('animate-spin', className)} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyState({ icon, title, message }: { icon?: ReactNode; title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-surface-500 mb-3">{icon}</div>}
      <p className="text-sm font-medium text-surface-700">{title}</p>
      {message && <p className="text-xs text-surface-600 mt-1">{message}</p>}
    </div>
  );
}

export function StatusDot({ status }: { status: 'online' | 'warning' | 'error' | 'idle' }) {
  const map = {
    online: 'bg-success-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]',
    warning: 'bg-warning-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]',
    error: 'bg-error-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]',
    idle: 'bg-surface-500',
  };
  return <span className={cn('inline-block w-2 h-2 rounded-full', map[status])} />;
}
