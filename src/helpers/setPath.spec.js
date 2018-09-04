const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../core/_unit')

const setPath = require('./setPath')

const fn = (path, obj) =>
  setPath(path, 'set', obj)

test('setPath helper function', t => {
  const fn = bindFunc(setPath)

  const badKeys = /setPath: Non-empty Array of non-empty Strings and\/or Integers required for first argument/
  t.throws(fn(undefined, 1, {}), badKeys, 'throws when first arg is undefined')
  t.throws(fn(null, 1, {}), badKeys, 'throws when first arg is null')
  t.throws(fn(NaN, 1, {}), badKeys, 'throws when first arg is NaN')
  t.throws(fn(0, 1, {}), badKeys, 'throws when first arg is a falsey number')
  t.throws(fn(1, 1, {}), badKeys, 'throws when first arg is a truthy number')
  t.throws(fn('', 1, {}), badKeys, 'throws when first arg is a falsey string')
  t.throws(fn('string', 1, {}), badKeys, 'throws when first arg is a truthy string')
  t.throws(fn(false, 1, {}), badKeys, 'throws when first arg is false')
  t.throws(fn(true, 1, {}), badKeys, 'throws when first arg is true')
  t.throws(fn(unit, 1, {}), badKeys, 'throws when first arg is a function')
  t.throws(fn([], 1, {}), badKeys, 'throws when first arg is an empty array')
  t.throws(fn({}, 1, {}), badKeys, 'throws when first arg is an object')

  t.throws(fn([ undefined ], 1, {}), badKeys, 'throws with undefined in path')
  t.throws(fn([ null ], 1, {}), badKeys, 'throws with null in path')
  t.throws(fn([ NaN ], 1, {}), badKeys, 'throws with NaN in path')
  t.throws(fn([ '' ], 1, {}), badKeys, 'throws with an empty string in path')
  t.throws(fn([ false ], 1, {}), badKeys, 'throws with false in path')
  t.throws(fn([ true ], 1, {}), badKeys, 'throws with true in path')
  t.throws(fn([ unit ], 1, {}), badKeys, 'throws with a function in path')
  t.throws(fn([ {} ], 1, {}), badKeys, 'throws with an object in path')
  t.throws(fn([ [] ], 1, {}), badKeys, 'throws with an object in path')

  const noObj = /setPath: Object or Array required for third argument/
  t.throws(fn([ 'key' ], 1, undefined), noObj, 'throws when third arg is undefined')
  t.throws(fn([ 'key' ], 1, null), noObj, 'throws when third arg is null')
  t.throws(fn([ 'key' ], 1, NaN), noObj, 'throws when third arg is NaN')
  t.throws(fn([ 'key' ], 1, 0), noObj, 'throws when third arg is a falsey number')
  t.throws(fn([ 'key' ], 1, 1), noObj, 'throws when third arg is a truthy number')
  t.throws(fn([ 'key' ], 1, ''), noObj, 'throws when third arg is a falsey string')
  t.throws(fn([ 'key' ], 1, 'string'), noObj, 'throws when third arg is a truthy string')
  t.throws(fn([ 'key' ], 1, false), noObj, 'throws when third arg is false')
  t.throws(fn([ 'key' ], 1, true), noObj, 'throws when third arg is true')
  t.throws(fn([ 'key' ], 1, unit), noObj, 'throws when third arg is a function')

  t.end()
})

test('setPath helper with object', t => {
  const simple = { a: false }
  const nested = { a: { b: { c: 'great' }, d: 'nice' } }

  t.same(fn([ 'c', 'd' ], simple), { a: false, c: { d: 'set' } }, 'adds a new key when it does not exist')
  t.same(fn([ 'a', 'b' ], simple), { a: { b: 'set' } }, 'adds a new key when it does not exist')
  t.same(fn([ 'a', 'b' ], nested), { a: { b: 'set', d: 'nice' } }, 'only follows path with nested objects')

  t.same(fn([ 0, 'b' ], { a: 42 }), { a: 42, '0': { b: 'set' } }, 'keeps existing object when Integer used as key')
  t.same(fn([ 'a', 'b' ], {}), { a: { b: 'set' } }, 'builds path on empty object')

  t.end()
})

test('setPath helper with array', t => {
  const simple = [ 32 ]
  const nested = [ 99, [ 1, 3 ] ]

  t.same(fn([ 1, 0 ], simple), [ 32, [ 'set' ] ], 'adds a new array when it does not exist')
  t.same(fn([ 1, 1 ], nested), [ 99, [ 1, 'set' ] ], 'replaces an existing value on path')
  t.same(fn([ 1, 2 ], nested), [ 99, [ 1, 3, 'set' ] ], 'adds a new index when the path does not exist')

  const sparse = fn([ 1, 3 ], nested)
  t.equal(sparse[1][3], 'set', 'sets value at specifed index in path')
  t.equal(sparse[1][2], undefined, 'fills unallocated indcies with undefined when setting a value')

  t.same(fn([ 'a', 0 ], simple), { 0: 32, a: [ 'set' ] }, 'converts from array to an object when string index used')
  t.same(fn([ 0, 0 ], []), [ [ 'set' ] ], 'builds path on empty array')

  t.end()
})

test('setPath helper with mixed array', t => {
  const array = [ { a: 99 }, false ]

  t.same(fn([ 0, 'b' ], array), [ { a: 99, b: 'set' }, false ], 'updates inner existing object in an array')
  t.same(fn([ 1, 'b' ], array), [ { a: 99 }, { b: 'set' } ], 'replaces existing, non-object value with object for String')
  t.same(fn([ 1, 0 ], array), [ { a: 99 },  [ 'set' ] ], 'replaces existing, non-array value with array for Integer')
  t.same(fn([ 2, 'b' ], array), [ { a: 99 }, false, { b: 'set' } ], 'creates new object if index does not exist')

  t.end()
})

test('setPath helper with mixed object', t => {
  const object = { a: [ 'a' ], b: 99 }

  t.same(fn([ 'a', 0 ], object), { a: [ 'set' ], b: 99 }, 'updates inner existing array in an object')
  t.same(fn([ 'b', 'c' ], object), { a: [ 'a' ], b: { c: 'set' } }, 'replaces existing, non-object value with object for String')
  t.same(fn([ 'b', 0 ], object), { a: [ 'a' ], b: [ 'set' ] }, 'replaces existing, non-array value with array for Integer')
  t.same(fn([ 'c', 0 ], object), { a: [ 'a' ], b: 99, c: [ 'set' ] }, 'creates new array if key does not exist')

  t.end()
})
