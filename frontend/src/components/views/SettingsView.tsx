import { useAppStore } from '../../store/useAppStore';
import { Panel, Toggle } from '../ui';
import { Palette, Ruler, Globe, Map, Bell, Gauge, Accessibility, LogOut } from 'lucide-react';
import type { UserSettings } from '../../types';

export function SettingsView() {
  const { settings, updateSettings, user, logout } = useAppStore();

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4 max-w-4xl">
      <div>
        <h2 className="text-lg font-semibold text-surface-900">Settings</h2>
        <p className="text-sm text-surface-600">Customize your Climate Digital Twin experience</p>
      </div>

      {/* Profile */}
      <Panel title="Profile">
        <div className="p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-lg font-semibold text-white">
            {user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-surface-900">{user?.name}</div>
            <div className="text-xs text-surface-600">{user?.email}</div>
            <div className="text-xs text-surface-600">{user?.organization} · <span className="capitalize">{user?.role}</span></div>
          </div>
          <button onClick={logout} className="btn-outline text-error-400 border-error-500/30 hover:bg-error-500/10">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </Panel>

      {/* Appearance */}
      <Panel title="Appearance">
        <div className="p-4 space-y-4">
          <SettingRow icon={<Palette className="w-4 h-4" />} label="Theme">
            <select value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value as UserSettings['theme'] })} className="input !w-32">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </SettingRow>
          <SettingRow icon={<Map className="w-4 h-4" />} label="Default Map">
            <select value={settings.defaultMap} onChange={(e) => updateSettings({ defaultMap: e.target.value as UserSettings['defaultMap'] })} className="input !w-32">
              <option value="dark">Dark</option>
              <option value="terrain">Terrain</option>
              <option value="satellite">Satellite</option>
              <option value="light">Light</option>
            </select>
          </SettingRow>
        </div>
      </Panel>

      {/* Units & Language */}
      <Panel title="Units & Language">
        <div className="p-4 space-y-4">
          <SettingRow icon={<Ruler className="w-4 h-4" />} label="Units">
            <select value={settings.units} onChange={(e) => updateSettings({ units: e.target.value as UserSettings['units'] })} className="input !w-32">
              <option value="metric">Metric (°C, mm)</option>
              <option value="imperial">Imperial (°F, in)</option>
            </select>
          </SettingRow>
          <SettingRow icon={<Globe className="w-4 h-4" />} label="Language">
            <select value={settings.language} onChange={(e) => updateSettings({ language: e.target.value as UserSettings['language'] })} className="input !w-40">
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </SettingRow>
        </div>
      </Panel>

      {/* Notifications */}
      <Panel title="Notification Preferences">
        <div className="p-4 space-y-3">
          {([
            ['datasets', 'New datasets'],
            ['predictions', 'Predictions completed'],
            ['simulations', 'Simulations completed'],
            ['training', 'Training completed'],
            ['system', 'System warnings'],
          ] as const).map(([key, label]) => (
            <SettingRow key={key} icon={<Bell className="w-4 h-4" />} label={label}>
              <Toggle checked={settings.notifications[key]} onChange={() => updateSettings({ notifications: { ...settings.notifications, [key]: !settings.notifications[key] } })} />
            </SettingRow>
          ))}
        </div>
      </Panel>

      {/* Performance */}
      <Panel title="Performance">
        <div className="p-4 space-y-4">
          <SettingRow icon={<Gauge className="w-4 h-4" />} label="Performance Mode">
            <select value={settings.performance} onChange={(e) => updateSettings({ performance: e.target.value as UserSettings['performance'] })} className="input !w-32">
              <option value="high">High (all layers)</option>
              <option value="balanced">Balanced</option>
              <option value="low">Low (fast load)</option>
            </select>
          </SettingRow>
        </div>
      </Panel>

      {/* Accessibility */}
      <Panel title="Accessibility">
        <div className="p-4 space-y-3">
          <SettingRow icon={<Accessibility className="w-4 h-4" />} label="Reduced Motion">
            <Toggle checked={settings.accessibility.reducedMotion} onChange={() => updateSettings({ accessibility: { ...settings.accessibility, reducedMotion: !settings.accessibility.reducedMotion } })} />
          </SettingRow>
          <SettingRow icon={<Accessibility className="w-4 h-4" />} label="High Contrast">
            <Toggle checked={settings.accessibility.highContrast} onChange={() => updateSettings({ accessibility: { ...settings.accessibility, highContrast: !settings.accessibility.highContrast } })} />
          </SettingRow>
          <SettingRow icon={<Accessibility className="w-4 h-4" />} label="Large Text">
            <Toggle checked={settings.accessibility.largeText} onChange={() => updateSettings({ accessibility: { ...settings.accessibility, largeText: !settings.accessibility.largeText } })} />
          </SettingRow>
        </div>
      </Panel>
    </div>
  );
}

function SettingRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2.5 text-sm text-surface-800">
        <span className="text-surface-600">{icon}</span>
        {label}
      </span>
      {children}
    </div>
  );
}
