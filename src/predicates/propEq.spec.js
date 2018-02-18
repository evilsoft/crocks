const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const propEq = require('./propEq')

test('propEq function', t => {
  const f = bindFunc(propEq)
  const key = 'something'
  const val = 'thirty-six'
  const obj = { [key]: val }

  t.ok(isFunction(propEq), 'is a function')

  const err3 = /propEq: Object required for third argument/
  t.throws(f(key, val, undefined), err3, 'throws with undefined in third argument')
  t.throws(f(key, val, null), err3, 'throws with null in third argument')
  t.throws(f(key, val, false), err3, 'throws with false in third argument')
  t.throws(f(key, val, true), err3, 'throws with true number in third argument')
  t.throws(f(key, val, 5), err3, 'throws with number in third argument')
  t.throws(f(key, val, 'hello'), err3, 'throws with string in third argument')
  t.throws(f(key, val, []), err3, 'throws with array in third argument')
  t.throws(f(key, val, unit), err3, 'throws with function in third argument')

  t.equals(propEq(key, val, { [key]: undefined }), false, 'returns false when value does not exist on object')
  t.equals(propEq(key, '5', { [key]: 5 }), false, 'returns false for truthy string')
  t.equals(propEq(key, 5, { [key]: '5' }), false, 'returns false for truthy number')
  t.equals(propEq(undefined, val, {}), false, 'returns false with undefined in first argument')
  t.equals(propEq(null, val, {}), false, 'returns false with null in first argument')
  t.equals(propEq(false, val, {}), false, 'returns false with false in first argument')
  t.equals(propEq(true, val, {}), false, 'returns false with true number in first argument')
  t.equals(propEq({}, val, {}), false, 'returns false with object in first argument')
  t.equals(propEq([], val, {}), false, 'returns false with array in first argument')
  t.equals(propEq(unit, val, {}), false, 'returns false with function in first argument')

  t.equals(propEq(key, 42, { [key]: 42 }), true, 'returns true when value exists on object')
  t.equals(propEq(key, [ 1, 2, null, obj ], { [key]: [ 1, 2, null, obj ] }), true, 'returns true when a deep matching array exists on object')
  t.equals(propEq(key, obj, { [key]: obj }), true, 'returns true when a deep matching object exists on object')

  t.end()
})
