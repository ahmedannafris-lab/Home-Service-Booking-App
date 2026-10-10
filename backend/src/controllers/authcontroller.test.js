const { test } = require('node:test');
const assert = require('node:assert/strict');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { login } = require('./authcontroller');

test('login verifies credentials and selected account role', async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'test-only-secret';
  t.after(() => {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });
  let user = { _id: 'test-user', fullName: 'Test User', email: 'test@example.com', passwordHash: 'hash', role: 'customer', status: 'active' };
  let validPassword = true;
  t.mock.method(User, 'findOne', () => ({ select: async () => user }));
  t.mock.method(bcrypt, 'compare', async () => validPassword);
  const sign = t.mock.method(jwt, 'sign', () => 'test-token');
  async function attempt(role) {
    let status = 200;
    let body;
    const res = { status(code) { status = code; return this; }, json(data) { body = data; return this; } };
    await login({ body: { email: 'TEST@example.com', password: 'test-password', role } }, res);
    return { status, body };
  }
  for (const role of ['customer', 'provider', 'admin']) {
    user.role = role;
    const result = await attempt(role);
    assert.equal(result.status, 200);
    assert.equal(result.body.user.role, role);
    assert.equal(result.body.token, 'test-token');
    assert.equal('passwordHash' in result.body.user, false);
  }
  const signedBefore = sign.mock.callCount();
  user.role = 'customer';
  assert.equal((await attempt('admin')).status, 403);
  user.status = 'inactive';
  assert.equal((await attempt('customer')).status, 403);
  user.status = 'active';
  validPassword = false;
  assert.equal((await attempt('customer')).status, 401);
  user = null;
  assert.equal((await attempt('customer')).status, 401);
  assert.equal(sign.mock.callCount(), signedBefore);
});
