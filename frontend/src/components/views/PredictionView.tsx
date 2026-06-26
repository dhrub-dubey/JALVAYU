import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Panel, StatCard, ProgressBar, Spinner, EmptyState } from '../ui';
import { formatNumber, cn, timeAgo } from '../../lib/utils';
import { CloudRain, ThermometerSun, TrendingUp, TrendingDown, Minus, BrainCircuit, Clock, Target } from 'lucide-react';
import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart,
} from 'recharts';
import type { Prediction } from '../../types';

function PredictionCard({ pred }: { pred: Prediction }) {
  const trendIcon = pred.trend === 'up' ? <TrendingUp className="w-4 h-4 text-success-400" /> : pred.trend === 'down' ? <TrendingDown className="w-4 h-4 text-error-400" /> : <Minus className="w-4 h-4 text-surface-600" />;
  const isRain = pred.type === 'rainfall';
  const color = isRain ? '#06b6d4' : '#f59e0b';
  const deviation = Number(((pred.value - pred.historicalAverage) / pred.historicalAverage * 100).toFixed(1));

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {isRain ? <CloudRain className="w-4 h-4 text-primary-400" /> : <ThermometerSun className="w-4 h-4 text-warning-400" />}
            <span className="text-sm font-semibold text-surface-900">{pred.region}</span>
            <span className="badge-neutral capitalize">{pred.type}</span>
          </div>
          <div className="text-xs text-surface-600 mt-0.5">Horizon: {pred.horizon} · {pred.model}</div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span className="metric-value text-2xl" style={{ color }}>{formatNumber(pred.value)}</span>
            <span className="text-xs text-surface-600">{pred.unit}</span>
          </div>
          <div className="flex items-center gap-1 justify-end text-xs">
            {trendIcon}
            <span className="text-surface-600">{pred.trend}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-[10px] text-surface-600 uppercase">Confidence</div>
          <div className="metric-value text-sm text-surface-900">{pred.confidence}%</div>
          <ProgressBar value={pred.confidence} color={pred.confidence > 80 ? 'success' : 'warning'} className="mt-1" />
        </div>
        <div>
          <div className="text-[10px] text-surface-600 uppercase">Hist. Avg</div>
          <div className="metric-value text-sm text-surface-900">{formatNumber(pred.historicalAverage)} {pred.unit}</div>
        </div>
        <div>
          <div className="text-[10px] text-surface-600 uppercase">Deviation</div>
          <div className={cn('metric-value text-sm', deviation > 0 ? 'text-success-400' : 'text-error-400')}>
            {deviation > 0 ? '+' : ''}{deviation}%
          </div>
        </div>
      </div>

      {/* History chart */}
      <div className="h-40 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={pred.history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(d) => d.slice(5)} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <ReferenceLine x={pred.history.find((h) => h.actual === null)?.date} stroke="#475569" strokeDasharray="3 3" label={{ value: 'now', fill: '#64748b', fontSize: 10 }} />
            <Area type="monotone" dataKey="predicted" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2} name="Predicted" />
            <Line type="monotone" dataKey="actual" stroke="#e2e8f0" strokeWidth={1.5} dot={false} name="Actual" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-surface-600 pt-1 border-t border-surface-300/40">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(pred.timestamp)}</span>
        <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {pred.confidence}% confidence</span>
      </div>
    </div>
  );
}

export function PredictionView() {
  const predictionsQ = useQuery({ queryKey: ['predictions'], queryFn: api.getPredictions });
  const predictions = predictionsQ.data ?? [];

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-surface-900">Prediction Dashboard</h2>
          <p className="text-sm text-surface-600">AI-generated climate forecasts with confidence intervals and historical comparison</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatCard label="Active Predictions" value={predictions.length} icon={<BrainCircuit className="w-4 h-4" />} accent="primary" />
        <StatCard label="Avg Confidence" value={predictions.length ? Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length) : '—'} unit="%" icon={<Target className="w-4 h-4" />} accent="success" />
        <StatCard label="Model" value="v4.2" icon={<BrainCircuit className="w-4 h-4" />} accent="accent" />
        <StatCard label="Last Updated" value={predictions[0] ? timeAgo(predictions[0].timestamp) : '—'} icon={<Clock className="w-4 h-4" />} accent="primary" />
      </div>

      {/* Regional summaries */}
      <Panel title="Regional Summaries">
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {predictionsQ.isLoading ? (
            <div className="col-span-full flex justify-center py-8"><Spinner size={24} className="text-primary-400" /></div>
          ) : predictions.length === 0 ? (
            <EmptyState title="No predictions available" message="Predictions will appear once the AI model generates forecasts." />
          ) : (
            predictions.map((p) => <PredictionCard key={p.id} pred={p} />)
          )}
        </div>
      </Panel>
    </div>
  );
}
