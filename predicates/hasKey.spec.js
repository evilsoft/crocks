const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const hasKey = require('./hasKey')

test('hasKey function', t => {
  const f = bindFunc(hasKey)

  t.ok(isFunction(hasKey), 'is a function')

  t.throws(f(undefined, {}), TypeError, 'throws with undefined in first argument')
  t.throws(f(null, {}), TypeError, 'throws with null in first argument')
  t.throws(f(false, {}), TypeError, 'throws with false in first argument')
  t.throws(f(true, {}), TypeError, 'throws with true number in first argument')
  t.throws(f({}, {}), TypeError, 'throws with object in first argument')
  t.throws(f([], {}), TypeError, 'throws with array in first argument')
  t.throws(f(noop, {}), TypeError, 'throws with function in first argument')

  const key = 'something'
  const val = 'thirty-six'
  const obj = { [key]: val }
  const arr = [ 1, 2, 3 ]

  t.equals(hasKey(key, undefined), false, 'returns false for undefined')
  t.equals(hasKey(key, null), false, 'returns false for null')
  t.equals(hasKey(key, 0), false, 'returns false for falsey number')
  t.equals(hasKey(key, 1), false, 'returns false for truthy number')
  t.equals(hasKey(key, ''), false, 'returns false for falsey string')
  t.equals(hasKey(key, 'string'), false, 'returns false for truthy string')

  t.equals(hasKey(key, obj), true, 'returns true when key exists on object')
  t.equals(hasKey(key, {}), false, 'returns false when key does not exist on object')

  t.equals(hasKey(2, arr), true, 'returns true when index exists in array')
  t.equals(hasKey("1", arr), true, 'returns true when string index exists in array')
  t.equals(hasKey(-1, arr), false, 'returns false when index does not exist in array')

  t.end()
})
