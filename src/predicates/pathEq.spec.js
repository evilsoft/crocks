const test = require('tape')
const helpers = require('../test/helpers')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const bindFunc = helpers.bindFunc

const pathEq = require('./pathEq')

test('pathEq function', t => {
  const fn = pathEq([ 'a' ])
  const empty = pathEq([])

  t.ok(isFunction(pathEq), 'is a function')

  t.equals(fn(undefined, undefined), false, 'returns false with undefined as third argument')
  t.equals(fn(null, null), false, 'returns false with null as third argument')
  t.equals(fn(NaN, NaN), false, 'returns false with NaN as third argument')

  t.equals(empty(undefined, undefined), false, 'returns false with empty array on undefined')
  t.equals(empty(null, null), false, 'returns false with empty array on null')
  t.equals(empty(NaN, NaN), false, 'returns false with empty array on NaN')

  t.end()
})

test('pathEq errors', t => {
  const fn = bindFunc(x => pathEq(x, null, {}))

  const err = /pathEq: First argument must be an Array of Non-empty Strings or Integers/
  t.throws(fn(undefined), err, 'throws with undefined in first argument')
  t.throws(fn(null), err, 'throws with null in first argument')
  t.throws(fn(0), err, 'throws with falsey number in first argument')
  t.throws(fn(1), err, 'throws with truthy number in first argument')
  t.throws(fn(''), err, 'throws with falsey string in first argument')
  t.throws(fn('string'), err, 'throws with truthy string in first argument')
  t.throws(fn(false), err, 'throws with false in first argument')
  t.throws(fn(true), err, 'throws with true in first argument')
  t.throws(fn(unit), err, 'throws with function in first argument')
  t.throws(fn({}), err, 'throws with an object in first argument')

  t.throws(fn([ undefined ]), err, 'throws with undefined in first argument array')
  t.throws(fn([ null ]), err, 'throws with null in first argument array')
  t.throws(fn([ NaN ]), err, 'throws with NaN in first argument array')
  t.throws(fn([ false ]), err, 'throws with false in first argument array')
  t.throws(fn([ true ]), err, 'throws with true in first argument array')
  t.throws(fn([ 1.2345 ]), err, 'throws with float in first argument array')
  t.throws(fn([ '' ]), err, 'throws with empty string in first argument array')
  t.throws(fn([ unit ]), err, 'throws with function in first argument array')
  t.throws(fn([ [] ]), err, 'throws with Array in first argument array')
  t.throws(fn([ {} ]), err, 'throws with Object in first argument array')

  t.end()
})

test('pathEq object traversal', t => {
  const fn = pathEq([ 'a', 'b' ])
  const empty = pathEq([])

  t.equals(fn('', { a: { b: '' } }), true, 'returns true when keypath found and values are equal')
  t.equals(fn(null, { a: { b: null } }), true, 'returns true when comparing to null values that are present')
  t.equals(fn(NaN, { a: { b: NaN } }), true, 'returns true when comparing to NaN values that are present')

  t.equals(fn(true, { a: { c: true } }), false, 'returns false when keypath not found')
  t.equals(fn('0', { a: { b: 0 } }), false, 'returns false when keypath is found and values are not equal')
  t.equals(fn(undefined, { a: { b: undefined } }), false, 'returns false when comparing undefined values that are present')
  t.equals(empty(23, { a: 23 }), false, 'returns false when value does not match object to traverse when path is empty')

  t.equals(fn(undefined, { a: undefined }), false, 'returns false when undefined in keypath')
  t.equals(fn(null, { a: null }), false, 'returns false when null in keypath')
  t.equals(fn(NaN, { a: NaN }), false, 'returns false when NaN in keypath')

  t.equals(empty({ a: 23 }, { a: 23 }), true, 'returns true when value matchs object to traverse when path is empty')

  t.end()
})

test('pathEq array traversal', t => {
  const fn = pathEq([ 1, '0' ])
  const empty = pathEq([])

  t.equals(fn('', [ false, [ '' ] ]), true, 'returns true when keypath found and values are equal')
  t.equals(fn(null, [ '', [ null ] ]), true, 'returns true when comparing to null values that are present')
  t.equals(fn(NaN, [ '', [ NaN ] ]), true, 'returns true when comparing to NaN values that are present')
  t.equals(empty([ [ null ] ], [ [ null ] ]), true, 'returns true when value matchs array to traverse when path is empty')

  t.equals(fn('string', [ 'string' ]), false, 'returns false when keypath not found')
  t.equals(fn('1', [ true, [ 1 ] ]), false, 'returns false when keypath is found and values are not equal')
  t.equals(fn(undefined, [ 1, [ undefined ] ]), false, 'returns false when compairing undefined values that are present')
  t.equals(empty(23, [ 23 ]), false, 'returns false when value does not match array to traverse when path is empty')

  t.equals(fn(undefined, [ 1, undefined ]), false, 'returns false when undefined in keypath')
  t.equals(fn(null, [ true, null ]), false, 'returns false when null in keypath')
  t.equals(fn(undefined, [ '45', [ undefined ] ]), false, 'returns false when comparing undefined values that are present')

  t.end()
})

test('pathEq mixed traversal', t => {
  const value = 'bubbles'

  const fn = pathEq([ 'a', 1 ], value)

  t.equals(fn({ a: [ 0, value ] }), true, 'returns false when found with mixed path and values are equal')
  t.equals(fn({ a: [ value, 42 ] }), false, 'returns false when found with mixed path and values are not equal')
  t.equals(fn({ c: [ value ] }), false, 'returns false when not found with mixed path')

  t.end()
})
