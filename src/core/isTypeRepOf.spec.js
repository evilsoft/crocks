const test = require('tape')

const isFunction = require('./isFunction')
const unit = require('./_unit')

const isTypeRepOf = require('./isTypeRepOf')

test('isTypeRepOf internal', t => {
  t.ok(isFunction(isTypeRepOf), 'is a function')

  const fn =
    x => isTypeRepOf(String, x)

  t.notOk(fn(undefined), 'returns false for undefined value')
  t.notOk(fn(null), 'returns false for null value')
  t.notOk(fn(0), 'returns false for falsey number value')
  t.notOk(fn(1), 'returns false for truthy number value')
  t.notOk(fn(''), 'returns false for falsey string value')
  t.notOk(fn('string'), 'returns false for truthy string value')
  t.notOk(fn(false), 'returns false for false boolean value')
  t.notOk(fn(true), 'returns false for true boolean value')
  t.notOk(fn(unit), 'returns false for a function')
  t.notOk(fn(Array), 'returns false for different constructor')

  t.ok(fn(String), 'returns true for same constructor')

  t.end()
})
