import test from 'tape'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'
import unit from '../core/_unit'

import hasPropPath from './hasPropPath'

test('hasPropPath function', t => {
  const fn = hasPropPath([ 'a', 'b' ])
  const empty = hasPropPath([])

  t.ok(isFunction(hasPropPath), 'is a function')

  t.equals(fn(undefined), false, 'returns false for undefined')
  t.equals(fn(null), false, 'returns false for null')
  t.equals(fn(NaN), false, 'returns false for NaN')

  t.equals(empty(undefined), false, 'returns false for empty path and undefined')
  t.equals(empty(null), false, 'returns false for empty path and null')
  t.equals(empty(NaN), false, 'returns false for empty path and NaN')

  t.end()
})

test('hasPropPath errors', t => {
  const f = bindFunc(hasPropPath)

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
  t.throws(f([ '' ], {}), err, 'throws with array of empty string in first argument')
  t.throws(f([ 1.265 ], {}), err, 'throws with array of float in first argument')
  t.throws(f([ {} ], {}), err, 'throws with array of object in first argument')
  t.throws(f([ [ 'key' ] ], {}), err, 'throws with nested arrays in first argument')
  t.throws(f([ unit ], {}), err, 'throws with array of function in first argument')

  t.end()
})

test('hasPropPath object traversal', t => {
  const fn = hasPropPath([ 'a', 'b' ])
  const empty = hasPropPath([])

  t.equals(fn({ a: { b: 0 } }), true, 'returns true when keypath exists')
  t.equals(fn({ a: { b: null } }), true, 'returns true when keypath exists with null value')
  t.equals(fn({ a: { b: NaN } }), true, 'returns true when keypath exists with NaN value')

  t.equals(fn({ a: { c: 0 } }), false, 'returns false when keypath does not exist')
  t.equals(fn({ a: { b: undefined } }), false, 'returns false when key does exist on object with undefined value')

  t.equals(fn({ a: undefined }), false, 'returns false when keypath contains an undefined')
  t.equals(fn({ a: null }), false, 'returns false when keypath contains a null value')
  t.equals(fn({ a: NaN }), false, 'returns false when keypath contains a NaN value')

  t.equals(empty({ a: 0 }), true, 'returns true when path is empty')

  t.end()
})

test('hasPropPath array traversal', t => {
  const value = false
  const fn = hasPropPath([ 0, '1' ])

  t.equals(fn([ [ 0, value ] ]), true, 'returns true when index exists')
  t.equals(fn([ [ 0, null ] ]), true, 'returns true when index exists with null')
  t.equals(fn([ [ 0, NaN ] ]), true, 'returns true when index exists with NaN')

  t.equals(fn([ [ '' ] ]), false, 'returns false when index does not exist')
  t.equals(fn([ [ 0, undefined ] ]), false, 'returns false when value is undefined')

  t.equals(fn([ undefined ]), false, 'returns the default value when key path contains a null')
  t.equals(fn([ null ]), false, 'returns the default value when key path contains a null')
  t.equals(fn([ NaN ]), false, 'returns the default value when key path contains a NaN')

  t.end()
})

test('hasPropPath mixed traversal', t => {
  const fn = hasPropPath([ 'a', 1 ])

  t.equals(fn({ a: [ 99, 0 ] }), true, 'returns true when found on mixed path')
  t.equals(fn({ b: NaN }), false, 'returns false when not found on mixed path')

  t.end()
})
