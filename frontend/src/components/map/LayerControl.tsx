import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import type { LayerId } from '../../types';
import {
  CloudRain,
  ThermometerSun,
  ThermometerSnowflake,
  Satellite,
  Mountain,
  Waves,
  Map,
  Grid3x3,
  BrainCircuit,
  FlaskConical,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  CloudRain,
  ThermometerSun,
  ThermometerSnowflake,
  Satellite,
  Mountain,
  Waves,
  Map,
  Grid3x3,
  BrainCircuit,
  FlaskConical,
};

export function LayerControl() {
  const { layers, toggleLayer, setLayerOpacity } = useAppStore();

  return (
    <div className="card flex flex-col max-h-full">
      <div className="px-4 py-2.5 border-b border-surface-300/60">
        <h3 className="section-title">Climate Layers</h3>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-1">
        {layers.map((layer) => {
          const Icon = ICONS[layer.icon] ?? Map;
          return (
            <div key={layer.id} className={cn('rounded-md transition-colors', layer.enabled && 'bg-surface-200/60')}>
              <button
                onClick={() => toggleLayer(layer.id as LayerId)}
                className="flex items-center justify-between w-full px-2.5 py-2 group"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon className={cn('w-4 h-4 shrink-0', layer.enabled ? 'text-primary-400' : 'text-surface-600')} />
                  <span className="min-w-0">
                    <span className={cn('block text-sm truncate', layer.enabled ? 'text-surface-900' : 'text-surface-700')}>{layer.name}</span>
                    <span className="block text-[10px] text-surface-600 truncate">{layer.description}</span>
                  </span>
                </span>
                {layer.enabled ? <Eye className="w-3.5 h-3.5 text-primary-400 shrink-0" /> : <EyeOff className="w-3.5 h-3.5 text-surface-600 shrink-0" />}
              </button>
              {layer.enabled && layer.unit && (
                <div className="px-2.5 pb-2 flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={layer.opacity * 100}
                    onChange={(e) => setLayerOpacity(layer.id as LayerId, Number(e.target.value) / 100)}
                    className="flex-1"
                  />
                  <span className="text-[10px] text-surface-600 font-mono w-8 text-right">{Math.round(layer.opacity * 100)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
