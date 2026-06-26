import { useState } from 'react';
import { Panel, StatCard } from '../ui';
import { REGIONS, DATASETS, generateRainfallTrend, generateTempTrend } from '../../data/mockData';
import { formatNumber, cn } from '../../lib/utils';
import { Play, Calendar, MapPin, Database, GitCompare } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';

export function ReplayView() {
  const [date, setDate] = useState(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10));
  const [region, setRegion] = useState('mumbai');
  const [dataset, setDataset] = useState('ds-1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [compareMode, setCompareMode] = useState(true);

  const selectedRegion = REGIONS.find((r) => r.id === region);
  const selectedDataset = DATASETS.find((d) => d.id === dataset);

  // Generate historical vs predicted data
  const rainfallData = generateRainfallTrend(30).map((d, i) => ({
    ...d,
    predicted: Math.round((d.rainfall + Math.sin(i / 2) * 4) * 10) / 10,
  }));
  const tempData = generateTempTrend(30).map((d, i) => ({
    ...d,
    predicted: Math.round((d.maxTemp + Math.cos(i / 3) * 1.5) * 10) / 10,
  }));

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-surface-900">Historical Replay</h2>
        <p className="text-sm text-surface-600">Replay past climate conditions and compare against AI predictions</p>
      </div>

      {/* Controls */}
      <Panel title="Replay Configuration">
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label"><Calendar className="w-3 h-3 inline mr-1" /> Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label"><MapPin className="w-3 h-3 inline mr-1" /> Region</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="input">
              {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label"><Database className="w-3 h-3 inline mr-1" /> Dataset</label>
            <select value={dataset} onChange={(e) => setDataset(e.target.value)} className="input">
              {DATASETS.filter((d) => d.status === 'completed').map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={() => setIsPlaying(!isPlaying)} className={cn('btn flex-1', isPlaying ? 'bg-primary-600 text-white' : 'btn-primary')}>
              <Play className="w-4 h-4" /> {isPlaying ? 'Pause' : 'Replay'}
            </button>
            <button onClick={() => setCompareMode(!compareMode)} className={cn('btn-outline', compareMode && 'border-primary-500 text-primary-400')}>
              <GitCompare className="w-4 h-4" /> Compare
            </button>
          </div>
        </div>
        {selectedRegion && selectedDataset && (
          <div className="px-4 pb-3 text-xs text-surface-600 flex items-center gap-4">
            <span>Region: <span className="text-surface-800">{selectedRegion.name}, {selectedRegion.state}</span></span>
            <span>Dataset: <span className="text-surface-800">{selectedDataset.name} v{selectedDataset.version}</span></span>
            <span>Range: <span className="text-surface-800">{selectedDataset.dateRange.start} → {selectedDataset.dateRange.end}</span></span>
          </div>
        )}
      </Panel>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatCard label="Date" value={new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} icon={<Calendar className="w-4 h-4" />} accent="primary" />
        <StatCard label="Avg Rainfall" value={formatNumber(rainfallData.reduce((s, d) => s + d.rainfall, 0) / rainfallData.length)} unit="mm" accent="primary" />
        <StatCard label="Avg Max Temp" value={formatNumber(tempData.reduce((s, d) => s + d.maxTemp, 0) / tempData.length)} unit="°C" accent="warning" />
        <StatCard label="Records" value={selectedDataset?.records.toLocaleString('en-IN') ?? '—'} accent="accent" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Rainfall: Historical vs Predicted">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rainfallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="rainfall" stroke="#06b6d4" strokeWidth={2} dot={false} name="Actual (mm)" />
                {compareMode && <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Predicted (mm)" />}
                <Line type="monotone" dataKey="average" stroke="#475569" strokeWidth={1} dot={false} name="Historical Avg" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Temperature: Historical vs Predicted">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="maxTemp" stroke="#f59e0b" strokeWidth={2} dot={false} name="Max Temp (°C)" />
                <Line type="monotone" dataKey="minTemp" stroke="#22c55e" strokeWidth={1.5} dot={false} name="Min Temp (°C)" />
                {compareMode && <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Predicted Max" />}
                <ReferenceLine y={34.2} stroke="#475569" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Daily breakdown table */}
      <Panel title="Daily Breakdown">
        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-sm">
            <thead className="text-xs text-surface-600 uppercase border-b border-surface-300/60 sticky top-0 bg-surface-100">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Date</th>
                <th className="text-right px-4 py-2 font-medium">Rainfall (mm)</th>
                <th className="text-right px-4 py-2 font-medium">Predicted (mm)</th>
                <th className="text-right px-4 py-2 font-medium">Max Temp (°C)</th>
                <th className="text-right px-4 py-2 font-medium">Min Temp (°C)</th>
                <th className="text-right px-4 py-2 font-medium">Deviation</th>
              </tr>
            </thead>
            <tbody>
              {rainfallData.map((d, i) => {
                const t = tempData[i];
                const dev = d.rainfall - d.predicted;
                return (
                  <tr key={d.date} className="border-b border-surface-300/40 hover:bg-surface-200/40">
                    <td className="px-4 py-1.5 text-surface-900">{d.date}</td>
                    <td className="px-4 py-1.5 text-right metric-value text-primary-400">{d.rainfall}</td>
                    <td className="px-4 py-1.5 text-right metric-value text-surface-700">{d.predicted}</td>
                    <td className="px-4 py-1.5 text-right metric-value text-warning-400">{t.maxTemp}</td>
                    <td className="px-4 py-1.5 text-right metric-value text-success-400">{t.minTemp}</td>
                    <td className={cn('px-4 py-1.5 text-right metric-value', dev > 0 ? 'text-success-400' : 'text-error-400')}>{dev > 0 ? '+' : ''}{dev.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
