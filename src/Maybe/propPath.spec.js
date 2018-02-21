const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const equals = require('../core/equals')

const propPath = require('./propPath')

test('propPath function', t => {
  const fn =
    x => propPath([ 'key' ], x).option('nothing')

  const empty =
    x => propPath([], x).option('nothing')

  t.ok(isFunction(propPath), 'is a function')

  t.equals(fn(undefined), 'nothing', 'returns Nothing when data is undefined')
  t.equals(fn(null), 'nothing', 'returns Nothing when data is null')
  t.equals(fn(NaN), 'nothing', 'returns Nothing when data is NaN')

  t.equals(empty(undefined), 'nothing', 'returns Nothing when data is undefined')
  t.equals(empty(null), 'nothing', 'returns Nothing when data is null')
  t.equals(empty(NaN), 'nothing', 'returns Nothing when data is NaN')

  t.end()
})

test('propPath errors', t => {
  const fn = bindFunc(x => propPath(x, {}))

  const err = /propPath: Array of Non-empty Strings or Integers required for first argument/
  t.throws(fn(undefined), err, 'throws with undefined in first argument')
  t.throws(fn(null), err, 'throws with null in first argument')
  t.throws(fn(0), err, 'throws with falsey number in first argument')
  t.throws(fn(1), err, 'throws with truthy number in first argument')
  t.throws(fn(''), err, 'throws with falsey string in first argument')
  t.throws(fn('string'), err, 'throws with truthy string in first argument')
  t.throws(fn(false), err, 'throws with false in first argument')
  t.throws(fn(true), err, 'throws with true in first argument')
  t.throws(fn({}), err, 'throws with an object in first argument')

  t.throws(fn([ undefined ]), err, 'throws with an array of undefined in first argument')
  t.throws(fn([ null ]), err, 'throws with array of null in first argument')
  t.throws(fn([ false ]), err, 'throws with an array of false in first argument')
  t.throws(fn([ true ]), err, 'throws with an array of true in first argument')
  t.throws(fn([ '' ]), err, 'throws with an array of empty String in first argument')
  t.throws(fn([ 1.234 ]), err, 'throws with an array of float in first argument')
  t.throws(fn([ {} ]), err, 'throws with an array of objects in first argument')
  t.throws(fn([ [ 'key' ] ]), err, 'throws with a nested array in first argument')

  t.end()
})

test('propPath object traversal', t => {
  const fn = x =>
    propPath([ 'a', 'b' ], x).option('nothing')

  const empty = x =>
    propPath([], x).option('nothing')

  t.equals(fn({ a: { b: 0 } }), 0, 'returns a Just with the value when key path is found')
  t.equals(fn({ a: { b: null } }), null, 'returns a Just when keypath is found and value is null')
  t.ok(equals(fn({ a: { b: NaN } }), NaN), 'returns a Just when keypath is found and value is NaN')

  t.equals(fn({ c: { b: 15 } }), 'nothing', 'returns a Nothing when key path is not found')
  t.equals(fn({ a: { b: undefined } }), 'nothing', 'returns a Nothing when keypath is found and value is undefined')

  t.equals(fn({ a: undefined }), 'nothing', 'returns a Nothing with undefined in keypath')
  t.equals(fn({ a: null }), 'nothing', 'returns a Nothing with null in keypath')
  t.equals(fn({ a: NaN }), 'nothing', 'returns a Nothing with NaN in keypath')

  t.same(empty({ b: 'string' }), { b: 'string' }, 'returns original object when path empty')

  t.end()
})

test('propPath array traversal', t => {
  const fn = x =>
    propPath([ 0, '1' ], x).option('nothing')

  const empty = x =>
    propPath([], x).option('nothing')

  t.equals(fn([ [ null, false ] ]), false, 'returns a Just with the value when index is found')
  t.equals(fn([ [ false, null ] ]), null, 'returns a Just when index is found and value is null')
  t.ok(equals(fn([ [ '', NaN ] ]), NaN), 'returns a Just when index is found and value is NaN')

  t.equals(fn([ true ]), 'nothing', 'returns a Nothing when index is not found')
  t.equals(fn([ [ 2, undefined ] ]), 'nothing', 'returns a Nothing when index is found and value is undefined')

  t.equals(fn([ undefined ]), 'nothing', 'returns a Nothing with undefined in keypath')
  t.equals(fn([ null ]), 'nothing', 'returns a Nothing with null in keypath')
  t.equals(fn([ NaN ]), 'nothing', 'returns a Nothing with NaN in keypath')


  t.same(empty([ [ 23 ] ]), [ [ 23 ] ], 'returns a Just with original value when an empty array is provided as path')

  t.end()
})

test('propPath mixed traversal', t => {
  const fn = x =>
    propPath([ 0, 'a' ], x).option('nothing')

  t.equals(fn([ { a: '' } ]), '', 'allows for traversal with a mixed path on a mixed structure')
  t.equals(fn([ { b: '' } ]), 'nothing', 'returns Nothin when not found with mixed path')


  t.end()
})
