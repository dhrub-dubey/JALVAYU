import { Panel, StatCard } from '../ui';
import { formatNumber } from '../../lib/utils';
import {
  generateRainfallTrend, generateTempTrend, generateMonthlyAnalysis,
  generatePredictionAccuracy, generateRegionalComparison, generateExtremeEvents,
  generateYearlyAnalysis,
} from '../../data/mockData';
import { CloudRain, ThermometerSun, BarChart3, Target, AlertTriangle, Calendar } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
  ComposedChart, Cell,
} from 'recharts';

const EXTREME_COLORS = ['#ef4444', '#06b6d4', '#a855f7', '#0ea5e9', '#f59e0b', '#22c55e'];

export function AnalyticsView() {
  const rainfallTrend = generateRainfallTrend(30);
  const tempTrend = generateTempTrend(30);
  const monthly = generateMonthlyAnalysis();
  const accuracy = generatePredictionAccuracy();
  const regional = generateRegionalComparison();
  const extremes = generateExtremeEvents();
  const yearly = generateYearlyAnalysis();

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-surface-900">Analytics Dashboard</h2>
        <p className="text-sm text-surface-600">Interactive climate analytics, trends, and statistical analysis</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <StatCard label="30d Avg Rain" value={formatNumber(rainfallTrend.reduce((s, d) => s + d.rainfall, 0) / rainfallTrend.length)} unit="mm" icon={<CloudRain className="w-4 h-4" />} accent="primary" />
        <StatCard label="30d Avg Max" value={formatNumber(tempTrend.reduce((s, d) => s + d.maxTemp, 0) / tempTrend.length)} unit="°C" icon={<ThermometerSun className="w-4 h-4" />} accent="warning" />
        <StatCard label="Model Accuracy" value={formatNumber(accuracy.reduce((s, d) => s + d.accuracy, 0) / accuracy.length)} unit="%" icon={<Target className="w-4 h-4" />} accent="success" />
        <StatCard label="Extreme Events" value={extremes.reduce((s, e) => s + e.count, 0)} icon={<AlertTriangle className="w-4 h-4" />} accent="error" />
        <StatCard label="Regions Tracked" value={regional.length} icon={<BarChart3 className="w-4 h-4" />} accent="accent" />
        <StatCard label="Years of Data" value={yearly.length} icon={<Calendar className="w-4 h-4" />} accent="primary" />
      </div>

      {/* Rainfall & Temp trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Rainfall Trends (30 days)">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="rainfall" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} name="Rainfall (mm)" />
                <Line type="monotone" dataKey="average" stroke="#475569" strokeWidth={1} dot={false} name="Historical Avg" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Temperature Trends (30 days)">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="maxTemp" stroke="#f59e0b" strokeWidth={2} dot={false} name="Max Temp (°C)" />
                <Line type="monotone" dataKey="minTemp" stroke="#22c55e" strokeWidth={1.5} dot={false} name="Min Temp (°C)" />
                <ReferenceLine y={34.2} stroke="#475569" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Monthly & Yearly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Monthly Analysis">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="rainfall" fill="#06b6d4" fillOpacity={0.6} name="Rainfall (mm)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} name="Temp (°C)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Yearly Analysis (10 years)">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={yearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="avgRainfall" fill="#06b6d4" fillOpacity={0.5} name="Avg Rainfall (mm)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="avgTemp" stroke="#f59e0b" strokeWidth={2} name="Avg Temp (°C)" />
                <Line yAxisId="left" type="monotone" dataKey="extremeEvents" stroke="#ef4444" strokeWidth={1.5} name="Extreme Events" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Prediction accuracy & Regional comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Prediction Accuracy (30 days)">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="left" domain={[80, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} dot={false} name="Accuracy %" />
                <Line yAxisId="right" type="monotone" dataKey="rmse" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="RMSE" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Regional Comparison">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regional} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="rainfall" fill="#06b6d4" fillOpacity={0.7} name="Rainfall (mm)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="maxTemp" fill="#f59e0b" fillOpacity={0.7} name="Max Temp (°C)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Extreme events & Historical comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Extreme Event Statistics">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={extremes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="event" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {extremes.map((_, i) => <Cell key={i} fill={EXTREME_COLORS[i % EXTREME_COLORS.length]} fillOpacity={0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Historical Comparison: Rainfall vs Avg">
          <div className="p-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={rainfallTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: '#141a23', border: '1px solid #2a3548', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="rainfall" fill="#06b6d4" fillOpacity={0.4} name="Actual (mm)" radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="average" stroke="#a855f7" strokeWidth={2} dot={false} name="30y Avg" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}
