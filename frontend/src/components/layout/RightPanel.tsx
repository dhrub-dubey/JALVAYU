import { useAppStore } from '../../store/useAppStore';
import { CURRENT_READINGS, REGIONS } from '../../data/mockData';
import { Panel, StatCard, ProgressBar, StatusDot } from '../ui';
import { cn, timeAgo, formatNumber } from '../../lib/utils';
import { CloudRain, ThermometerSun, ThermometerSnowflake, AlertTriangle, Cpu, Activity, Zap } from 'lucide-react';

const sevBadge = {
  critical: 'badge-error',
  error: 'badge-error',
  warning: 'badge-warning',
  info: 'badge-info',
} as const;

export function RightPanel() {
  const { twin, alerts, acknowledgeAlert, selectedRegionId, setSelectedRegion } = useAppStore();

  const avgRain = CURRENT_READINGS.reduce((s, r) => s + r.rainfall, 0) / CURRENT_READINGS.length;
  const avgMax = CURRENT_READINGS.reduce((s, r) => s + r.maxTemp, 0) / CURRENT_READINGS.length;
  const avgMin = CURRENT_READINGS.reduce((s, r) => s + r.minTemp, 0) / CURRENT_READINGS.length;

  const selectedRegion = REGIONS.find((r) => r.id === selectedRegionId);
  const selectedReading = selectedRegion ? CURRENT_READINGS.find((r) => r.region === selectedRegion.name) : null;

  return (
    <div className="w-80 shrink-0 border-l border-surface-300/60 bg-surface-100/60 backdrop-blur-md flex flex-col overflow-hidden">
      <div className="overflow-y-auto flex-1 space-y-3 p-3">
        {/* Current conditions */}
        <Panel title="Current Conditions">
          <div className="p-3 grid grid-cols-3 gap-2">
            <StatCard label="Rainfall" value={formatNumber(avgRain)} unit="mm" icon={<CloudRain className="w-4 h-4" />} accent="primary" />
            <StatCard label="Max Temp" value={formatNumber(avgMax)} unit="°C" icon={<ThermometerSun className="w-4 h-4" />} accent="warning" />
            <StatCard label="Min Temp" value={formatNumber(avgMin)} unit="°C" icon={<ThermometerSnowflake className="w-4 h-4" />} accent="success" />
          </div>
        </Panel>

        {/* Selected region detail */}
        {selectedRegion && selectedReading && (
          <Panel title={`Inspect: ${selectedRegion.name}`} action={<button onClick={() => setSelectedRegion(null)} className="text-xs text-surface-600 hover:text-surface-900">✕</button>}>
            <div className="p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="card p-2">
                  <div className="text-[10px] text-surface-600 uppercase">Rainfall</div>
                  <div className="metric-value text-lg text-primary-400">{selectedReading.rainfall} <span className="text-xs">mm</span></div>
                </div>
                <div className="card p-2">
                  <div className="text-[10px] text-surface-600 uppercase">Max Temp</div>
                  <div className="metric-value text-lg text-warning-400">{selectedReading.maxTemp} <span className="text-xs">°C</span></div>
                </div>
                <div className="card p-2">
                  <div className="text-[10px] text-surface-600 uppercase">Min Temp</div>
                  <div className="metric-value text-lg text-success-400">{selectedReading.minTemp} <span className="text-xs">°C</span></div>
                </div>
                <div className="card p-2">
                  <div className="text-[10px] text-surface-600 uppercase">Area</div>
                  <div className="metric-value text-lg text-surface-900">{selectedRegion.area} <span className="text-xs">km²</span></div>
                </div>
              </div>
              <div className="text-xs text-surface-600 pt-1">
                {selectedRegion.state} · Pop. {selectedRegion.population.toLocaleString('en-IN')}
              </div>
            </div>
          </Panel>
        )}

        {/* Twin status console */}
        <Panel title="Digital Twin Status">
          <div className="p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <StatusDot status={twin.health > 80 ? 'online' : 'warning'} />
                <span className="text-surface-900 capitalize">{twin.status}</span>
              </span>
              <span className="text-xs text-surface-600">{timeAgo(twin.lastUpdated)}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-surface-600">Health</span>
                <span className="metric-value text-surface-900">{twin.health}%</span>
              </div>
              <ProgressBar value={twin.health} color={twin.health > 80 ? 'success' : 'warning'} />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="card p-2">
                <Cpu className="w-3.5 h-3.5 text-primary-400 mb-1" />
                <div className="text-[10px] text-surface-600">CPU</div>
                <div className="metric-value text-sm">{twin.cpuUsage}%</div>
              </div>
              <div className="card p-2">
                <Activity className="w-3.5 h-3.5 text-accent-400 mb-1" />
                <div className="text-[10px] text-surface-600">Mem</div>
                <div className="metric-value text-sm">{twin.memoryUsage}%</div>
              </div>
              <div className="card p-2">
                <Zap className="w-3.5 h-3.5 text-warning-400 mb-1" />
                <div className="text-[10px] text-surface-600">GPU</div>
                <div className="metric-value text-sm">{twin.gpuUsage}%</div>
              </div>
            </div>
            <div className="text-xs space-y-1 pt-1 border-t border-surface-300/40">
              <div className="flex justify-between"><span className="text-surface-600">Model</span><span className="text-surface-800">{twin.currentModel}</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Dataset</span><span className="text-surface-800 truncate ml-2">{twin.currentDataset}</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Uptime</span><span className="text-surface-800">{twin.uptime}</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Active Jobs</span><span className="metric-value">{twin.activeJobs}</span></div>
            </div>
          </div>
        </Panel>

        {/* Alerts */}
        <Panel title="Recent Alerts">
          <div className="p-2 space-y-1.5">
            {alerts.slice(0, 5).map((a) => (
              <div key={a.id} className={cn('card p-2.5', !a.acknowledged && 'border-l-2', a.severity === 'critical' && 'border-l-error-500', a.severity === 'warning' && 'border-l-warning-500', a.severity === 'error' && 'border-l-error-500', a.severity === 'info' && 'border-l-primary-500')}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className={cn('w-3 h-3 shrink-0', a.severity === 'critical' || a.severity === 'error' ? 'text-error-400' : a.severity === 'warning' ? 'text-warning-400' : 'text-primary-400')} />
                      <span className="text-xs font-medium text-surface-900 truncate">{a.title}</span>
                    </div>
                    <p className="text-[11px] text-surface-600 mt-0.5 line-clamp-2">{a.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={sevBadge[a.severity]}>{a.severity}</span>
                      {a.region && <span className="text-[10px] text-surface-600">{a.region}</span>}
                      <span className="text-[10px] text-surface-600">{timeAgo(a.timestamp)}</span>
                    </div>
                  </div>
                  {!a.acknowledged && (
                    <button onClick={() => acknowledgeAlert(a.id)} className="text-[10px] text-primary-400 hover:text-primary-300 shrink-0">Ack</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
