import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const UIContext = createContext(null);

/** Global overlays: placement test, 4-step lessons, onboarding, word-insight modal, mobile drawer. */
export function UIProvider({ children }) {
  const [placementOpen, setPlacementOpen] = useState(false);
  const [lessonsOpen, setLessonsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [insightId, setInsightId] = useState(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // First visit -> show onboarding after a short delay.
  useEffect(() => {
    if (localStorage.getItem('sentruc_onboarded')) return undefined;
    const id = setTimeout(() => setOnboardingOpen(true), 150);
    return () => clearTimeout(id);
  }, []);

  const closeOnboarding = useCallback(() => {
    localStorage.setItem('sentruc_onboarded', 'true');
    setOnboardingOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      placementOpen,
      openPlacement: () => setPlacementOpen(true),
      closePlacement: () => setPlacementOpen(false),
      lessonsOpen,
      openLessons: () => setLessonsOpen(true),
      closeLessons: () => setLessonsOpen(false),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      insightId,
      openInsight: (id) => setInsightId(id),
      closeInsight: () => setInsightId(null),
      onboardingOpen,
      openOnboarding: () => setOnboardingOpen(true),
      closeOnboarding
    }),
    [placementOpen, lessonsOpen, drawerOpen, insightId, onboardingOpen, closeOnboarding]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
