import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import type { ViewId } from '../../types';
import {
  LayoutDashboard,
  BrainCircuit,
  FlaskConical,
  History,
  BarChart3,
  Database,
  Cpu,
  Bell,
  Settings,
  CloudRain,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavEntry {
  id: ViewId;
  label: string;
  icon: LucideIcon;
  group: string;
}

const NAV: NavEntry[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { id: 'twin', label: 'Digital Twin', icon: Cpu, group: 'Overview' },
  { id: 'prediction', label: 'Predictions', icon: CloudRain, group: 'Analysis' },
  { id: 'ai-prediction', label: 'AI Forecast', icon: BrainCircuit, group: 'Analysis' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Analysis' },
  { id: 'simulator', label: 'Scenario Simulator', icon: FlaskConical, group: 'Simulation' },
  { id: 'replay', label: 'Historical Replay', icon: History, group: 'Simulation' },
  { id: 'datasets', label: 'Dataset Explorer', icon: Database, group: 'Data' },
  { id: 'notifications', label: 'Notifications', icon: Bell, group: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'System' },
];

export function Sidebar() {
  const { currentView, setView, layers, toggleLayer } = useAppStore();

  const groups = [...new Set(NAV.map((n) => n.group))];

  return (
    <aside className="w-60 shrink-0 border-r border-surface-300/60 bg-surface-100/60 backdrop-blur-md flex flex-col">
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {groups.map((group) => (
          <div key={group}>
            <div className="px-3 mb-1.5 text-[10px] font-semibold text-surface-600 uppercase tracking-wider">{group}</div>
            <div className="space-y-0.5">
              {NAV.filter((n) => n.group === group).map((entry) => {
                const Icon = entry.icon;
                const active = currentView === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => setView(entry.id)}
                    className={cn('nav-item w-full', active && 'nav-item-active')}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{entry.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick layer toggles */}
      <div className="border-t border-surface-300/60 p-3 space-y-2">
        <div className="text-[10px] font-semibold text-surface-600 uppercase tracking-wider">Quick Layers</div>
        {layers.slice(0, 4).map((l) => (
          <button key={l.id} onClick={() => toggleLayer(l.id)} className="flex items-center justify-between w-full text-xs text-surface-700 hover:text-surface-900">
            <span className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full', l.enabled ? 'bg-primary-500' : 'bg-surface-400')} />
              {l.name}
            </span>
            <span className={cn('text-[10px]', l.enabled ? 'text-primary-400' : 'text-surface-600')}>
              {l.enabled ? 'ON' : 'OFF'}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
