import test from 'tape'
import { bindFunc } from '../test/helpers'



import isFunction from '../core/isFunction'
import unit from '../core/_unit'

import hasProp from './hasProp'

test('hasProp function', t => {
  const fn = hasProp('a')

  t.ok(isFunction(hasProp), 'is a function')

  t.equals(fn(undefined), false, 'returns false for undefined')
  t.equals(fn(null), false, 'returns false for null')
  t.equals(fn(NaN), false, 'returns false for NaN')

  t.end()
})

test('hasProp errors', t => {
  const fn = bindFunc(hasProp)

  const err = /hasProp: Non-empty String or Integer required for first argument/
  t.throws(fn(undefined, {}), err, 'throws with undefined in first argument')
  t.throws(fn(null, {}), err, 'throws with null in first argument')
  t.throws(fn(NaN, {}), err, 'throws with NaN in first argument')
  t.throws(fn(false, {}), err, 'throws with false in first argument')
  t.throws(fn(true, {}), err, 'throws with true number in first argument')
  t.throws(fn({}, {}), err, 'throws with object in first argument')
  t.throws(fn([], {}), err, 'throws with array in first argument')
  t.throws(fn(unit, {}), err, 'throws with function in first argument')
  t.throws(fn('', {}), err, 'throws with empty string in first argument')
  t.throws(fn(1.265, {}), err, 'throws with float in first argument')

  t.end()
})

test('hasProp object traversal', t => {
  const fn = hasProp('a')

  t.equals(fn({ a: 10 }), true, 'returns true when key exists on object')
  t.equals(fn({ a: null }), true, 'returns true when key exists on object with a null value')
  t.equals(fn({ a: NaN }), true, 'returns true when key exists on object with a NaN value')

  t.equals(fn({ b: 10 }), false, 'returns false when key does not exist on object')
  t.equals(fn({ a: undefined }), false, 'returns false when key exists on object with undefined value')

  t.end()
})

test('hasProp array traversal', t => {
  const fn = hasProp(1)
  const string = hasProp('1')

  const value = 0

  t.equals(fn([ 10, 0 ]), true, 'returns true when index exists in array')
  t.equals(string([ 0, false ]), true, 'returns true when string index exists in array')
  t.equals(fn([ 0, null ]), true, 'returns true when string index exists in array with null value')
  t.equals(fn([ 0, NaN ]), true, 'returns true when string index exists in array with NaN value')

  t.equals(hasProp(1, [ value ]), false, 'returns false when index does not exist in array')
  t.equals(fn([ 0, undefined ]), false, 'returns false when index exists in array with undefined value')

  t.end()
})
