import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Panel, Spinner, EmptyState, ProgressBar } from '../ui';
import { cn, formatDateTime, timeAgo, formatCompact } from '../../lib/utils';
import { Database, Search, Download, FileText, CheckCircle2, XCircle, Loader, Clock, Filter } from 'lucide-react';
import type { Dataset } from '../../types';

const STATUS_META: Record<string, { icon: React.ReactNode; badge: string }> = {
  completed: { icon: <CheckCircle2 className="w-3.5 h-3.5 text-success-400" />, badge: 'badge-success' },
  processing: { icon: <Loader className="w-3.5 h-3.5 text-primary-400 animate-spin" />, badge: 'badge-info' },
  queued: { icon: <Clock className="w-3.5 h-3.5 text-warning-400" />, badge: 'badge-warning' },
  failed: { icon: <XCircle className="w-3.5 h-3.5 text-error-400" />, badge: 'badge-error' },
};

const TYPE_COLORS: Record<string, string> = {
  rainfall: 'text-primary-400',
  temperature: 'text-warning-400',
  satellite: 'text-accent-400',
  land_surface: 'text-success-400',
  sea_surface: 'text-primary-300',
  grid: 'text-surface-600',
};

export function DatasetsView() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Dataset | null>(null);

  const datasetsQ = useQuery({ queryKey: ['datasets'], queryFn: api.getDatasets });
  const datasets = datasetsQ.data ?? [];

  const filtered = datasets.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.source.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || d.status === filter || d.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-surface-900">Dataset Explorer</h2>
        <p className="text-sm text-surface-600">Browse, inspect, and monitor climate datasets</p>
      </div>

      {/* Search & filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search datasets..." className="input pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-surface-600" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input !w-40">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="queued">Queued</option>
            <option value="failed">Failed</option>
            <option value="rainfall">Rainfall</option>
            <option value="temperature">Temperature</option>
            <option value="satellite">Satellite</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Dataset list */}
        <div className="lg:col-span-2">
          <Panel title={`Datasets (${filtered.length})`}>
            <div className="p-3 space-y-2">
              {datasetsQ.isLoading ? (
                <div className="flex justify-center py-8"><Spinner size={24} className="text-primary-400" /></div>
              ) : filtered.length === 0 ? (
                <EmptyState icon={<Database className="w-8 h-8" />} title="No datasets found" message="Try adjusting your search or filter." />
              ) : (
                filtered.map((d) => {
                  const meta = STATUS_META[d.status];
                  const isSelected = selected?.id === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelected(d)}
                      className={cn('card p-3 cursor-pointer transition-all', isSelected ? 'border-primary-500/60 bg-primary-600/5' : 'hover:border-surface-400')}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className={cn('w-4 h-4 shrink-0', TYPE_COLORS[d.type])} />
                            <span className="text-sm font-medium text-surface-900 truncate">{d.name}</span>
                            <span className="badge-neutral">v{d.version}</span>
                          </div>
                          <p className="text-xs text-surface-600 mt-1 line-clamp-1">{d.description}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-surface-600">
                            <span>{d.source}</span>
                            <span>·</span>
                            <span>{d.size}</span>
                            <span>·</span>
                            <span>{formatCompact(d.records)} records</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={cn('flex items-center gap-1 capitalize', meta.badge)}>
                            {meta.icon} {d.status}
                          </span>
                          <span className="text-[10px] text-surface-600">{timeAgo(d.ingestionDate)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Panel>
        </div>

        {/* Detail panel */}
        <div>
          <Panel title="Dataset Details">
            {selected ? (
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-sm font-semibold text-surface-900">{selected.name}</div>
                  <div className="text-xs text-surface-600">{selected.source}</div>
                </div>
                <p className="text-xs text-surface-700">{selected.description}</p>

                <div className="space-y-2 pt-2 border-t border-surface-300/40">
                  <Row label="ID" value={selected.id} />
                  <Row label="Version" value={selected.version} />
                  <Row label="Type" value={selected.type} />
                  <Row label="Size" value={selected.size} />
                  <Row label="Records" value={selected.records.toLocaleString('en-IN')} />
                  <Row label="Status" value={selected.status} />
                  <Row label="Date Range" value={`${selected.dateRange.start} → ${selected.dateRange.end}`} />
                  <Row label="Ingested" value={formatDateTime(selected.ingestionDate)} />
                </div>

                {/* Metadata */}
                <div className="pt-2 border-t border-surface-300/40">
                  <div className="text-xs font-semibold text-surface-700 uppercase mb-2">Metadata</div>
                  <div className="space-y-1">
                    {Object.entries(selected.metadata).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-surface-600 capitalize">{k.replace('_', ' ')}</span>
                        <span className="text-surface-800 font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing progress */}
                {selected.status === 'processing' && (
                  <div className="pt-2 border-t border-surface-300/40">
                    <div className="text-xs text-surface-600 mb-1">Processing</div>
                    <ProgressBar value={67} color="primary" />
                  </div>
                )}

                <button className="btn-outline w-full mt-2">
                  <Download className="w-4 h-4" /> Download Metadata
                </button>
              </div>
            ) : (
              <EmptyState icon={<Database className="w-8 h-8" />} title="Select a dataset" message="Click a dataset to view its metadata and details." />
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-surface-600">{label}</span>
      <span className="text-surface-900 font-mono text-right">{value}</span>
    </div>
  );
}
