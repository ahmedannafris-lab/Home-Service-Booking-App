import assert from 'node:assert/strict';
import { test } from 'node:test';
import { nextNavigationHistory } from './navigation';

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
