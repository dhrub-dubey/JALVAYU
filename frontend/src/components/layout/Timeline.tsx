import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import { Play, Pause, SkipBack, SkipForward, Rewind, FastForward, Calendar } from 'lucide-react';

export function Timeline() {
  const { timeline, setTimeline, tickTimeline } = useAppStore();

  // Playback tick
  useEffect(() => {
    if (!timeline.isPlaying) return;
    const interval = setInterval(() => tickTimeline(), 1000);
    return () => clearInterval(interval);
  }, [timeline.isPlaying, timeline.speed, tickTimeline]);

  const min = new Date(timeline.minDate).getTime();
  const max = new Date(timeline.maxDate).getTime();
  const cur = new Date(timeline.currentDate).getTime();
  const now = Date.now();
  const pct = ((cur - min) / (max - min)) * 100;
  const nowPct = ((now - min) / (max - min)) * 100;

  const modeColor = {
    historical: 'text-primary-400',
    current: 'text-success-400',
    forecast: 'text-accent-400',
  };

  return (
    <div className="h-20 border-t border-surface-300/60 bg-surface-100/80 backdrop-blur-md px-4 flex items-center gap-4">
      {/* Playback controls */}
      <div className="flex items-center gap-1">
        <button onClick={() => setTimeline({ currentDate: timeline.minDate, mode: 'historical' })} className="btn-ghost !p-1.5" title="Jump to start">
          <SkipBack className="w-4 h-4" />
        </button>
        <button onClick={() => { const d = new Date(timeline.currentDate); d.setDate(d.getDate() - 1); setTimeline({ currentDate: d.toISOString() }); }} className="btn-ghost !p-1.5" title="Rewind 1 day">
          <Rewind className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTimeline({ isPlaying: !timeline.isPlaying })}
          className={cn('btn !p-2 rounded-full', timeline.isPlaying ? 'bg-primary-600 text-white' : 'bg-surface-300 text-surface-900 hover:bg-surface-400')}
        >
          {timeline.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => { const d = new Date(timeline.currentDate); d.setDate(d.getDate() + 1); setTimeline({ currentDate: d.toISOString() }); }} className="btn-ghost !p-1.5" title="Forward 1 day">
          <FastForward className="w-4 h-4" />
        </button>
        <button onClick={() => setTimeline({ currentDate: timeline.maxDate, mode: 'forecast' })} className="btn-ghost !p-1.5" title="Jump to end">
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline slider */}
      <div className="flex-1 relative">
        <div className="flex items-center justify-between mb-1">
          <span className={cn('text-xs font-medium capitalize', modeColor[timeline.mode])}>
            {timeline.mode} {timeline.isPlaying && '●'}
          </span>
          <span className="text-xs font-mono text-surface-900">
            {new Date(timeline.currentDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="relative h-6 flex items-center">
          {/* Track */}
          <div className="absolute inset-x-0 h-1.5 bg-surface-300 rounded-full" />
          {/* "Now" marker */}
          <div className="absolute h-3 w-0.5 bg-success-500" style={{ left: `${nowPct}%` }} title="Now" />
          {/* Filled */}
          <div className="absolute h-1.5 bg-primary-600 rounded-full" style={{ width: `${pct}%` }} />
          {/* Slider */}
          <input
            type="range"
            min={min}
            max={max}
            value={cur}
            onChange={(e) => {
              const d = new Date(Number(e.target.value));
              const mode = d.getTime() < now ? 'historical' : d.getTime() > now ? 'forecast' : 'current';
              setTimeline({ currentDate: d.toISOString(), mode });
            }}
            className="absolute inset-x-0 w-full opacity-70"
          />
        </div>
        <div className="flex justify-between text-[10px] text-surface-600 mt-0.5">
          <span>{new Date(timeline.minDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}</span>
          <span>Now</span>
          <span>{new Date(timeline.maxDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}</span>
        </div>
      </div>

      {/* Speed + jump */}
      <div className="flex items-center gap-2">
        <select
          value={timeline.speed}
          onChange={(e) => setTimeline({ speed: Number(e.target.value) })}
          className="input !py-1 !w-16 text-xs"
          title="Playback speed"
        >
          <option value={1}>1×</option>
          <option value={2}>2×</option>
          <option value={4}>4×</option>
          <option value={8}>8×</option>
        </select>
        <label className="flex items-center gap-1.5 text-xs text-surface-600">
          <Calendar className="w-3.5 h-3.5" />
          <input
            type="date"
            value={timeline.currentDate.slice(0, 10)}
            onChange={(e) => setTimeline({ currentDate: new Date(e.target.value).toISOString() })}
            className="input !py-1 !w-36 text-xs"
          />
        </label>
      </div>
    </div>
  );
}
