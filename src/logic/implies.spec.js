const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Pred = require('../Pred')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const implies = require('./implies')

test('implies logic function', t => {
  const f = bindFunc(implies)

  t.ok(isFunction(implies), 'is a function')

  const err = /implies: Preds or predicate functions required for first two arguments/
  t.throws(f(undefined, unit), err, 'throws with undefined in first argument')
  t.throws(f(null, unit), err, 'throws with null in first argument')
  t.throws(f(0, unit), err, 'throws with falsey number in first argument')
  t.throws(f(1, unit), err, 'throws with truthy number in first argument')
  t.throws(f('', unit), err, 'throws with falsey string in first argument')
  t.throws(f('string', unit), err, 'throws with truthy string in first argument')
  t.throws(f(false, unit), err, 'throws with false in first argument')
  t.throws(f(true, unit), err, 'throws with true in first argument')
  t.throws(f({}, unit), err, 'throws with an object in first argument')
  t.throws(f([], unit), err, 'throws with an array in first argument')

  t.throws(f(unit, undefined), err, 'throws with undefined in second argument')
  t.throws(f(unit, null), err, 'throws with null in second argument')
  t.throws(f(unit, 0), err, 'throws with falsey number in second argument')
  t.throws(f(unit, 1), err, 'throws with truthy number in second argument')
  t.throws(f(unit, ''), err, 'throws with falsey string in second argument')
  t.throws(f(unit, 'string'), err, 'throws with truthy string in second argument')
  t.throws(f(unit, false), err, 'throws with false in second argument')
  t.throws(f(unit, true), err, 'throws with true in second argument')
  t.throws(f(unit, {}), err, 'throws with an object in second argument')
  t.throws(f(unit, []), err, 'throws with an array in second argument')

  t.end()
})

test('implies with predicate functions', t => {
  const p = x => x < 10
  const q = x => x % 2 === 0

  const fn = implies(p, q)

  t.ok(isFunction(fn), 'returns a function')

  t.equals(fn(8), true, 'returns true when both functions are true')
  t.equals(fn(7), false, 'returns false when first is true and second is false')
  t.equals(fn(20), true, 'returns true when first is false and second is true')
  t.equals(fn(23), true, 'returns true when both first and second are false')

  t.end()
})

test('implies with Pred in first and function in second', t => {
  const p = Pred(x => x < 10)
  const q = x => x % 2 === 0

  const fn = implies(p, q)

  t.ok(isFunction(fn), 'returns a function')

  t.equals(fn(8), true, 'returns true when both Pred and function evaluate to true')
  t.equals(fn(7), false, 'returns false when Pred is true and function is false')
  t.equals(fn(20), true, 'returns true when Pred is false and function is true')
  t.equals(fn(23), true, 'returns true when both Pred and function evaluate to false')

  t.end()
})

test('implies with function in first and Pred in second', t => {
  const p = x => x % 2 === 0
  const q = Pred(x => x < 10)

  const fn = implies(p, q)

  t.ok(isFunction(fn), 'returns a function')

  t.equals(fn(8), true, 'returns true when both function and Pred evaluate to true')
  t.equals(fn(20), false, 'returns false when function is true and Pred is false')
  t.equals(fn(7), true, 'returns true when function is false and Pred is true')
  t.equals(fn(23), true, 'returns true when both function and Pred evaluate to false')

  t.end()
})

test('implies with Preds', t => {
  const p = Pred(x => x < 10)
  const q = Pred(x => x % 2 === 0)

  const fn = implies(p, q)

  t.ok(isFunction(fn), 'returns a function')

  t.equals(fn(8), true, 'returns true when both Preds evaluate to true')
  t.equals(fn(7), false, 'returns false when first is true and second is false')
  t.equals(fn(20), true, 'returns true when first is false and second is true')
  t.equals(fn(23), true, 'returns true when both first and second evaluate to false')

  t.end()
})
