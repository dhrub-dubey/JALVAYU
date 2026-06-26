// Core domain types for the Climate Digital Twin platform

export type LayerId =
  | 'rainfall'
  | 'max_temp'
  | 'min_temp'
  | 'satellite_rainfall'
  | 'land_surface_temp'
  | 'sea_surface_temp'
  | 'boundaries'
  | 'grid_cells'
  | 'prediction'
  | 'simulation';

export interface ClimateLayer {
  id: LayerId;
  name: string;
  description: string;
  unit: string;
  enabled: boolean;
  opacity: number;
  colorScale: string[];
  icon: string;
}

export type TwinStatus = 'idle' | 'running' | 'training' | 'predicting' | 'simulating' | 'error';
export type SimulationStatus = 'idle' | 'running' | 'completed' | 'failed';
export type PredictionStatus = 'idle' | 'processing' | 'ready' | 'stale';
export type ProcessingStatus = 'queued' | 'processing' | 'completed' | 'failed';
export type TrainingStatus = 'idle' | 'training' | 'completed' | 'failed';

export interface TwinState {
  status: TwinStatus;
  health: number; // 0-100
  simulationStatus: SimulationStatus;
  lastUpdated: string;
  currentDataset: string;
  currentModel: string;
  modelVersion: string;
  predictionStatus: PredictionStatus;
  processingStatus: ProcessingStatus;
  trainingStatus: TrainingStatus;
  trainingProgress: number; // 0-100
  processingProgress: number; // 0-100
  predictionProgress: number; // 0-100
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  activeJobs: number;
}

export interface ClimateReading {
  region: string;
  lat: number;
  lng: number;
  rainfall: number; // mm
  maxTemp: number; // °C
  minTemp: number; // °C
  timestamp: string;
}

export interface Prediction {
  id: string;
  region: string;
  type: 'rainfall' | 'temperature';
  horizon: string; // e.g. "24h", "7d", "30d"
  value: number;
  unit: string;
  confidence: number; // 0-100
  model: string;
  timestamp: string;
  trend: 'up' | 'down' | 'stable';
  historicalAverage: number;
  history: { date: string; predicted: number; actual: number | null }[];
}

export interface ScenarioConfig {
  id?: string;
  name: string;
  region: string;
  rainfallAdjust: number; // % adjustment
  tempAdjust: number; // °C adjustment
  duration: number; // days
  createdAt?: string;
}

export interface SimulationResult {
  scenarioId: string;
  status: SimulationStatus;
  progress: number;
  results: {
    date: string;
    rainfall: number;
    maxTemp: number;
    minTemp: number;
  }[];
  summary: {
    avgRainfall: number;
    avgMaxTemp: number;
    avgMinTemp: number;
    deviation: number;
  };
}

export interface Dataset {
  id: string;
  name: string;
  type: 'rainfall' | 'temperature' | 'satellite' | 'land_surface' | 'sea_surface' | 'grid';
  source: string;
  status: ProcessingStatus;
  version: string;
  size: string;
  records: number;
  dateRange: { start: string; end: string };
  ingestionDate: string;
  description: string;
  metadata: Record<string, string>;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  region?: string;
  acknowledged: boolean;
}

export interface Notification {
  id: string;
  type: 'dataset' | 'prediction' | 'simulation' | 'training' | 'system' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Region {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  bounds: [[number, number], [number, number]];
  area: number; // km²
  population: number;
}

export interface TimelineState {
  currentDate: string;
  minDate: string;
  maxDate: string;
  isPlaying: boolean;
  speed: number; // 1x, 2x, 4x
  mode: 'historical' | 'current' | 'forecast';
}

export interface AnalyticsSeries {
  label: string;
  data: { date: string; value: number; [key: string]: any }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'researcher' | 'analyst' | 'viewer';
  organization: string;
  avatar?: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  units: 'metric' | 'imperial';
  language: 'en' | 'hi' | 'bn' | 'ta' | 'te';
  defaultMap: 'terrain' | 'satellite' | 'dark' | 'light';
  notifications: {
    datasets: boolean;
    predictions: boolean;
    simulations: boolean;
    training: boolean;
    system: boolean;
  };
  performance: 'high' | 'balanced' | 'low';
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}

export type ViewId =
  | 'dashboard'
  | 'prediction'
  | 'simulator'
  | 'replay'
  | 'analytics'
  | 'datasets'
  | 'ai-prediction'
  | 'twin'
  | 'notifications'
  | 'settings'
  | 'auth';
