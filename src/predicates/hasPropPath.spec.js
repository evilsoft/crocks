const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const hasPropPath = require('./hasPropPath')

test('hasPropPath function', t => {
  const f = bindFunc(hasPropPath)

  t.ok(isFunction(hasPropPath), 'is a function')

  const err = /hasPropPath: Array of Non-empty Strings or Integers required for first argument/
  t.throws(f(undefined, {}), err, 'throws with undefined in first argument')
  t.throws(f(null, {}), err, 'throws with null in first argument')
  t.throws(f(NaN, {}), err, 'throws with NaN in first argument')
  t.throws(f(false, {}), err, 'throws with false in first argument')
  t.throws(f(true, {}), err, 'throws with true number in first argument')
  t.throws(f('', {}), err, 'throws with falsey string in first argument')
  t.throws(f('string', {}), err, 'throws with truthy string in first argument')
  t.throws(f(0, {}), err, 'throws with falsey number in first argument')
  t.throws(f(1, {}), err, 'throws with truthy number in first argument')
  t.throws(f({}, {}), err, 'throws with object in first argument')
  t.throws(f(unit, {}), err, 'throws with function in first argument')

  t.throws(f([ undefined ], {}), err, 'throws with array of undefined in first argument')
  t.throws(f([ null ], {}), err, 'throws with array of null in first argument')
  t.throws(f([ NaN ], {}), err, 'throws with array of NaN in first argument')
  t.throws(f([ false ], {}), err, 'throws with array of false in first argument')
  t.throws(f([ true ], {}), err, 'throws with array of true number in first argument')
  t.throws(f([ {} ], {}), err, 'throws with array of object in first argument')
  t.throws(f([ unit ], {}), err, 'throws with array of function in first argument')
  t.throws(f([ '' ], {}), err, 'throws with array of empty string in first argument')
  t.throws(f([ 1.265 ], {}), err, 'throws with array of float in first argument')

  const path = [ 'a', 'b' ]
  const arr = [ [ 1, 2, 3 ], [ null, NaN, undefined ] ]

  t.equals(hasPropPath(path, undefined), false, 'returns false for undefined')
  t.equals(hasPropPath(path, null), false, 'returns false for null')
  t.equals(hasPropPath(path, NaN), false, 'returns false for NaN')
  t.equals(hasPropPath(path, 0), false, 'returns false for falsey number')
  t.equals(hasPropPath(path, 1), false, 'returns false for truthy number')
  t.equals(hasPropPath(path, ''), false, 'returns false for falsey string')
  t.equals(hasPropPath(path, 'string'), false, 'returns false for truthy string')
  t.equals(hasPropPath(path, unit), false, 'returns false for function')

  t.equals(hasPropPath(path, { a: { b: 'value' } }), true, 'returns true when key exists on object')
  t.equals(hasPropPath(path, { a: { b: null } }), true, 'returns true when key does exist on object with null value')
  t.equals(hasPropPath(path, { a: { b: NaN } }), true, 'returns true when key does exist on object with NaN value')

  t.equals(hasPropPath(path, {}), false, 'returns false when key does not exist on object')
  t.equals(hasPropPath(path, { a: { b: undefined } }), false, 'returns false when key does exist on object with undefined value')

  t.equals(hasPropPath([ 0, 1 ], arr), true, 'returns true when index exists in array')
  t.equals(hasPropPath([ 0, '1' ], arr), true, 'returns true when string index exists in array')
  t.equals(hasPropPath([ 1, 0 ], arr), true, 'returns true when value is null')
  t.equals(hasPropPath([ 1, 1 ], arr), true, 'returns true when value is NaN')

  t.equals(hasPropPath([ -1 ], arr), false, 'returns false when index does not exist in array')
  t.equals(hasPropPath([ 1, 2 ], arr), false, 'returns false when value is undefined')

  t.end()
})
