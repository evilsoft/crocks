const test = require('tape')
const { bindFunc } = require('../test/helpers')

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const propEq = require('./propEq')

test('propEq function', t => {
  const key = 'something'
  const val = 'thirty-six'

  const fn = bindFunc(x => propEq(x, val, key))

  t.ok(isFunction(propEq), 'is a function')

  const err = /propEq: Non-empty String or Integer required for first argument/
  t.throws(fn(undefined), err, 'throws with undefined as first argument')
  t.throws(fn(null), err, 'throws with null as first argument')
  t.throws(fn(NaN), err, 'throws with NaN as first argument')
  t.throws(fn(false), err, 'throws with false as first argument')
  t.throws(fn(true), err, 'throws with true as first argument')
  t.throws(fn(''), err, 'throws with empty string as first argument')
  t.throws(fn(1.234), err, 'throws with float as first argument')
  t.throws(fn({}), err, 'throws with object as first argument')
  t.throws(fn([]), err, 'throws with Array as first argument')
  t.throws(fn(unit), err, 'throws with Function as first argument')

  t.equals(propEq(key, val, null), false, 'returns false when target is null')
  t.equals(propEq(key, val, NaN), false, 'returns false when target is NaN')
  t.equals(propEq(key, val, undefined), false, 'returns false when target is undefined')

  t.equals(propEq(key, val, {}), false, 'returns false when value does not exist on object')
  t.equals(propEq(key, true, { [key]: false }), false, 'returns false when values are not equal')
  t.equals(propEq(key, undefined, { [key]: undefined }), false, 'returns false when undefined compared')

  t.equals(propEq(key, 42, { [key]: 42 }), true, 'returns true when value exists on object')
  t.equals(propEq(key, null, { [key]: null }), true, 'returns true when null compared')
  t.equals(propEq(key, NaN, { [key]: NaN }), true, 'returns true when NaN compared')
  t.equals(propEq(key, { a: 32 }, { [key]: { a: 32 } }), true, 'returns true when a deep matching object exists on object')

  const arr = [ 97, null, NaN, undefined, { a: [ 'string' ] } ]

  t.equals(propEq(5, val, arr), false, 'returns false when value does not exist on object')
  t.equals(propEq(0, '97', arr), false, 'returns false when values are not equal')
  t.equals(propEq(3, undefined, arr), false, 'returns false when undefined compared')

  t.equals(propEq(0, 97, arr), true, 'returns true when value exists on object')
  t.equals(propEq(1, null, arr), true, 'returns true when null compared')
  t.equals(propEq(2, NaN, arr), true, 'returns true when NaN compared')
  t.equals(propEq(4, { a: [ 'string' ] }, arr), true, 'returns true when a deep matching object exists on object')

  t.end()
})
