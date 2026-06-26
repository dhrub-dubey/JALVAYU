import { useAppStore } from '../../store/useAppStore';
import { Panel, ProgressBar, StatusDot } from '../ui';
import { timeAgo } from '../../lib/utils';
import { Cpu, Activity, Zap, HardDrive, Database, BrainCircuit, FlaskConical, RefreshCw, CheckCircle2, XCircle, Loader } from 'lucide-react';
import { useEffect } from 'react';
import { climateWS } from '../../services/api';

export function TwinView() {
  const { twin, setTwin } = useAppStore();

  // Subscribe to WS for live updates
  useEffect(() => {
    const unsub = climateWS.on((event, data) => {
      if (event === 'twin_update') {
        setTwin({
          health: data.health,
          cpuUsage: data.cpuUsage,
          gpuUsage: data.gpuUsage,
          memoryUsage: data.memoryUsage,
          lastUpdated: new Date().toISOString(),
        });
      }
      if (event === 'prediction_progress') {
        setTwin({ predictionProgress: data.progress });
      }
    });
    return () => { unsub(); };
  }, [setTwin]);

  const statusIcon = (status: string) => {
    if (status === 'completed' || status === 'ready') return <CheckCircle2 className="w-3.5 h-3.5 text-success-400" />;
    if (status === 'failed' || status === 'error') return <XCircle className="w-3.5 h-3.5 text-error-400" />;
    if (status === 'processing' || status === 'running' || status === 'training') return <Loader className="w-3.5 h-3.5 text-primary-400 animate-spin" />;
    return <div className="w-3.5 h-3.5 rounded-full bg-surface-400" />;
  };

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-surface-900">Digital Twin Status Console</h2>
          <p className="text-sm text-surface-600">Real-time operational status of the AI-Powered Climate Digital Twin</p>
        </div>
        <button onClick={() => setTwin({ lastUpdated: new Date().toISOString() })} className="btn-outline">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Top status banner */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <StatusDot status={twin.health > 80 ? 'online' : 'warning'} />
              <span className="text-base font-semibold text-surface-900 capitalize">{twin.status}</span>
            </div>
            <div className="text-xs text-surface-600">Last updated {timeAgo(twin.lastUpdated)} · Uptime {twin.uptime}</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="metric-value text-2xl text-success-400">{twin.health}%</div>
            <div className="text-xs text-surface-600">Health</div>
          </div>
          <div className="text-center">
            <div className="metric-value text-2xl text-primary-400">{twin.activeJobs}</div>
            <div className="text-xs text-surface-600">Active Jobs</div>
          </div>
        </div>
      </div>

      {/* Resource utilization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel title="CPU Usage">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-primary-400" />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1"><span className="text-surface-600">Utilization</span><span className="metric-value text-surface-900">{twin.cpuUsage}%</span></div>
                <ProgressBar value={twin.cpuUsage} color={twin.cpuUsage > 80 ? 'error' : 'primary'} />
              </div>
            </div>
            <div className="text-xs space-y-1 pt-2 border-t border-surface-300/40">
              <div className="flex justify-between"><span className="text-surface-600">Cores</span><span className="text-surface-800">32 vCPU</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Load Avg</span><span className="metric-value">12.4</span></div>
            </div>
          </div>
        </Panel>

        <Panel title="Memory Usage">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-accent-400" />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1"><span className="text-surface-600">Utilization</span><span className="metric-value text-surface-900">{twin.memoryUsage}%</span></div>
                <ProgressBar value={twin.memoryUsage} color={twin.memoryUsage > 85 ? 'warning' : 'success'} />
              </div>
            </div>
            <div className="text-xs space-y-1 pt-2 border-t border-surface-300/40">
              <div className="flex justify-between"><span className="text-surface-600">Total</span><span className="text-surface-800">128 GB</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Used</span><span className="metric-value">{Math.round(128 * twin.memoryUsage / 100)} GB</span></div>
            </div>
          </div>
        </Panel>

        <Panel title="GPU Usage">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-warning-400" />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1"><span className="text-surface-600">Utilization</span><span className="metric-value text-surface-900">{twin.gpuUsage}%</span></div>
                <ProgressBar value={twin.gpuUsage} color={twin.gpuUsage > 90 ? 'error' : 'warning'} />
              </div>
            </div>
            <div className="text-xs space-y-1 pt-2 border-t border-surface-300/40">
              <div className="flex justify-between"><span className="text-surface-600">Device</span><span className="text-surface-800">A100 × 4</span></div>
              <div className="flex justify-between"><span className="text-surface-600">VRAM</span><span className="metric-value">62.4 / 80 GB</span></div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Pipeline status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel title="Pipeline Status">
          <div className="p-4 space-y-3">
            {[
              { label: 'Prediction', status: twin.predictionStatus, progress: twin.predictionProgress, icon: <BrainCircuit className="w-4 h-4" /> },
              { label: 'Processing', status: twin.processingStatus, progress: twin.processingProgress, icon: <Database className="w-4 h-4" /> },
              { label: 'Training', status: twin.trainingStatus, progress: twin.trainingProgress, icon: <Activity className="w-4 h-4" /> },
              { label: 'Simulation', status: twin.simulationStatus, progress: 0, icon: <FlaskConical className="w-4 h-4" /> },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-surface-600">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-surface-800">{item.label}</span>
                    <span className="flex items-center gap-1.5 text-xs capitalize text-surface-700">
                      {statusIcon(item.status)}
                      {item.status}
                    </span>
                  </div>
                  {item.progress > 0 && item.progress < 100 && <ProgressBar value={item.progress} color="primary" />}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Configuration">
          <div className="p-4 space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-surface-600">Current Model</span><span className="text-surface-900 font-medium">{twin.currentModel}</span></div>
            <div className="flex justify-between"><span className="text-surface-600">Model Version</span><span className="metric-value text-surface-900">{twin.modelVersion}</span></div>
            <div className="flex justify-between"><span className="text-surface-600">Current Dataset</span><span className="text-surface-900 text-xs">{twin.currentDataset}</span></div>
            <div className="flex justify-between"><span className="text-surface-600">Uptime</span><span className="text-surface-900">{twin.uptime}</span></div>
            <div className="flex justify-between"><span className="text-surface-600">Active Jobs</span><span className="metric-value text-surface-900">{twin.activeJobs}</span></div>
            <div className="flex justify-between"><span className="text-surface-600">Last Updated</span><span className="text-surface-700 text-xs">{timeAgo(twin.lastUpdated)}</span></div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
