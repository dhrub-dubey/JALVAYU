import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Panel, StatCard, ProgressBar, Spinner, EmptyState } from '../ui';
import { REGIONS, SAVED_SCENARIOS } from '../../data/mockData';
import { formatNumber, cn, timeAgo } from '../../lib/utils';
import { FlaskConical, Play, RotateCcw, Save, Upload, CloudRain, ThermometerSun } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { ScenarioConfig, SimulationResult } from '../../types';

export function SimulatorView() {
  const [scenario, setScenario] = useState<ScenarioConfig>({
    name: 'New Scenario',
    region: 'mumbai',
    rainfallAdjust: 0,
    tempAdjust: 0,
    duration: 7,
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [savedScenarios] = useState(SAVED_SCENARIOS);

  const runMutation = useMutation({
    mutationFn: (sc: ScenarioConfig) => api.runSimulation(sc),
    onSuccess: (r) => setResult(r),
  });

  const saveMutation = useMutation({
    mutationFn: (sc: ScenarioConfig) => api.saveScenario(sc),
  });

  const handleRun = () => {
    setResult(null);
    runMutation.mutate(scenario);
  };

  const handleReset = () => {
    setScenario({ ...scenario, rainfallAdjust: 0, tempAdjust: 0, duration: 7 });
    setResult(null);
  };

  const handleSave = () => {
    saveMutation.mutate(scenario);
  };

  const handleLoad = (sc: ScenarioConfig) => {
    setScenario(sc);
  };

  const selectedRegion = REGIONS.find((r) => r.id === scenario.region);

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-surface-900">Scenario Simulator</h2>
        <p className="text-sm text-surface-600">Create and run climate simulations with adjustable parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Configuration */}
        <Panel title="Simulation Parameters">
          <div className="p-4 space-y-4">
            <div>
              <label className="label">Scenario Name</label>
              <input
                value={scenario.name}
                onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
                className="input"
                placeholder="e.g. Monsoon Surge +20%"
              />
            </div>

            <div>
              <label className="label">Region</label>
              <select
                value={scenario.region}
                onChange={(e) => setScenario({ ...scenario, region: e.target.value })}
                className="input"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name} — {r.state}</option>
                ))}
              </select>
              {selectedRegion && (
                <div className="text-xs text-surface-600 mt-1">
                  {selectedRegion.area} km² · Pop. {selectedRegion.population.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="label !mb-0">Rainfall Adjustment</label>
                <span className={cn('metric-value text-sm', scenario.rainfallAdjust > 0 ? 'text-success-400' : scenario.rainfallAdjust < 0 ? 'text-error-400' : 'text-surface-700')}>
                  {scenario.rainfallAdjust > 0 ? '+' : ''}{scenario.rainfallAdjust}%
                </span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={scenario.rainfallAdjust}
                onChange={(e) => setScenario({ ...scenario, rainfallAdjust: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-surface-600">
                <span>-50% (drought)</span><span>0%</span><span>+50% (surge)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="label !mb-0">Temperature Adjustment</label>
                <span className={cn('metric-value text-sm', scenario.tempAdjust > 0 ? 'text-error-400' : scenario.tempAdjust < 0 ? 'text-primary-400' : 'text-surface-700')}>
                  {scenario.tempAdjust > 0 ? '+' : ''}{scenario.tempAdjust}°C
                </span>
              </div>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.5}
                value={scenario.tempAdjust}
                onChange={(e) => setScenario({ ...scenario, tempAdjust: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-surface-600">
                <span>-5°C</span><span>0°C</span><span>+5°C</span>
              </div>
            </div>

            <div>
              <label className="label">Simulation Duration (days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={scenario.duration}
                onChange={(e) => setScenario({ ...scenario, duration: Math.max(1, Math.min(30, Number(e.target.value))) })}
                className="input"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={handleRun} disabled={runMutation.isPending} className="btn-primary flex-1">
                {runMutation.isPending ? <Spinner size={14} /> : <Play className="w-4 h-4" />}
                {runMutation.isPending ? 'Running...' : 'Run Simulation'}
              </button>
              <button onClick={handleReset} className="btn-outline">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button onClick={handleSave} disabled={saveMutation.isPending} className="btn-outline">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </Panel>

        {/* Results */}
        <Panel title="Simulation Results">
          <div className="p-4">
            {runMutation.isPending ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size={32} className="text-primary-400 mb-3" />
                <p className="text-sm text-surface-600">Running simulation for {selectedRegion?.name}...</p>
                <ProgressBar value={50} color="primary" className="mt-3 w-48" />
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <StatCard label="Avg Rain" value={formatNumber(result.summary.avgRainfall)} unit="mm" icon={<CloudRain className="w-3.5 h-3.5" />} accent="primary" />
                  <StatCard label="Avg Max" value={formatNumber(result.summary.avgMaxTemp)} unit="°C" icon={<ThermometerSun className="w-3.5 h-3.5" />} accent="warning" />
                  <StatCard label="Avg Min" value={formatNumber(result.summary.avgMinTemp)} unit="°C" accent="success" />
                  <StatCard label="Deviation" value={`${result.summary.deviation > 0 ? '+' : ''}${result.summary.deviation}`} accent="accent" />
                </div>

                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.results}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(d) => d.slice(5)} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line yAxisId="left" type="monotone" dataKey="rainfall" stroke="#06b6d4" strokeWidth={2} dot={false} name="Rainfall (mm)" />
                      <Line yAxisId="right" type="monotone" dataKey="maxTemp" stroke="#f59e0b" strokeWidth={2} dot={false} name="Max Temp (°C)" />
                      <Line yAxisId="right" type="monotone" dataKey="minTemp" stroke="#22c55e" strokeWidth={1.5} dot={false} name="Min Temp (°C)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-xs text-surface-600 flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5" />
                  Simulation completed for {selectedRegion?.name} over {scenario.duration} days
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<FlaskConical className="w-8 h-8" />}
                title="No simulation yet"
                message="Configure parameters and click Run Simulation to see results."
              />
            )}
          </div>
        </Panel>
      </div>

      {/* Saved scenarios */}
      <Panel title="Saved Scenarios">
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {savedScenarios.map((sc) => {
            const region = REGIONS.find((r) => r.id === sc.region);
            return (
              <div key={sc.id} className="card p-3 hover:border-primary-500/40 transition-colors cursor-pointer" onClick={() => handleLoad(sc)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-surface-900">{sc.name}</span>
                  <Upload className="w-3.5 h-3.5 text-surface-600" />
                </div>
                <div className="text-xs text-surface-600 space-y-0.5">
                  <div>Region: {region?.name ?? sc.region}</div>
                  <div>Rainfall: {sc.rainfallAdjust > 0 ? '+' : ''}{sc.rainfallAdjust}% · Temp: {sc.tempAdjust > 0 ? '+' : ''}{sc.tempAdjust}°C</div>
                  <div>Duration: {sc.duration} days</div>
                  {sc.createdAt && <div className="text-surface-500">{timeAgo(sc.createdAt)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
