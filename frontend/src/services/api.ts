import type {
  TwinState,
  Prediction,
  Dataset,
  Alert,
  Notification,
  SimulationResult,
  ScenarioConfig,
  ClimateReading,
} from '../types';
import {
  DEFAULT_TWIN_STATE,
  PREDICTIONS,
  DATASETS,
  ALERTS,
  NOTIFICATIONS,
  CURRENT_READINGS,
  generateSimulationResult,
} from '../data/mockData';

// Simulated latency
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Base URL for the FastAPI backend — ready to connect
const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? '/api/v1';

export const api = {
  base: API_BASE,

  async getTwinState(): Promise<TwinState> {
    await delay(400);
    return { ...DEFAULT_TWIN_STATE, lastUpdated: new Date().toISOString() };
  },

  async getReadings(): Promise<ClimateReading[]> {
    await delay(300);
    return CURRENT_READINGS;
  },

  async getPredictions(): Promise<Prediction[]> {
    await delay(500);
    return PREDICTIONS;
  },

  async getDatasets(): Promise<Dataset[]> {
    await delay(450);
    return DATASETS;
  },

  async getAlerts(): Promise<Alert[]> {
    await delay(300);
    return ALERTS;
  },

  async getNotifications(): Promise<Notification[]> {
    await delay(250);
    return NOTIFICATIONS;
  },

  async runSimulation(scenario: ScenarioConfig): Promise<SimulationResult> {
    await delay(1200);
    return generateSimulationResult(scenario);
  },

  async saveScenario(scenario: ScenarioConfig): Promise<ScenarioConfig> {
    await delay(300);
    return { ...scenario, id: 'sc-' + Date.now(), createdAt: new Date().toISOString() };
  },

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    await delay(600);
    if (!email || !password) throw new Error('Email and password are required');
    if (password.length < 4) throw new Error('Password must be at least 4 characters');
    const namePart = email.split('@')[0].replace(/[._]/g, ' ');
    const name = namePart.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const domain = email.split('@')[1]?.split('.')[0] ?? 'organization';
    const org = domain.charAt(0).toUpperCase() + domain.slice(1);
    const role = email.includes('admin') ? 'admin' : email.includes('view') ? 'viewer' : 'researcher';
    return {
      token: 'jwt.' + btoa(email) + '.' + Date.now(),
      user: { id: 'u-' + Date.now(), name, email, role, organization: org },
    };
  },
};

// WebSocket integration — ready to connect to FastAPI backend ws endpoint
// Falls back to a simulated event stream when no WS endpoint is configured.
type WSHandler = (event: string, data: any) => void;

class ClimateWebSocket {
  private ws: WebSocket | null = null;
  private handlers = new Set<WSHandler>();
  private simInterval: ReturnType<typeof setInterval> | null = null;
  private connected = false;

  connect(url?: string) {
    const wsUrl = url ?? (import.meta as any).env?.VITE_WS_URL;
    if (wsUrl) {
      try {
        this.ws = new WebSocket(wsUrl);
        this.ws.onopen = () => { this.connected = true; this.emit('connection', { status: 'open' }); };
        this.ws.onclose = () => { this.connected = false; this.emit('connection', { status: 'closed' }); };
        this.ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(e.data);
            this.emit(msg.event ?? 'message', msg.data ?? msg);
          } catch { /* ignore */ }
        };
        return;
      } catch {
        // fall through to simulation
      }
    }
    this.startSimulation();
  }

  private startSimulation() {
    this.emit('connection', { status: 'simulated' });
    this.simInterval = setInterval(() => {
      const events = [
        { event: 'twin_update', data: { health: 90 + Math.random() * 10, cpuUsage: 35 + Math.random() * 30, gpuUsage: 60 + Math.random() * 35, memoryUsage: 55 + Math.random() * 20 } },
        { event: 'prediction_progress', data: { progress: Math.min(100, Math.random() * 100) } },
        { event: 'notification', data: { type: 'system', title: 'Live Update', message: 'Digital Twin heartbeat received.', timestamp: new Date().toISOString() } },
      ];
      const ev = events[Math.floor(Math.random() * events.length)];
      this.emit(ev.event, ev.data);
    }, 5000);
  }

  on(handler: WSHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private emit(event: string, data: any) {
    this.handlers.forEach((h) => h(event, data));
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.simInterval) clearInterval(this.simInterval);
    if (this.ws) this.ws.close();
    this.ws = null;
    this.connected = false;
  }

  isConnected() {
    return this.connected;
  }
}

export const climateWS = new ClimateWebSocket();
