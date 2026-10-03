import type { ScreenId } from './types';

export const ROOT_TABS: ScreenId[] = ['home', 'bookings', 'messages', 'history', 'profile'];

export function nextNavigationHistory(history: ScreenId[], current: ScreenId, target: ScreenId): ScreenId[] {
  // Main tabs start a fresh path; completed checkout cannot be revisited with Back.
  if (target === 'home') return [];
  if (ROOT_TABS.includes(target) || target === 'payment-success') return ['home'];
  if (current === target) return history;
  const previous = history.filter((screen) => screen !== 'splash' && screen !== 'payment-success');
  return current === 'splash' || current === 'payment-success' ? previous : [...previous, current];
}
