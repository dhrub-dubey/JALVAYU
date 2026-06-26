import { create } from 'zustand';
import type {
  ClimateLayer,
  LayerId,
  TwinState,
  TimelineState,
  User,
  UserSettings,
  ViewId,
  Notification,
  Alert,
} from '../types';
import {
  DEFAULT_LAYERS,
  DEFAULT_TWIN_STATE,
  DEFAULT_USER,
  DEFAULT_SETTINGS,
  NOTIFICATIONS,
  ALERTS,
} from '../data/mockData';

interface AppState {
  // Navigation
  currentView: ViewId;
  setView: (v: ViewId) => void;

  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Settings
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => void;

  // Layers
  layers: ClimateLayer[];
  toggleLayer: (id: LayerId) => void;
  setLayerOpacity: (id: LayerId, opacity: number) => void;
  enableOnly: (id: LayerId) => void;

  // Twin
  twin: TwinState;
  setTwin: (patch: Partial<TwinState>) => void;

  // Timeline
  timeline: TimelineState;
  setTimeline: (patch: Partial<TimelineState>) => void;
  tickTimeline: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;

  // Alerts
  alerts: Alert[];
  acknowledgeAlert: (id: string) => void;

  // Selected region (map click)
  selectedRegionId: string | null;
  setSelectedRegion: (id: string | null) => void;

  // Map fullscreen
  mapFullscreen: boolean;
  toggleFullscreen: () => void;
}

function makeTimeline(): TimelineState {
  const now = new Date();
  const min = new Date(now);
  min.setFullYear(min.getFullYear() - 2);
  const max = new Date(now);
  max.setMonth(max.getMonth() + 1);
  return {
    currentDate: now.toISOString(),
    minDate: min.toISOString(),
    maxDate: max.toISOString(),
    isPlaying: false,
    speed: 1,
    mode: 'current',
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'dashboard',
  setView: (v) => set({ currentView: v }),

  user: DEFAULT_USER,
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, currentView: 'auth' }),

  settings: DEFAULT_SETTINGS,
  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

  layers: DEFAULT_LAYERS,
  toggleLayer: (id) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)),
    })),
  setLayerOpacity: (id, opacity) =>
    set((s) => ({
      layers: s.layers.map((l) => (l.id === id ? { ...l, opacity } : l)),
    })),
  enableOnly: (id) =>
    set((s) => ({
      layers: s.layers.map((l) => ({ ...l, enabled: l.id === id })),
    })),

  twin: DEFAULT_TWIN_STATE,
  setTwin: (patch) => set((s) => ({ twin: { ...s.twin, ...patch } })),

  timeline: makeTimeline(),
  setTimeline: (patch) => set((s) => ({ timeline: { ...s.timeline, ...patch } })),
  tickTimeline: () => {
    const t = get().timeline;
    if (!t.isPlaying) return;
    const cur = new Date(t.currentDate);
    cur.setHours(cur.getHours() + 6 * t.speed);
    const max = new Date(t.maxDate);
    if (cur > max) {
      set((s) => ({ timeline: { ...s.timeline, currentDate: t.maxDate, isPlaying: false } }));
      return;
    }
    const mode = cur < new Date() ? 'historical' : cur > new Date() ? 'forecast' : 'current';
    set((s) => ({ timeline: { ...s.timeline, currentDate: cur.toISOString(), mode } }));
  },

  notifications: NOTIFICATIONS,
  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  alerts: ALERTS,
  acknowledgeAlert: (id) =>
    set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)) })),

  selectedRegionId: null,
  setSelectedRegion: (id) => set({ selectedRegionId: id }),

  mapFullscreen: false,
  toggleFullscreen: () => set((s) => ({ mapFullscreen: !s.mapFullscreen })),
}));
