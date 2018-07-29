import test from 'tape'
import { bindFunc } from '../test/helpers'



import equals from '../core/equals'
import isFunction from '../core/isFunction'
import unit from '../core/_unit'

import propPathOr from './propPathOr'

test('propPathOr function', t => {
  const def = 'default value'
  const fn = propPathOr(def, [ 'key' ])
  const empty = propPathOr(def, [])

  t.ok(isFunction(propPathOr), 'is a function')

  t.equals(fn(undefined), def, 'returns the default value when data is undefined')
  t.equals(fn(null), def, 'returns the default value when data is null')
  t.equals(fn(NaN), def, 'returns the default value when data is NaN')

  t.equals(empty(undefined), def, 'returns default with empty path and undefined')
  t.equals(empty(null), def, 'returns default with empty path and null')
  t.equals(empty(NaN), def, 'returns default with empty path and NaN')

  t.end()
})

test('propPathOr errors', t => {
  const def = 'default value'
  const fn = bindFunc(x => propPathOr(def, x, {}))

  const err = /propPathOr: Array of Non-empty Strings or Integers required for second argument/
  t.throws(fn(def, undefined, {}), err, 'throws with undefined in second argument')
  t.throws(fn(def, null, {}), err, 'throws with null in second argument')
  t.throws(fn(def, 0, {}), err, 'throws with falsey number in second argument')
  t.throws(fn(def, 1, {}), err, 'throws with truthy number in second argument')
  t.throws(fn(def, '', {}), err, 'throws with falsey string in second argument')
  t.throws(fn(def, 'string', {}), err, 'throws with truthy string in second argument')
  t.throws(fn(def, false, {}), err, 'throws with false in second argument')
  t.throws(fn(def, true, {}), err, 'throws with true in second argument')
  t.throws(fn(def, {}, {}), err, 'throws with an object in second argument')
  t.throws(fn(def, unit, {}), err, 'throws with an function in second argument')

  t.throws(fn([ undefined ]), err, 'throws with an array of undefined in second argument')
  t.throws(fn([ null ]), err, 'throws with array of null in second argument')
  t.throws(fn([ false ]), err, 'throws with an array of false in second argument')
  t.throws(fn([ true ]), err, 'throws with an array of true in second argument')
  t.throws(fn([ '' ]), err, 'throws with an array of empty string in second argument')
  t.throws(fn([ 1.543 ]), err, 'throws with an array of float in second argument')
  t.throws(fn([ {} ]), err, 'throws with an array of object in second argument')
  t.throws(fn([ unit ]), err, 'throws with an array of function in second argument')
  t.throws(fn([ [ 'key' ] ], {}), err, 'throws with a nested array in second argument')

  t.end()
})

test('propPathOr object traversal', t => {
  const def = { b: 1 }

  const fn = propPathOr(def, [ 'a', 'b' ])
  const empty = propPathOr(def, [])

  t.same(fn({ a: { b: { c: 32 } } }), { c: 32 }, 'returns the value when keypath is found')
  t.equals(fn({ a: { b: null } }), null, 'returns null when keypath is found and value is null')
  t.ok(equals(fn({ a: { b: NaN } }), NaN), 'returns NaN when keypath is found and value is NaN')

  t.equals(fn({ a: { c: true } }), def, 'returns the default value when keypath is not found')
  t.equals(fn({ a: { b: undefined } }), def, 'returns the default value when keypath is found and value is undefined')

  t.equals(fn({ a: undefined }), def, 'returns the default value when keypath contains an undefined')
  t.equals(fn({ a: null }), def, 'returns the default value when keypath contains a null')
  t.equals(fn({ a: NaN }), def, 'returns the default value when keypath contains a NaN')

  t.same(empty({ a: 32 }), { a: 32 }, 'returns the original object when an empty array is provided as path')

  t.same(fn({ c: { b: 2 } }), def, 'returns the default value when default is an object that has the same property as a nested property in target')

  t.end()
})

test('propPathOr array traversal', t => {
  const def = 99

  const fn = propPathOr(def, [ 0, '1' ])
  const empty = propPathOr(def, [])

  t.equals(fn([ [ '', 13 ] ]), 13, 'returns the value when index is found')
  t.equals(fn([ [ false, null ] ]), null , 'returns null when index is found and value is null')
  t.ok(equals(fn([ [ false, NaN ] ]), NaN), 'returns NaN when index is found and value is NaN')

  t.equals(fn([ true ]), def, 'returns the default value when index is not found')
  t.equals(fn([ [ 0, undefined ] ]), def, 'returns the default value when index is found and value is undefined')

  t.equals(fn([ undefined ]), def, 'returns the default value when key path contains a null')
  t.equals(fn([ null ]), def, 'returns the default value when key path contains a null')
  t.equals(fn([ NaN ]), def, 'returns the default value when key path contains a NaN')

  t.same(empty([ 1, { a: 23 } ]), [ 1, { a: 23 } ], 'returns the original array when an empty array is provided as path')

  t.end()
})

test('propPathOr mixed traversal', t => {
  const def = 'default value'
  const fn = propPathOr(def, [ 'a', 1 ])

  t.equals(fn({ a: [ 0, false ] }), false, 'returns value when found with mixed path')
  t.equals(fn({ c: [ true ] }), def, 'returns default when not found with mixed path')

  t.end()
})
