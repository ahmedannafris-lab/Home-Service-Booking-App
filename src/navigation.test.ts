import assert from 'node:assert/strict';
import { test } from 'node:test';
import { nextNavigationHistory, getNextOnboardingScreen, getPreviousOnboardingScreen } from './navigation';

test('onboarding screens move forward and backward in order', () => {
  assert.equal(getNextOnboardingScreen('onboarding-1'), 'onboarding-2');
  assert.equal(getNextOnboardingScreen('onboarding-2'), 'onboarding-3');
  assert.equal(getNextOnboardingScreen('onboarding-3'), null);
  assert.equal(getPreviousOnboardingScreen('onboarding-2'), 'onboarding-1');
  assert.equal(getPreviousOnboardingScreen('onboarding-3'), 'onboarding-2');
  assert.equal(getPreviousOnboardingScreen('onboarding-1'), null);
});

test('returning home clears completed checkout history', () => {
  assert.deepEqual(nextNavigationHistory(['home', 'service-detail', 'payment'], 'payment-success', 'home'), []);
});
test('view booking after confirmation backs to home', () => {
  assert.deepEqual(nextNavigationHistory(['home', 'payment'], 'payment-success', 'bookings'), ['home']);
});
test('switching main tabs does not accumulate checkout or tab history', () => {
  assert.deepEqual(nextNavigationHistory(['home', 'payment-success', 'bookings'], 'messages', 'profile'), ['home']);
});
test('service detail retains its category back path', () => {
  assert.deepEqual(nextNavigationHistory(['home', 'categories'], 'category-detail', 'service-detail'), ['home', 'categories', 'category-detail']);
});
test('confirmation removes the payment back path', () => {
  assert.deepEqual(nextNavigationHistory(['home', 'service-detail'], 'payment', 'payment-success'), ['home']);
});
