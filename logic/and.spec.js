const test = require('tape')
const helpers = require('../test/helpers')

const isFunction = require('../predicates/isFunction')

const bindFunc = helpers.bindFunc
const unit = require('../helpers/unit')

const Pred = require('../crocks/Pred')

const and = require('./and')

test('and logic function', t => {
  const f = bindFunc(and)

  t.ok(isFunction(and), 'is a function')

  t.throws(f(undefined, unit), 'throws with undefined in first argument')
  t.throws(f(null, unit), 'throws with null in first argument')
  t.throws(f(0, unit), 'throws with falsey number in first argument')
  t.throws(f(1, unit), 'throws with truthy number in first argument')
  t.throws(f('', unit), 'throws with falsey string in first argument')
  t.throws(f('string', unit), 'throws with truthy string in first argument')
  t.throws(f(false, unit), 'throws with false in first argument')
  t.throws(f(true, unit), 'throws with true in first argument')
  t.throws(f({}, unit), 'throws with an object in first argument')
  t.throws(f([], unit), 'throws with an array in first argument')

  t.throws(f(unit, undefined), 'throws with undefined in second argument')
  t.throws(f(unit, null), 'throws with null in second argument')
  t.throws(f(unit, 0), 'throws with falsey number in second argument')
  t.throws(f(unit, 1), 'throws with truthy number in second argument')
  t.throws(f(unit, ''), 'throws with falsey string in second argument')
  t.throws(f(unit, 'string'), 'throws with truthy string in second argument')
  t.throws(f(unit, false), 'throws with false in second argument')
  t.throws(f(unit, true), 'throws with true in second argument')
  t.throws(f(unit, {}), 'throws with an object in second argument')
  t.throws(f(unit, []), 'throws with an array in second argument')

  t.end()
})

test('and with predicate functions', t => {
  const f = x => x < 10
  const g = x => (x % 2) === 0

  const fn = and(f, g)

  t.ok(isFunction(fn), 'returns a function')

  t.equals(fn(8), true, 'returns true when both functions are true')
  t.equals(fn(7), false, 'returns false when first is true and second is false')
  t.equals(fn(20), false, 'returns false when first is false and second is true')
  t.equals(fn(23), false, 'returns false when first is false and second is false')

  t.end()
})

test('and with Pred in first and function in second', t => {
  const pred = Pred(x => x < 10)
  const f = x => (x % 2) === 0

  const fn = and(pred, f)

  t.ok(isFunction(fn), 'returns a function')

  t.equals(fn(8), true, 'returns true when both Pred and function evaluate to true')
  t.equals(fn(7), false, 'returns false when Pred is true and function is false')
  t.equals(fn(20), false, 'returns false when Pred is false and function is true')
  t.equals(fn(23), false, 'returns false when Pred is false and function is false')

  t.end()
})

test('and with function in first and Pred in second', t => {
  const pred = Pred(x => x < 10)
  const f = x => (x % 2) === 0

  const fn = and(f, pred)

  t.ok(isFunction(fn), 'returns a function')

  t.equals(fn(8), true, 'returns true when both function and Pred evaluate to true')
  t.equals(fn(7), false, 'returns false when function is true and Pred is false')
  t.equals(fn(20), false, 'returns false when function is false and Pred is true')
  t.equals(fn(23), false, 'returns false when function is false and Pred is false')

  t.end()
})

test('and with Preds', t => {
  const f = Pred(x => x < 10)
  const g = Pred(x => (x % 2) === 0)

  const fn = and(f, g)

  t.ok(isFunction(fn), 'returns a function')

  t.equals(fn(8), true, 'returns true when both Preds evaluate to true')
  t.equals(fn(7), false, 'returns false when first is true and second is false')
  t.equals(fn(20), false, 'returns false when first is false and second is true')
  t.equals(fn(23), false, 'returns false when first is false and second is false')

  t.end()
})
