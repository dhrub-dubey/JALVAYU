import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from './store/useAppStore';
import { useSettingsEffects } from './hooks/useSettingsEffects';
import { climateWS } from './services/api';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { Timeline } from './components/layout/Timeline';
import { DashboardView } from './components/views/DashboardView';
import { PredictionView } from './components/views/PredictionView';
import { AIPredictionView } from './components/views/AIPredictionView';
import { TwinView } from './components/views/TwinView';
import { SimulatorView } from './components/views/SimulatorView';
import { ReplayView } from './components/views/ReplayView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { DatasetsView } from './components/views/DatasetsView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';
import { AuthView } from './components/views/AuthView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ViewRouter() {
  const { currentView, isAuthenticated } = useAppStore();

  if (!isAuthenticated) return <AuthView />;

  const views: Record<string, React.ReactNode> = {
    dashboard: <DashboardView />,
    prediction: <PredictionView />,
    'ai-prediction': <AIPredictionView />,
    twin: <TwinView />,
    simulator: <SimulatorView />,
    replay: <ReplayView />,
    analytics: <AnalyticsView />,
    datasets: <DatasetsView />,
    notifications: <NotificationsView />,
    settings: <SettingsView />,
    auth: <AuthView />,
  };

  return views[currentView] ?? <DashboardView />;
}

function App() {
  const { isAuthenticated, currentView, mapFullscreen } = useAppStore();
  useSettingsEffects();

  // Connect WebSocket on mount
  useEffect(() => {
    climateWS.connect();
    return () => climateWS.disconnect();
  }, []);

  // Dashboard view gets the full workspace (map + timeline); other views are scrollable panels
  const isDashboard = currentView === 'dashboard' && isAuthenticated;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col bg-surface-0 text-surface-900 overflow-hidden">
        <TopNav />
        <div className="flex-1 flex overflow-hidden">
          {isAuthenticated && !mapFullscreen && <Sidebar />}
          <main className="flex-1 flex flex-col overflow-hidden">
            <ViewRouter />
            {isDashboard && !mapFullscreen && <Timeline />}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
