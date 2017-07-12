const test = require('tape')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const hasProp = require('./hasProp')

test('hasProp function', t => {
  const f = bindFunc(hasProp)

  t.ok(isFunction(hasProp), 'is a function')

  const err = /hasProp: Number or String required for first argument/
  t.throws(f(undefined, {}), err, 'throws with undefined in first argument')
  t.throws(f(null, {}), err, 'throws with null in first argument')
  t.throws(f(false, {}), err, 'throws with false in first argument')
  t.throws(f(true, {}), err, 'throws with true number in first argument')
  t.throws(f({}, {}), err, 'throws with object in first argument')
  t.throws(f([], {}), err, 'throws with array in first argument')
  t.throws(f(unit, {}), err, 'throws with function in first argument')

  const key = 'something'
  const val = 'thirty-six'
  const obj = { [key]: val }
  const arr = [ 1, 2, 3 ]

  t.equals(hasProp(key, undefined), false, 'returns false for undefined')
  t.equals(hasProp(key, null), false, 'returns false for null')
  t.equals(hasProp(key, 0), false, 'returns false for falsey number')
  t.equals(hasProp(key, 1), false, 'returns false for truthy number')
  t.equals(hasProp(key, ''), false, 'returns false for falsey string')
  t.equals(hasProp(key, 'string'), false, 'returns false for truthy string')

  t.equals(hasProp(key, obj), true, 'returns true when key exists on object')
  t.equals(hasProp(key, {}), false, 'returns false when key does not exist on object')

  t.equals(hasProp(2, arr), true, 'returns true when index exists in array')
  t.equals(hasProp('1', arr), true, 'returns true when string index exists in array')
  t.equals(hasProp(-1, arr), false, 'returns false when index does not exist in array')

  t.end()
})
