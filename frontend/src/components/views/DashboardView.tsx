import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';
import { StatCard, Spinner } from '../ui';
import { ClimateMap } from '../map/ClimateMap';
import { LayerControl } from '../map/LayerControl';
import { RightPanel } from '../layout/RightPanel';
import { formatNumber } from '../../lib/utils';
import { CloudRain, ThermometerSun, ThermometerSnowflake, Cpu, Activity, BrainCircuit } from 'lucide-react';

export function DashboardView() {
  const { twin } = useAppStore();
  const readingsQ = useQuery({ queryKey: ['readings'], queryFn: api.getReadings });
  const predictionsQ = useQuery({ queryKey: ['predictions'], queryFn: api.getPredictions });

  const readings = readingsQ.data ?? [];
  const avgRain = readings.length ? readings.reduce((s, r) => s + r.rainfall, 0) / readings.length : 0;
  const avgMax = readings.length ? readings.reduce((s, r) => s + r.maxTemp, 0) / readings.length : 0;
  const avgMin = readings.length ? readings.reduce((s, r) => s + r.minTemp, 0) / readings.length : 0;

  const latestPred = predictionsQ.data?.[0];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-3 border-b border-surface-300/60">
        <StatCard label="Avg Rainfall" value={readingsQ.isLoading ? '—' : formatNumber(avgRain)} unit="mm" icon={<CloudRain className="w-4 h-4" />} accent="primary" trend="up" />
        <StatCard label="Avg Max Temp" value={readingsQ.isLoading ? '—' : formatNumber(avgMax)} unit="°C" icon={<ThermometerSun className="w-4 h-4" />} accent="warning" />
        <StatCard label="Avg Min Temp" value={readingsQ.isLoading ? '—' : formatNumber(avgMin)} unit="°C" icon={<ThermometerSnowflake className="w-4 h-4" />} accent="success" />
        <StatCard label="Twin Health" value={twin.health} unit="%" icon={<Cpu className="w-4 h-4" />} accent="success" />
        <StatCard label="Prediction Conf." value={latestPred?.confidence ?? '—'} unit="%" icon={<BrainCircuit className="w-4 h-4" />} accent="primary" />
        <StatCard label="Active Jobs" value={twin.activeJobs} icon={<Activity className="w-4 h-4" />} accent="accent" />
      </div>

      {/* Main workspace: map + sidebars */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left layer control */}
        <div className="w-64 shrink-0 border-r border-surface-300/60 p-2 overflow-hidden">
          <LayerControl />
        </div>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden">
          {readingsQ.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-[1001] bg-surface-0/50">
              <Spinner size={32} className="text-primary-400" />
            </div>
          )}
          <ClimateMap />
        </div>

        {/* Right analytics panel */}
        <RightPanel />
      </div>
    </div>
  );
}
