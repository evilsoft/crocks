const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Pred = require('../Pred')
const isFunction = require('../core/isFunction')

const identity = x => x

const not = require('./not')

test('not logic function', t => {
  const f = bindFunc(not)

  t.ok(isFunction(not), 'is a function')

  const err = /not: Pred or predicate function required for first argument/
  t.throws(f(undefined, true), err, 'throws with undefined in first argument')
  t.throws(f(null, true), err, 'throws with null in first argument')
  t.throws(f(0, true), err, 'throws with falsey number in first argument')
  t.throws(f(1, true), err, 'throws with truthy number in first argument')
  t.throws(f('', true), err, 'throws with falsey string in first argument')
  t.throws(f('string', true), err, 'throws with truthy string in first argument')
  t.throws(f(false, true), err, 'throws with false in first argument')
  t.throws(f(true, true), err, 'throws with true in first argument')
  t.throws(f({}, true), err, 'throws with an object in first argument')
  t.throws(f([], true), err, 'throws with an array in first argument')

  const func = x => !!x
  const pred = Pred(func)

  t.doesNotThrow(f(func, true), 'allows a predicate function in first argument')
  t.doesNotThrow(f(pred, true), 'allows a Pred in first argument')

  t.end()
})

test('not with predicate function', t => {
  const f = not(identity)

  t.equals(f(undefined), true, 'returns true with undefined')
  t.equals(f(null), true, 'returns true with null')
  t.equals(f(0), true, 'returns true with falsey number')
  t.equals(f(1), false, 'returns false with truthy number')
  t.equals(f(''), true, 'returns true with falsey string')
  t.equals(f('string'), false, 'returns false with truthy string')
  t.equals(f(false), true, 'returns true with false')
  t.equals(f(true), false, 'returns false with true')
  t.equals(f({}), false, 'returns false with an object')
  t.equals(f([]), false, 'returns false with an array')

  t.end()
})

test('not with Pred', t => {
  const f = not(Pred(x => !!x))

  t.equals(f(undefined), true, 'returns true with undefined')
  t.equals(f(null), true, 'returns true with null')
  t.equals(f(0), true, 'returns true with falsey number')
  t.equals(f(1), false, 'returns false with truthy number')
  t.equals(f(''), true, 'returns true with falsey string')
  t.equals(f('string'), false, 'returns false with truthy string')
  t.equals(f(false), true, 'returns true with false')
  t.equals(f(true), false, 'returns false with true')
  t.equals(f({}), false, 'returns false with an object')
  t.equals(f([]), false, 'returns false with an array')

  t.end()
})
