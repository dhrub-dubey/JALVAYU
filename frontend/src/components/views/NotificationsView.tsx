import { useAppStore } from '../../store/useAppStore';
import { Panel, EmptyState } from '../ui';
import { cn, timeAgo } from '../../lib/utils';
import { Bell, Database, BrainCircuit, FlaskConical, Activity, AlertTriangle, CheckCheck } from 'lucide-react';
import type { Notification } from '../../types';

const TYPE_ICON: Record<string, React.ReactNode> = {
  dataset: <Database className="w-4 h-4 text-primary-400" />,
  prediction: <BrainCircuit className="w-4 h-4 text-accent-400" />,
  simulation: <FlaskConical className="w-4 h-4 text-success-400" />,
  training: <Activity className="w-4 h-4 text-warning-400" />,
  system: <Activity className="w-4 h-4 text-surface-600" />,
  error: <AlertTriangle className="w-4 h-4 text-error-400" />,
};

export function NotificationsView() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useAppStore();
  const unread = unreadCount();

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-surface-900">Notifications</h2>
          <p className="text-sm text-surface-600">{unread} unread of {notifications.length} total</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-outline">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <Panel title="All Notifications">
        <div className="p-2 space-y-1">
          {notifications.length === 0 ? (
            <EmptyState icon={<Bell className="w-8 h-8" />} title="No notifications" />
          ) : (
            notifications.map((n: Notification) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={cn('card p-3 cursor-pointer transition-colors', !n.read && 'border-l-2 border-l-primary-500 bg-primary-600/5')}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">{TYPE_ICON[n.type]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn('text-sm font-medium', n.read ? 'text-surface-700' : 'text-surface-900')}>{n.title}</span>
                      <span className="text-[10px] text-surface-600 shrink-0">{timeAgo(n.timestamp)}</span>
                    </div>
                    <p className="text-xs text-surface-600 mt-0.5">{n.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge-neutral capitalize">{n.type}</span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
