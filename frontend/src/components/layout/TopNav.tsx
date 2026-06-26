import { useAppStore } from '../../store/useAppStore';
import { climateWS } from '../../services/api';
import { StatusDot } from '../ui';
import {
  Activity,
  Bell,
  Globe2,
  Maximize2,
  Minimize2,
  Search,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function TopNav() {
  const { user, setView, unreadCount, mapFullscreen, toggleFullscreen, twin } = useAppStore();
  const unread = unreadCount();
  const [wsStatus, setWsStatus] = useState<'online' | 'simulated'>('simulated');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = climateWS.on((event) => {
      if (event === 'connection') setWsStatus('online');
    });
    return () => { unsub(); };
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-surface-300/60 bg-surface-100/80 backdrop-blur-md z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/20">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-surface-900">Climate Digital Twin</div>
            <div className="text-[10px] text-surface-600 uppercase tracking-wider">India · AI-Powered</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search regions, datasets, predictions..."
            className="input pl-9"
          />
        </div>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1.5">
        {/* Twin health */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-200/60 border border-surface-300/40">
          <StatusDot status={twin.health > 80 ? 'online' : twin.health > 50 ? 'warning' : 'error'} />
          <span className="text-xs text-surface-700">Twin</span>
          <span className="metric-value text-xs text-surface-900">{twin.health}%</span>
        </div>

        {/* WS status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-surface-200/60 border border-surface-300/40">
          <Activity className="w-3.5 h-3.5 text-primary-400" />
          <span className="text-xs text-surface-600">{wsStatus === 'online' ? 'Live' : 'Sim'}</span>
        </div>

        {/* Notifications */}
        <button onClick={() => setView('notifications')} className="btn-ghost relative !p-2">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-error-500 text-white text-[10px] font-semibold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>

        {/* Fullscreen */}
        <button onClick={toggleFullscreen} className="btn-ghost !p-2">
          {mapFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Settings */}
        <button onClick={() => setView('settings')} className="btn-ghost !p-2">
          <Settings className="w-4 h-4" />
        </button>

        {/* User */}
        <button onClick={() => setView('auth')} className="flex items-center gap-2 ml-1 pl-2 border-l border-surface-300/60">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-xs font-semibold text-white">
            {user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('') ?? <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden xl:block leading-tight text-left">
            <div className="text-xs font-medium text-surface-900">{user?.name}</div>
            <div className="text-[10px] text-surface-600 capitalize">{user?.role}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
