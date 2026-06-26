import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, Tooltip as LeafletTooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../../store/useAppStore';
import { REGIONS, CURRENT_READINGS } from '../../data/mockData';
import { interpolateColor, cn } from '../../lib/utils';
import type { ClimateLayer, LayerId } from '../../types';

// India center
const INDIA_CENTER: [number, number] = [22.5, 80];
const INDIA_BOUNDS: [[number, number], [number, number]] = [[6, 67], [37, 98]];

function getActiveDataLayer(layers: ClimateLayer[]): ClimateLayer | null {
  // Priority: rainfall > temp > others (first enabled data layer)
  const priority: LayerId[] = ['rainfall', 'max_temp', 'min_temp', 'satellite_rainfall', 'land_surface_temp', 'sea_surface_temp', 'prediction', 'simulation'];
  for (const id of priority) {
    const l = layers.find((l) => l.id === id && l.enabled);
    if (l) return l;
  }
  return null;
}

function MapClickHandler() {
  const { setSelectedRegion } = useAppStore();
  const map = useMap();
  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      // Find nearest region
      let nearest: string | null = null;
      let minDist = Infinity;
      for (const r of REGIONS) {
        const dist = Math.hypot(e.latlng.lat - r.lat, e.latlng.lng - r.lng);
        if (dist < minDist) {
          minDist = dist;
          nearest = r.id;
        }
      }
      if (minDist < 3) setSelectedRegion(nearest);
    };
    map.on('click', handler);
    return () => { map.off('click', handler); };
  }, [map, setSelectedRegion]);
  return null;
}

function CoordinateDisplay() {
  const map = useMap();
  const coordRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      if (coordRef.current) {
        coordRef.current.textContent = `${e.latlng.lat.toFixed(3)}°N, ${e.latlng.lng.toFixed(3)}°E`;
      }
    };
    map.on('mousemove', handler);
    return () => { map.off('mousemove', handler); };
  }, [map]);
  return (
    <div className="absolute bottom-2 left-2 z-[1000] glass-panel rounded-md px-2.5 py-1 text-xs font-mono text-surface-700 pointer-events-none">
      <div ref={coordRef}>— , —</div>
    </div>
  );
}

// Simple India outline (simplified bounding polygon)
const INDIA_OUTLINE = {
  type: 'Feature' as const,
  geometry: {
    type: 'Polygon' as const,
    coordinates: [[
      [68, 8], [72, 8], [76, 8], [78, 8], [80, 6], [82, 7], [84, 8], [88, 9], [90, 12], [92, 14], [94, 16], [96, 20], [97, 24], [96, 28], [92, 28], [88, 28], [86, 27], [84, 28], [80, 30], [78, 31], [76, 32], [74, 34], [72, 34], [70, 32], [68, 28], [67, 24], [68, 20], [68, 16], [68, 12], [68, 8],
    ]],
  },
  properties: {},
};

export function ClimateMap() {
  const { layers, selectedRegionId, setSelectedRegion, mapFullscreen, settings } = useAppStore();
  const activeLayer = getActiveDataLayer(layers);
  const showBoundaries = layers.find((l) => l.id === 'boundaries')?.enabled;
  const showGrid = layers.find((l) => l.id === 'grid_cells')?.enabled;
  const gridOpacity = layers.find((l) => l.id === 'grid_cells')?.opacity ?? 0.4;

  const tileUrl = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  }[settings.defaultMap] ?? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  // Determine value range for color scale
  const readings = CURRENT_READINGS;
  const getValue = (r: typeof readings[0]) => {
    if (activeLayer?.id === 'rainfall' || activeLayer?.id === 'satellite_rainfall') return r.rainfall;
    if (activeLayer?.id === 'max_temp' || activeLayer?.id === 'land_surface_temp') return r.maxTemp;
    if (activeLayer?.id === 'min_temp') return r.minTemp;
    if (activeLayer?.id === 'sea_surface_temp') return r.maxTemp - 2;
    return r.rainfall;
  };

  const values = readings.map(getValue);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const scale = activeLayer?.colorScale ?? ['#06b6d4'];

  return (
    <div className={cn('relative w-full h-full bg-surface-0', mapFullscreen && 'fixed inset-0 z-[2000]')}>
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        minZoom={4}
        maxZoom={10}
        maxBounds={INDIA_BOUNDS}
        zoomControl={true}
        className="w-full h-full"
        attributionControl={true}
      >
        {/* Base tile layer — responds to default map setting */}
        <TileLayer
          key={tileUrl}
          url={tileUrl}
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />

        {/* India outline */}
        {showBoundaries && (
          <GeoJSON
            data={INDIA_OUTLINE as any}
            style={{ color: '#64748b', weight: 1.5, fillOpacity: 0.03, opacity: 0.6 }}
          />
        )}

        {/* Grid overlay */}
        {showGrid && (
          <GeoJSON
            data={INDIA_OUTLINE as any}
            style={{ color: '#475569', weight: 0.5, fillOpacity: 0, opacity: gridOpacity, dashArray: '4,4' }}
          />
        )}

        {/* Heatmap-style circle markers for each region */}
        {readings.map((r, i) => {
          const region = REGIONS[i];
          if (!region) return null;
          const val = getValue(r);
          const color = interpolateColor(val, minVal, maxVal, scale);
          const radius = 8 + (val - minVal) / (maxVal - minVal + 0.1) * 20;
          const isSelected = selectedRegionId === region.id;
          return (
            <CircleMarker
              key={region.id}
              center={[region.lat, region.lng]}
              radius={radius}
              pathOptions={{
                color: isSelected ? '#06b6d4' : color,
                fillColor: color,
                fillOpacity: activeLayer?.opacity ?? 0.6,
                weight: isSelected ? 3 : 1,
              }}
              eventHandlers={{ click: () => setSelectedRegion(region.id) }}
            >
              <Popup>
                <div className="space-y-1 min-w-[160px]">
                  <div className="font-semibold text-sm">{region.name}</div>
                  <div className="text-xs text-surface-600">{region.state}</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs mt-2">
                    <span className="text-surface-600">Rainfall:</span><span className="font-mono">{r.rainfall} mm</span>
                    <span className="text-surface-600">Max Temp:</span><span className="font-mono">{r.maxTemp}°C</span>
                    <span className="text-surface-600">Min Temp:</span><span className="font-mono">{r.minTemp}°C</span>
                    <span className="text-surface-600">Area:</span><span className="font-mono">{region.area} km²</span>
                  </div>
                </div>
              </Popup>
              <LeafletTooltip direction="top" offset={[0, -radius]}>
                <div className="text-xs">
                  <div className="font-medium">{region.name}</div>
                  <div className="text-surface-600">{val} {activeLayer?.unit}</div>
                </div>
              </LeafletTooltip>
            </CircleMarker>
          );
        })}

        <MapClickHandler />
        <CoordinateDisplay />
      </MapContainer>

      {/* Legend */}
      {activeLayer && (
        <div className="absolute bottom-2 right-2 z-[1000] glass-panel rounded-md p-2.5 w-44">
          <div className="text-[10px] font-semibold text-surface-700 uppercase tracking-wide mb-1.5">{activeLayer.name}</div>
          <div className="flex items-center gap-1">
            <div className="text-[10px] text-surface-600 font-mono">{minVal.toFixed(0)}</div>
            <div className="flex-1 h-2 rounded-full" style={{ background: `linear-gradient(to right, ${scale.join(', ')})` }} />
            <div className="text-[10px] text-surface-600 font-mono">{maxVal.toFixed(0)}</div>
          </div>
          <div className="text-[10px] text-surface-600 mt-1">{activeLayer.unit}</div>
        </div>
      )}

      {/* Scale */}
      <div className="absolute top-2 right-2 z-[1000] glass-panel rounded-md px-2.5 py-1 text-[10px] text-surface-600 font-mono">
        EPSG:4326 · WGS84
      </div>
    </div>
  );
}
