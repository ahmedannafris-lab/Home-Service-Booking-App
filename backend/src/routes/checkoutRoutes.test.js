const { test } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

// Exercise the actual HTTP route without Atlas or real user credentials.
const customerId = new mongoose.Types.ObjectId();
const bookingId = new mongoose.Types.ObjectId();
const authPath = require.resolve('../middleware/authMiddleware');
require.cache[authPath] = {
  id: authPath,
  filename: authPath,
  loaded: true,
  exports: (req, res, next) => {
    if (req.headers.authorization !== 'Bearer test-token') {
      return res.status(401).json({ message: 'Login required' });
    }
    req.user = { _id: customerId, role: 'customer' };
    next();
  },
};
const checkoutRoutes = require('./checkoutRoutes');
const Payment = mongoose.model('Payment');

test('payment history CRUD is owner-scoped and protects completed records', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/api', checkoutRoutes);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const id = String(new mongoose.Types.ObjectId());
  const original = { _id: id, customerId, bookingId, method: 'cash', status: 'due', demo: true, amountMinor: 350000 };
  let record = { ...original };
  let race = false;
  const owned = query => assert.equal(String(query.customerId), String(customerId));
  t.mock.method(Payment, 'find', query => {
    owned(query);
    return { sort: () => ({ populate: async () => record ? [record] : [] }) };
  });
  t.mock.method(Payment, 'findOne', query => {
    owned(query);
    const result = Promise.resolve(record);
    result.populate = async () => record;
    return result;
  });
  t.mock.method(Booking, 'findOne', async query => { owned(query); return { status: 'scheduled' }; });
  t.mock.method(Payment, 'findOneAndUpdate', async (query, update) => {
    owned(query); assert.equal(query.status, 'due'); assert.equal(query.demo, true);
    if (race) return null;
    record = { ...record, ...update.$set };
    for (const key of Object.keys(update.$unset)) delete record[key];
    return record;
  });
  t.mock.method(Payment, 'findOneAndDelete', async query => {
    owned(query); assert.equal(query.status, 'due'); assert.equal(query.demo, true);
    if (race) return null;
    const removed = record; record = null; return removed;
  });
  async function call(method, suffix = `/${id}`, body, authenticated = true) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/payments${suffix}`, {
      method, headers: { 'Content-Type': 'application/json', ...(authenticated ? { Authorization: 'Bearer test-token' } : {}) },
      ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {}),
    });
    return { status: response.status, body: await response.json() };
  }
  await t.test('all history endpoints require authentication', async () => {
    for (const method of ['GET', 'PATCH', 'DELETE']) assert.equal((await call(method, `/${id}`, undefined, false)).status, 401);
    assert.equal((await call('GET', '', undefined, false)).status, 401);
  });
  await t.test('reads the owner list and individual receipt', async () => {
    assert.equal((await call('GET', '')).body.payments.length, 1);
    assert.equal((await call('GET')).body.payment._id, id);
  });
  await t.test('rejects invalid IDs and missing or unowned payments', async () => {
    for (const method of ['GET', 'PATCH', 'DELETE']) assert.equal((await call(method, '/invalid')).status, 400);
    record = null;
    for (const method of ['GET', 'PATCH', 'DELETE']) assert.equal((await call(method, `/${id}`, { method: 'cash' })).status, 404);
    record = { ...original };
  });
  await t.test('validates update metadata', async () => {
    for (const body of [{ method: 'invalid' }, { method: 'card' }, { method: 'online', onlineProvider: 'genie', mobileNumber: '123' }]) {
      assert.equal((await call('PATCH', `/${id}`, body)).status, 400);
    }
  });
  await t.test('converts due cash into demo paid without accepting an amount override', async () => {
    const result = await call('PATCH', `/${id}`, { method: 'card', cardLastFour: '4242', amountMinor: 1, cvv: '123' });
    assert.equal(result.status, 200);
    assert.equal(result.body.payment.status, 'demo_paid');
    assert.equal(result.body.payment.amountMinor, 350000);
    assert.equal('cvv' in result.body.payment, false);
  });
  await t.test('completed payments cannot be edited or deleted', async () => {
    assert.equal((await call('PATCH', `/${id}`, { method: 'cash' })).status, 409);
    assert.equal((await call('DELETE')).status, 409);
  });
  await t.test('wallet update stores only masked metadata and preserves the database amount', async () => {
    record = { ...original, cardLastFour: '4242' };
    const result = await call('PATCH', `/${id}`, { method: 'online', onlineProvider: 'genie', mobileNumber: '+94771234567' });
    assert.equal(result.status, 200);
    assert.equal(result.body.payment.mobileLastFour, '4567');
    assert.equal(result.body.payment.amountMinor, original.amountMinor);
    assert.equal('cardLastFour' in result.body.payment, false);
    assert.equal('mobileNumber' in result.body.payment, false);
  });
  await t.test('guards concurrent payment updates and deletions', async () => {
    record = { ...original }; race = true;
    assert.equal((await call('PATCH', `/${id}`, { method: 'cash' })).status, 409);
    assert.equal((await call('DELETE')).status, 409);
    race = false;
  });
  await t.test('deletes a pending record and keeps other payment state untouched', async () => {
    assert.equal((await call('DELETE')).status, 200);
    assert.equal(record, null);
    assert.equal((await call('GET', '')).body.payments.length, 0);
  });
});

test('demo checkout HTTP integration', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/api', checkoutRoutes);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const endpoint = `http://127.0.0.1:${server.address().port}/api/payments`;
  async function pay(body, authenticated = true) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(authenticated ? { Authorization: 'Bearer test-token' } : {}) },
      body: JSON.stringify(body),
    });
    return { status: response.status, body: await response.json() };
  }
  const request = { bookingId: String(bookingId), method: 'card', cardLastFour: '4242' };
  const booking = { _id: bookingId, customerId, status: 'scheduled', amountMinor: 350000, currency: 'LKR' };
  let recorded;
  let available = booking;
  t.mock.method(Booking, 'findOne', async query => {
    assert.equal(String(query.customerId), String(customerId));
    return available;
  });
  t.mock.method(Payment, 'findOneAndUpdate', async (query, update) => {
    assert.equal(String(query.bookingId), String(bookingId));
    recorded ||= { _id: String(new mongoose.Types.ObjectId()), bookingId: String(bookingId), ...update.$setOnInsert };
    return recorded;
  });

  await t.test('requires login', async () => {
    assert.equal((await pay(request, false)).status, 401);
  });
  await t.test('validates booking, method and card metadata', async () => {
    for (const invalid of [
      { ...request, bookingId: 'preview-booking' },
      { ...request, method: 'unknown' },
      { ...request, cardLastFour: undefined },
      { ...request, cardLastFour: '4242424242424242' },
    ]) assert.equal((await pay(invalid)).status, 400);
  });
  await t.test('rejects missing or unowned booking', async () => {
    available = null;
    assert.equal((await pay(request)).status, 404);
    available = booking;
  });
  await t.test('rejects cancelled bookings', async () => {
    available = { ...booking, status: 'cancelled' };
    assert.equal((await pay(request)).status, 409);
    available = booking;
  });
  await t.test('records last four digits and uses database amount', async () => {
    const result = await pay({ ...request, amountMinor: 1, cardNumber: 'not-stored', cvv: '123' });
    assert.equal(result.status, 200);
    assert.equal(result.body.success, true);
    assert.equal(result.body.payment.status, 'demo_paid');
    assert.equal(result.body.payment.demo, true);
    assert.equal(result.body.payment.amountMinor, 350000);
    assert.equal(result.body.payment.cardLastFour, '4242');
    assert.equal('cardNumber' in result.body.payment, false);
    assert.equal('cvv' in result.body.payment, false);
  });
  await t.test('retry returns the existing payment', async () => {
    assert.equal((await pay(request)).body.payment._id, recorded._id);
  });
  await t.test('rejects switching card or method after payment', async () => {
    assert.equal((await pay({ ...request, cardLastFour: '1234' })).status, 409);
    assert.equal((await pay({ ...request, method: 'cash' })).status, 409);
  });
  await t.test('cash stays due and does not save card metadata', async () => {
    recorded = undefined;
    const result = await pay({ ...request, method: 'cash' });
    assert.equal(result.status, 200);
    assert.equal(result.body.payment.status, 'due');
    assert.equal('cardLastFour' in result.body.payment, false);
  });
  await t.test('online checkout remains simulated', async () => {
    recorded = undefined;
    const result = await pay({ ...request, method: 'online', onlineProvider: 'genie', mobileNumber: '+94771234567' });
    assert.equal(result.status, 200);
    assert.equal(result.body.payment.status, 'demo_paid');
    assert.equal(result.body.payment.onlineProvider, 'genie');
    assert.equal(result.body.payment.mobileLastFour, '4567');
    assert.equal('mobileNumber' in result.body.payment, false);
  });
  await t.test('validates wallet provider and phone', async () => {
    for (const details of [
      {},
      {onlineProvider: 'unknown'},
      {onlineProvider: 'genie'},
      {onlineProvider: 'ezcash', mobileNumber: '+94123'},
    ]) assert.equal((await pay({ ...request, method: 'online', ...details })).status, 400);
  });
  await t.test('does not switch wallet after payment', async () => {
    assert.equal((await pay({ ...request, method: 'online', onlineProvider: 'ezcash', mobileNumber: '+94771234567' })).status, 409);
  });
  await t.test('records eZ Cash and bank demo payments', async () => {
    for (const provider of ['ezcash', 'bank']) {
      recorded = undefined;
      const result = await pay({ ...request, method: 'online', onlineProvider: provider, ...(provider !== 'bank' ? {mobileNumber: '+94771234567'} : {}) });
      assert.equal(result.status, 200);
      assert.equal(result.body.payment.onlineProvider, provider);
      assert.equal(result.body.payment.amountMinor, 350000);
      assert.equal(result.body.payment.demo, true);
      if (provider === 'bank') assert.equal('mobileLastFour' in result.body.payment, false);
    }
  });
});
