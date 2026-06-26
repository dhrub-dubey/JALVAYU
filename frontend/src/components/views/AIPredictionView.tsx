import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';
import { Panel, StatCard, ProgressBar, Spinner } from '../ui';
import { formatNumber, timeAgo, cn } from '../../lib/utils';
import { BrainCircuit, Clock, Target, Zap, Activity, Gauge, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts';
import { generatePredictionAccuracy } from '../../data/mockData';

export function AIPredictionView() {
  const { twin } = useAppStore();
  const predictionsQ = useQuery({ queryKey: ['predictions'], queryFn: api.getPredictions });
  const predictions = predictionsQ.data ?? [];
  const accuracyData = generatePredictionAccuracy();
  const avgAccuracy = accuracyData.reduce((s, d) => s + d.accuracy, 0) / accuracyData.length;

  const inferenceLatency = 142; // ms mock

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-surface-900">AI Prediction Panel</h2>
        <p className="text-sm text-surface-600">Model performance, forecast horizon, and inference metrics</p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <StatCard label="Model" value="ClimateNet-LSTM" icon={<BrainCircuit className="w-4 h-4" />} accent="primary" />
        <StatCard label="Version" value={twin.modelVersion} icon={<Activity className="w-4 h-4" />} accent="accent" />
        <StatCard label="Avg Accuracy" value={formatNumber(avgAccuracy)} unit="%" icon={<Target className="w-4 h-4" />} accent="success" />
        <StatCard label="Inference" value={inferenceLatency} unit="ms" icon={<Zap className="w-4 h-4" />} accent="warning" />
        <StatCard label="Forecast Horizon" value="7d" icon={<Clock className="w-4 h-4" />} accent="primary" />
        <StatCard label="Predictions" value={predictions.length} icon={<TrendingUp className="w-4 h-4" />} accent="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Accuracy over time */}
        <Panel title="Prediction Accuracy (30d)" className="lg:col-span-2">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[80, 100]} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} dot={false} name="Accuracy %" />
                <Line type="monotone" dataKey="rmse" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="RMSE" yAxisId={1} />
                <YAxis yAxisId={1} orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Confidence gauge */}
        <Panel title="Model Confidence">
          <div className="p-4 h-72 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="70%">
              <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: 'conf', value: avgAccuracy, fill: '#06b6d4' }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: '#2a3548' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-12">
              <div className="metric-value text-3xl text-primary-400">{formatNumber(avgAccuracy)}%</div>
              <div className="text-xs text-surface-600">Average Confidence</div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Prediction history table */}
      <Panel title="Prediction History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-surface-600 uppercase border-b border-surface-300/60">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Region</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Horizon</th>
                <th className="text-right px-4 py-2 font-medium">Value</th>
                <th className="text-right px-4 py-2 font-medium">Confidence</th>
                <th className="text-left px-4 py-2 font-medium">Model</th>
                <th className="text-left px-4 py-2 font-medium">Generated</th>
              </tr>
            </thead>
            <tbody>
              {predictionsQ.isLoading ? (
                <tr><td colSpan={7} className="text-center py-6"><Spinner className="text-primary-400 mx-auto" /></td></tr>
              ) : (
                predictions.map((p) => (
                  <tr key={p.id} className="border-b border-surface-300/40 hover:bg-surface-200/40">
                    <td className="px-4 py-2 text-surface-900">{p.region}</td>
                    <td className="px-4 py-2 capitalize"><span className="badge-info">{p.type}</span></td>
                    <td className="px-4 py-2 text-surface-700">{p.horizon}</td>
                    <td className="px-4 py-2 text-right metric-value">{formatNumber(p.value)} {p.unit}</td>
                    <td className="px-4 py-2 text-right">
                      <span className={cn('metric-value', p.confidence > 85 ? 'text-success-400' : 'text-warning-400')}>{p.confidence}%</span>
                    </td>
                    <td className="px-4 py-2 text-surface-700 text-xs">{p.model}</td>
                    <td className="px-4 py-2 text-surface-600 text-xs">{timeAgo(p.timestamp)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Model performance detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel title="Training Status">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-700">Status</span>
              <span className="badge-success capitalize">{twin.trainingStatus}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-surface-600">Progress</span><span className="metric-value">{twin.trainingProgress}%</span></div>
              <ProgressBar value={twin.trainingProgress} />
            </div>
            <div className="text-xs space-y-1 pt-2 border-t border-surface-300/40">
              <div className="flex justify-between"><span className="text-surface-600">Epoch</span><span className="text-surface-800">12 / 20</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Val Loss</span><span className="metric-value text-surface-900">0.0312</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Train Loss</span><span className="metric-value text-surface-900">0.0287</span></div>
            </div>
          </div>
        </Panel>

        <Panel title="Processing Pipeline">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-700">Status</span>
              <span className="badge-info capitalize">{twin.processingStatus}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-surface-600">Progress</span><span className="metric-value">{twin.processingProgress}%</span></div>
              <ProgressBar value={twin.processingProgress} color="primary" />
            </div>
            <div className="text-xs space-y-1 pt-2 border-t border-surface-300/40">
              <div className="flex justify-between"><span className="text-surface-600">Queue</span><span className="text-surface-800">3 jobs</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Throughput</span><span className="metric-value">1.2k rec/s</span></div>
              <div className="flex justify-between"><span className="text-surface-600">ETA</span><span className="text-surface-800">~12 min</span></div>
            </div>
          </div>
        </Panel>

        <Panel title="Inference Metrics">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-700">Status</span>
              <span className="badge-success capitalize">{twin.predictionStatus}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="card p-2">
                <Gauge className="w-3.5 h-3.5 text-primary-400 mb-1" />
                <div className="text-[10px] text-surface-600">Latency</div>
                <div className="metric-value text-sm">{inferenceLatency}ms</div>
              </div>
              <div className="card p-2">
                <Zap className="w-3.5 h-3.5 text-warning-400 mb-1" />
                <div className="text-[10px] text-surface-600">GPU</div>
                <div className="metric-value text-sm">{twin.gpuUsage}%</div>
              </div>
              <div className="card p-2">
                <Activity className="w-3.5 h-3.5 text-success-400 mb-1" />
                <div className="text-[10px] text-surface-600">Throughput</div>
                <div className="metric-value text-sm">8/s</div>
              </div>
              <div className="card p-2">
                <Target className="w-3.5 h-3.5 text-accent-400 mb-1" />
                <div className="text-[10px] text-surface-600">Accuracy</div>
                <div className="metric-value text-sm">{formatNumber(avgAccuracy)}%</div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
