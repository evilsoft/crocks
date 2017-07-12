const test = require('tape')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const Pred = require('../core/Pred')
const identity = require('../core/identity')
const isFunction = require('../core/isFunction')

const not = require('./not')

test('not logic function', t => {
  const f = bindFunc(not)

  t.ok(isFunction(not), 'is a function')

  t.throws(f(undefined, true), 'throws with undefined in first argument')
  t.throws(f(null, true), 'throws with null in first argument')
  t.throws(f(0, true), 'throws with falsey number in first argument')
  t.throws(f(1, true), 'throws with truthy number in first argument')
  t.throws(f('', true), 'throws with falsey string in first argument')
  t.throws(f('string', true), 'throws with truthy string in first argument')
  t.throws(f(false, true), 'throws with false in first argument')
  t.throws(f(true, true), 'throws with true in first argument')
  t.throws(f({}, true), 'throws with an object in first argument')
  t.throws(f([], true), 'throws with an array in first argument')

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
