import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useSettingsEffects() {
  const settings = useAppStore((s) => s.settings);

  useEffect(() => {
    const root = document.documentElement;

    // Theme
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }

    // Accessibility
    root.classList.toggle('reduce-motion', settings.accessibility.reducedMotion);
    root.classList.toggle('high-contrast', settings.accessibility.highContrast);
    root.classList.toggle('large-text', settings.accessibility.largeText);

    // Units as data attribute (consumed by components if needed)
    root.dataset.units = settings.units;
    root.dataset.lang = settings.language;
    root.dataset.perf = settings.performance;
  }, [settings]);
}
