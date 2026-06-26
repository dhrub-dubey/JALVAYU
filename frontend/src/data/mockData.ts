import type {
  ClimateLayer,
  TwinState,
  Prediction,
  Dataset,
  Alert,
  Notification,
  Region,
  ScenarioConfig,
  SimulationResult,
  User,
  UserSettings,
} from '../types';

export const DEFAULT_LAYERS: ClimateLayer[] = [
  {
    id: 'rainfall',
    name: 'Rainfall',
    description: 'Daily precipitation accumulation (mm)',
    unit: 'mm',
    enabled: true,
    opacity: 0.7,
    colorScale: ['#1e3a5f', '#2563eb', '#06b6d4', '#22c55e', '#eab308', '#f97316', '#ef4444'],
    icon: 'CloudRain',
  },
  {
    id: 'max_temp',
    name: 'Maximum Temperature',
    description: 'Daily maximum temperature (°C)',
    unit: '°C',
    enabled: true,
    opacity: 0.65,
    colorScale: ['#0c4a6e', '#0891b2', '#22c55e', '#eab308', '#f97316', '#dc2626', '#7f1d1d'],
    icon: 'ThermometerSun',
  },
  {
    id: 'min_temp',
    name: 'Minimum Temperature',
    description: 'Daily minimum temperature (°C)',
    unit: '°C',
    enabled: false,
    opacity: 0.6,
    colorScale: ['#1e3a5f', '#0e7490', '#06b6d4', '#22c55e', '#eab308', '#f97316'],
    icon: 'ThermometerSnowflake',
  },
  {
    id: 'satellite_rainfall',
    name: 'Satellite Rainfall',
    description: 'IMERG / GPM satellite-derived rainfall',
    unit: 'mm',
    enabled: false,
    opacity: 0.6,
    colorScale: ['#1e3a5f', '#2563eb', '#06b6d4', '#22c55e', '#eab308', '#f97316', '#ef4444'],
    icon: 'Satellite',
  },
  {
    id: 'land_surface_temp',
    name: 'Land Surface Temperature',
    description: 'MODIS LST (°C)',
    unit: '°C',
    enabled: false,
    opacity: 0.6,
    colorScale: ['#0c4a6e', '#0891b2', '#22c55e', '#eab308', '#f97316', '#dc2626', '#7f1d1d'],
    icon: 'Mountain',
  },
  {
    id: 'sea_surface_temp',
    name: 'Sea Surface Temperature',
    description: 'SST around Indian coastline (°C)',
    unit: '°C',
    enabled: false,
    opacity: 0.6,
    colorScale: ['#1e3a5f', '#0e7490', '#06b6d4', '#22c55e', '#eab308', '#f97316'],
    icon: 'Waves',
  },
  {
    id: 'boundaries',
    name: 'Administrative Boundaries',
    description: 'State & district boundaries',
    unit: '',
    enabled: true,
    opacity: 0.8,
    colorScale: ['#64748b'],
    icon: 'Map',
  },
  {
    id: 'grid_cells',
    name: 'Grid Cells',
    description: '0.25° × 0.25° climate grid',
    unit: '',
    enabled: false,
    opacity: 0.4,
    colorScale: ['#475569'],
    icon: 'Grid3x3',
  },
  {
    id: 'prediction',
    name: 'Prediction Layer',
    description: 'AI forecast overlay',
    unit: '',
    enabled: false,
    opacity: 0.55,
    colorScale: ['#7c3aed', '#a855f7', '#06b6d4', '#22c55e', '#eab308'],
    icon: 'BrainCircuit',
  },
  {
    id: 'simulation',
    name: 'Simulation Layer',
    description: 'Scenario simulation overlay',
    unit: '',
    enabled: false,
    opacity: 0.55,
    colorScale: ['#0e7490', '#06b6d4', '#22c55e', '#eab308', '#f97316'],
    icon: 'FlaskConical',
  },
];

export const DEFAULT_TWIN_STATE: TwinState = {
  status: 'running',
  health: 94,
  simulationStatus: 'idle',
  lastUpdated: new Date().toISOString(),
  currentDataset: 'IMD Gridded Rainfall v2.3',
  currentModel: 'ClimateNet-LSTM v4.2',
  modelVersion: '4.2.1',
  predictionStatus: 'ready',
  processingStatus: 'processing',
  trainingStatus: 'idle',
  trainingProgress: 0,
  processingProgress: 67,
  predictionProgress: 100,
  uptime: '14d 7h 22m',
  cpuUsage: 42,
  memoryUsage: 63,
  gpuUsage: 78,
  activeJobs: 3,
};

export const REGIONS: Region[] = [
  { id: 'delhi', name: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.209, bounds: [[28.4, 76.8], [28.9, 77.4]], area: 1484, population: 32000000 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777, bounds: [[18.9, 72.7], [19.3, 73.1]], area: 603, population: 20400000 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, bounds: [[22.4, 88.2], [22.7, 88.6]], area: 185, population: 14800000 },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, bounds: [[12.9, 80.1], [13.2, 80.4]], area: 426, population: 11500000 },
  { id: 'bangalore', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, bounds: [[12.8, 77.4], [13.2, 77.8]], area: 709, population: 13200000 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867, bounds: [[17.2, 78.3], [17.6, 78.7]], area: 650, population: 10800000 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, bounds: [[26.7, 75.6], [27.1, 76.0]], area: 467, population: 4600000 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, bounds: [[22.9, 72.4], [23.2, 72.8]], area: 464, population: 8400000 },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, bounds: [[23.1, 77.2], [23.4, 77.6]], area: 286, population: 2400000 },
  { id: 'patna', name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, bounds: [[25.5, 85.0], [25.7, 85.3]], area: 250, population: 2500000 },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, bounds: [[26.0, 91.6], [26.3, 91.9]], area: 216, population: 1700000 },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, bounds: [[8.4, 76.8], [8.7, 77.1]], area: 214, population: 1700000 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, bounds: [[20.1, 85.6], [20.4, 86.0]], area: 186, population: 1100000 },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, bounds: [[21.1, 81.5], [21.4, 81.8]], area: 226, population: 1600000 },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, bounds: [[26.7, 80.8], [27.0, 81.1]], area: 349, population: 3900000 },
  { id: 'panaji', name: 'Panaji', state: 'Goa', lat: 15.4909, lng: 73.8278, bounds: [[15.4, 73.7], [15.6, 73.9]], area: 76, population: 260000 },
];

// Generate realistic monsoon-influenced readings
function generateReadings() {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const isMonsoon = month >= 5 && month <= 8; // Jun-Sep
  return REGIONS.map((r) => {
    const baseRain = isMonsoon ? 15 + Math.random() * 35 : Math.random() * 8;
    const latFactor = (r.lat - 20) / 10;
    const baseMax = 32 - latFactor * 2 + (Math.random() * 4 - 2);
    const baseMin = baseMax - 8 + (Math.random() * 2 - 1);
    return {
      region: r.name,
      lat: r.lat,
      lng: r.lng,
      rainfall: Math.round(baseRain * 10) / 10,
      maxTemp: Math.round(baseMax * 10) / 10,
      minTemp: Math.round(baseMin * 10) / 10,
      timestamp: now.toISOString(),
    };
  });
}

export const CURRENT_READINGS = generateReadings();

export const PREDICTIONS: Prediction[] = [
  {
    id: 'pred-1',
    region: 'All India',
    type: 'rainfall',
    horizon: '7d',
    value: 48.2,
    unit: 'mm',
    confidence: 87,
    model: 'ClimateNet-LSTM v4.2',
    timestamp: new Date().toISOString(),
    trend: 'up',
    historicalAverage: 42.1,
    history: Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 13 + i);
      const predicted = 40 + Math.sin(i / 2) * 8 + i * 0.5;
      return {
        date: d.toISOString().slice(0, 10),
        predicted: Math.round(predicted * 10) / 10,
        actual: i < 7 ? Math.round((predicted + (Math.random() * 6 - 3)) * 10) / 10 : null,
      };
    }),
  },
  {
    id: 'pred-2',
    region: 'All India',
    type: 'temperature',
    horizon: '7d',
    value: 33.8,
    unit: '°C',
    confidence: 91,
    model: 'ClimateNet-LSTM v4.2',
    timestamp: new Date().toISOString(),
    trend: 'stable',
    historicalAverage: 34.2,
    history: Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 13 + i);
      const predicted = 33 + Math.sin(i / 3) * 2;
      return {
        date: d.toISOString().slice(0, 10),
        predicted: Math.round(predicted * 10) / 10,
        actual: i < 7 ? Math.round((predicted + (Math.random() * 2 - 1)) * 10) / 10 : null,
      };
    }),
  },
  {
    id: 'pred-3',
    region: 'Mumbai',
    type: 'rainfall',
    horizon: '24h',
    value: 62.5,
    unit: 'mm',
    confidence: 82,
    model: 'ClimateNet-LSTM v4.2',
    timestamp: new Date().toISOString(),
    trend: 'up',
    historicalAverage: 55.3,
    history: Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 13 + i);
      const predicted = 50 + Math.sin(i / 2) * 15 + i;
      return {
        date: d.toISOString().slice(0, 10),
        predicted: Math.round(predicted * 10) / 10,
        actual: i < 7 ? Math.round((predicted + (Math.random() * 10 - 5)) * 10) / 10 : null,
      };
    }),
  },
  {
    id: 'pred-4',
    region: 'Delhi NCR',
    type: 'temperature',
    horizon: '24h',
    value: 38.4,
    unit: '°C',
    confidence: 89,
    model: 'ClimateNet-LSTM v4.2',
    timestamp: new Date().toISOString(),
    trend: 'up',
    historicalAverage: 37.1,
    history: Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 13 + i);
      const predicted = 36 + Math.sin(i / 3) * 3 + i * 0.2;
      return {
        date: d.toISOString().slice(0, 10),
        predicted: Math.round(predicted * 10) / 10,
        actual: i < 7 ? Math.round((predicted + (Math.random() * 2 - 1)) * 10) / 10 : null,
      };
    }),
  },
];

export const DATASETS: Dataset[] = [
  {
    id: 'ds-1',
    name: 'IMD Gridded Rainfall',
    type: 'rainfall',
    source: 'India Meteorological Department',
    status: 'completed',
    version: '2.3.1',
    size: '4.2 GB',
    records: 2847391,
    dateRange: { start: '1901-01-01', end: '2025-06-20' },
    ingestionDate: '2025-06-21T03:14:00Z',
    description: 'High-resolution gridded daily rainfall data at 0.25° × 0.25° covering all of India from 1901 to present.',
    metadata: { resolution: '0.25°', format: 'NetCDF', variables: 'rainfall', update_freq: 'daily' },
  },
  {
    id: 'ds-2',
    name: 'IMD Temperature Grid',
    type: 'temperature',
    source: 'India Meteorological Department',
    status: 'completed',
    version: '1.8.0',
    size: '3.1 GB',
    records: 2103847,
    dateRange: { start: '1951-01-01', end: '2025-06-20' },
    ingestionDate: '2025-06-21T03:42:00Z',
    description: 'Gridded daily maximum and minimum temperature at 1° × 1° resolution.',
    metadata: { resolution: '1°', format: 'NetCDF', variables: 'tmax, tmin', update_freq: 'daily' },
  },
  {
    id: 'ds-3',
    name: 'GPM IMERG Satellite Rainfall',
    type: 'satellite',
    source: 'NASA GPM',
    status: 'processing',
    version: '06B',
    size: '8.7 GB',
    records: 5293847,
    dateRange: { start: '2000-03-01', end: '2025-06-25' },
    ingestionDate: '2025-06-25T08:00:00Z',
    description: 'Integrated Multi-satellitE Retrievals for GPM — half-hourly precipitation rate.',
    metadata: { resolution: '0.1°', format: 'HDF5', variables: 'precipitation', update_freq: '30min' },
  },
  {
    id: 'ds-4',
    name: 'MODIS Land Surface Temperature',
    type: 'land_surface',
    source: 'NASA EOSDIS',
    status: 'completed',
    version: '6.1',
    size: '12.4 GB',
    records: 8473920,
    dateRange: { start: '2000-02-24', end: '2025-06-24' },
    ingestionDate: '2025-06-24T22:10:00Z',
    description: 'Terra & Aqua MODIS LST daily daytime and nighttime at 1km resolution.',
    metadata: { resolution: '1km', format: 'HDF4', variables: 'LST_Day, LST_Night', update_freq: 'daily' },
  },
  {
    id: 'ds-5',
    name: 'GHRSST Sea Surface Temperature',
    type: 'sea_surface',
    source: 'NOAA NESDIS',
    status: 'queued',
    version: '4.2',
    size: '2.8 GB',
    records: 1847392,
    dateRange: { start: '1981-09-01', end: '2025-06-25' },
    ingestionDate: '2025-06-25T09:30:00Z',
    description: 'Group for High Resolution SST — daily blended sea surface temperature.',
    metadata: { resolution: '0.05°', format: 'NetCDF', variables: 'sst', update_freq: 'daily' },
  },
  {
    id: 'ds-6',
    name: 'India Grid Topology',
    type: 'grid',
    source: 'Internal',
    status: 'completed',
    version: '1.0.0',
    size: '12 MB',
    records: 3648,
    dateRange: { start: '1901-01-01', end: '2025-06-25' },
    ingestionDate: '2025-01-15T00:00:00Z',
    description: 'Grid cell topology and adjacency graph for the 0.25° climate grid over India.',
    metadata: { resolution: '0.25°', format: 'GeoJSON', variables: 'grid_id, neighbors', update_freq: 'static' },
  },
];

export const ALERTS: Alert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'Heavy Rainfall Warning',
    message: 'Mumbai region expected to receive >120mm rainfall in next 24h. Flood risk elevated.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    region: 'Mumbai',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: 'Heatwave Advisory',
    message: 'Delhi NCR max temperature forecast 43°C, 3°C above normal for 3+ consecutive days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    region: 'Delhi NCR',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    severity: 'warning',
    title: 'Dataset Processing Delayed',
    message: 'GPM IMERG ingestion running 45min behind schedule due to upstream API throttling.',
    timestamp: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert-4',
    severity: 'info',
    title: 'Model Retraining Scheduled',
    message: 'ClimateNet-LSTM v4.3 retraining queued for 02:00 IST tonight.',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    acknowledged: true,
  },
  {
    id: 'alert-5',
    severity: 'error',
    title: 'SST Ingestion Failed',
    message: 'GHRSST SST dataset ingestion failed — retry queued. Check connector logs.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    acknowledged: false,
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'prediction', title: 'Prediction Ready', message: '7-day rainfall forecast for All India completed (confidence 87%).', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), read: false },
  { id: 'n2', type: 'dataset', title: 'Dataset Updated', message: 'IMD Gridded Rainfall v2.3.1 ingested successfully.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), read: false },
  { id: 'n3', type: 'simulation', title: 'Simulation Completed', message: 'Scenario "Monsoon Surge +20%" finished for Mumbai region.', timestamp: new Date(Date.now() - 1000 * 60 * 38).toISOString(), read: false },
  { id: 'n4', type: 'system', title: 'System Health', message: 'GPU utilization peaked at 92% during prediction batch.', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: true },
  { id: 'n5', type: 'training', title: 'Training Progress', message: 'Model v4.3 epoch 12/20 — validation loss 0.0312.', timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(), read: true },
  { id: 'n6', type: 'error', title: 'Ingestion Error', message: 'GHRSST SST connector returned 503 — retrying with backoff.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), read: false },
];

export const SAVED_SCENARIOS: ScenarioConfig[] = [
  { id: 'sc-1', name: 'Monsoon Surge +20%', region: 'mumbai', rainfallAdjust: 20, tempAdjust: -0.5, duration: 7, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'sc-2', name: 'Heatwave +3°C', region: 'delhi', rainfallAdjust: -30, tempAdjust: 3, duration: 5, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 'sc-3', name: 'Drought -40%', region: 'bhopal', rainfallAdjust: -40, tempAdjust: 1.5, duration: 14, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
];

export function generateSimulationResult(scenario: ScenarioConfig): SimulationResult {
  const results = Array.from({ length: scenario.duration }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const baseRain = 30 + Math.sin(i / 2) * 15;
    const baseMax = 34 + Math.cos(i / 3) * 3;
    return {
      date: d.toISOString().slice(0, 10),
      rainfall: Math.max(0, Math.round((baseRain * (1 + scenario.rainfallAdjust / 100)) * 10) / 10),
      maxTemp: Math.round((baseMax + scenario.tempAdjust) * 10) / 10,
      minTemp: Math.round((baseMax + scenario.tempAdjust - 8) * 10) / 10,
    };
  });
  const avgRainfall = Math.round((results.reduce((s, r) => s + r.rainfall, 0) / results.length) * 10) / 10;
  const avgMaxTemp = Math.round((results.reduce((s, r) => s + r.maxTemp, 0) / results.length) * 10) / 10;
  const avgMinTemp = Math.round((results.reduce((s, r) => s + r.minTemp, 0) / results.length) * 10) / 10;
  return {
    scenarioId: scenario.id || 'temp',
    status: 'completed',
    progress: 100,
    results,
    summary: { avgRainfall, avgMaxTemp, avgMinTemp, deviation: Math.round(scenario.rainfallAdjust + scenario.tempAdjust * 10) / 10 },
  };
}

export const DEFAULT_USER: User = {
  id: 'u1',
  name: 'Dr. Ananya Sharma',
  email: 'ananya.sharma@imd.gov.in',
  role: 'admin',
  organization: 'India Meteorological Department',
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  units: 'metric',
  language: 'en',
  defaultMap: 'dark',
  notifications: { datasets: true, predictions: true, simulations: true, training: true, system: true },
  performance: 'balanced',
  accessibility: { reducedMotion: false, highContrast: false, largeText: false },
};

// Analytics series generators
export function generateRainfallTrend(days = 30) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - days + i + 1);
    return {
      date: d.toISOString().slice(5, 10),
      rainfall: Math.round((20 + Math.sin(i / 3) * 12 + Math.random() * 8) * 10) / 10,
      average: Math.round((22 + Math.sin(i / 3) * 8) * 10) / 10,
    };
  });
}

export function generateTempTrend(days = 30) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - days + i + 1);
    return {
      date: d.toISOString().slice(5, 10),
      maxTemp: Math.round((33 + Math.sin(i / 4) * 4 + Math.random() * 2) * 10) / 10,
      minTemp: Math.round((24 + Math.sin(i / 4) * 3 + Math.random() * 2) * 10) / 10,
      avgMax: 34.2,
      avgMin: 25.1,
    };
  });
}

export function generateMonthlyAnalysis() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((m, i) => ({
    month: m,
    rainfall: Math.round((10 + (i >= 5 && i <= 8 ? 200 + Math.sin(i) * 60 : Math.random() * 20)) * 10) / 10,
    temp: Math.round((25 + Math.sin((i - 4) / 2) * 8) * 10) / 10,
  }));
}

export function generatePredictionAccuracy() {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 29 + i);
    return {
      date: d.toISOString().slice(5, 10),
      accuracy: Math.round((85 + Math.random() * 12) * 10) / 10,
      rmse: Math.round((1.5 + Math.random() * 1.2) * 100) / 100,
    };
  });
}

export function generateRegionalComparison() {
  return REGIONS.slice(0, 8).map((r) => {
    const reading = CURRENT_READINGS.find((c) => c.region === r.name) || { rainfall: 0, maxTemp: 0 };
    return {
      region: r.name.split(' ')[0],
      rainfall: reading.rainfall,
      maxTemp: reading.maxTemp,
    };
  });
}

export function generateExtremeEvents() {
  return [
    { event: 'Heatwave', count: 14, intensity: 'Severe' },
    { event: 'Heavy Rain', count: 23, intensity: 'Very Heavy' },
    { event: 'Cyclone', count: 3, intensity: 'Category 3' },
    { event: 'Cold Wave', count: 7, intensity: 'Moderate' },
    { event: 'Drought', count: 5, intensity: 'Moderate' },
    { event: 'Flood', count: 11, intensity: 'Major' },
  ];
}

export function generateYearlyAnalysis() {
  return Array.from({ length: 10 }, (_, i) => {
    const year = 2016 + i;
    return {
      year: String(year),
      avgRainfall: Math.round((800 + Math.sin(i / 2) * 120 + Math.random() * 80) * 10) / 10,
      avgTemp: Math.round((26.5 + i * 0.15 + Math.random() * 0.5) * 10) / 10,
      extremeEvents: Math.round(40 + i * 2 + Math.random() * 10),
    };
  });
}
