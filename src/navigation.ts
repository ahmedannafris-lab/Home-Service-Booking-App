import type { ScreenId } from './types';

export const ROOT_TABS: ScreenId[] = ['home', 'bookings', 'messages', 'history', 'profile'];
export const ONBOARDING_SEQUENCE: ScreenId[] = ['onboarding-1', 'onboarding-2', 'onboarding-3'];

export function getNextOnboardingScreen(current: ScreenId): ScreenId | null {
  const currentIndex = ONBOARDING_SEQUENCE.indexOf(current as typeof ONBOARDING_SEQUENCE[number]);
  if (currentIndex === -1) return null;
  return ONBOARDING_SEQUENCE[currentIndex + 1] ?? null;
}

export function getPreviousOnboardingScreen(current: ScreenId): ScreenId | null {
  const currentIndex = ONBOARDING_SEQUENCE.indexOf(current as typeof ONBOARDING_SEQUENCE[number]);
  if (currentIndex === -1) return null;
  return ONBOARDING_SEQUENCE[currentIndex - 1] ?? null;
}

export function nextNavigationHistory(history: ScreenId[], current: ScreenId, target: ScreenId): ScreenId[] {
  // Main tabs start a fresh path; completed checkout cannot be revisited with Back.
  if (target === 'home') return [];
  if (ROOT_TABS.includes(target) || target === 'payment-success') return ['home'];
  if (current === target) return history;
  const previous = history.filter((screen) => screen !== 'splash' && screen !== 'payment-success');
  return current === 'splash' || current === 'payment-success' ? previous : [...previous, current];
}
