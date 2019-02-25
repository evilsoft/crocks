const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../core/_unit')

const setPath = require('./setPath')

const fn = (path, src) =>
  setPath(path, 'value', src)

test('setPath helper function', t => {
  const f = bindFunc(fn)

  const badKeys = /setPath: Non-empty Array of non-empty Strings and\/or Positive Integers required for first argument/
  t.throws(f(undefined, {}), badKeys, 'throws when first arg is undefined')
  t.throws(f(null, {}), badKeys, 'throws when first arg is null')
  t.throws(f(NaN, {}), badKeys, 'throws when first arg is NaN')
  t.throws(f(0, {}), badKeys, 'throws when first arg is a falsey number')
  t.throws(f(1, {}), badKeys, 'throws when first arg is a truthy number')
  t.throws(f('', {}), badKeys, 'throws when first arg is a falsey string')
  t.throws(f('string', {}), badKeys, 'throws when first arg is a truthy string')
  t.throws(f(false, {}), badKeys, 'throws when first arg is false')
  t.throws(f(true, {}), badKeys, 'throws when first arg is true')
  t.throws(f(unit, {}), badKeys, 'throws when first arg is a function')
  t.throws(f([], {}), badKeys, 'throws when first arg is an empty array')
  t.throws(f({}, {}), badKeys, 'throws when first arg is an object')

  t.throws(f([ undefined ], {}), badKeys, 'throws when first arg contains undefined')
  t.throws(f([ null ], {}), badKeys, 'throws when first arg contains null')
  t.throws(f([ NaN ], {}), badKeys, 'throws when first arg contains NaN')
  t.throws(f([ '' ], {}), badKeys, 'throws with an empty string in path')
  t.throws(f([ 1.23 ], {}), badKeys, 'throws with float number in path')
  t.throws(f([ -1 ], {}), badKeys, 'throws with negative integer number in path')
  t.throws(f([ false ], {}), badKeys, 'throws when first arg contains false')
  t.throws(f([ true ], {}), badKeys, 'throws when first arg contains true')
  t.throws(f([ unit ], {}), badKeys, 'throws when first arg contains a function')
  t.throws(f([ [] ], {}), badKeys, 'throws when first arg contains an array')
  t.throws(f([ {} ], {}), badKeys, 'throws when first arg contains an object')

  const noObj = /setPath: Object or Array required for third argument/
  t.throws(f([ 'key' ], undefined), noObj, 'throws when third arg is undefined')
  t.throws(f([ 'key' ], null), noObj, 'throws when third arg is null')
  t.throws(f([ 'key' ], NaN), noObj, 'throws when third arg is NaN')
  t.throws(f([ 'key' ], 0), noObj, 'throws when third arg is a falsey number')
  t.throws(f([ 'key' ], 1), noObj, 'throws when third arg is a truthy number')
  t.throws(f([ 'key' ], ''), noObj, 'throws when third arg is a falsey string')
  t.throws(f([ 'key' ], 'string'), noObj, 'throws when third arg is a truthy string')
  t.throws(f([ 'key' ], false), noObj, 'throws when third arg is false')
  t.throws(f([ 'key' ], true), noObj, 'throws when third arg is true')
  t.throws(f([ 'key' ], unit), noObj, 'throws when third arg is a function')

  t.end()
})

test('setPath errors with objects', t => {
  const f = bindFunc(path => fn(path, {}))

  const err = /setPath: Non-empty String required in path when referencing an Object/
  t.throws(f([ 0 ]), err, 'throws with falsey number in path')
  t.throws(f([ 1 ]), err, 'throws with truthy number in path')

  t.end()
})

test('setPath helper with object', t => {
  const simple = { a: false }
  const nested = { a: { b: { c: 'great' }, d: 'nice' } }

  t.same(fn([ 'c', 'd' ], simple), { a: false, c: { d: 'value' } }, 'adds a new key when it does not exist')
  t.same(fn([ 'a', 'b' ], simple), { a: { b: 'value' } }, 'adds a new key when it does not exist')
  t.same(fn([ 'a', 'b' ], nested), { a: { b: 'value', d: 'nice' } }, 'only follows path with nested objects')
  t.same(fn([ 'a', 'b' ], {}), { a: { b: 'value' } }, 'builds path on empty object')

  t.end()
})

test('setPath errors with array', t => {
  const f = bindFunc(path => fn(path, []))

  const err = /setPath: Positive Integers required in path when referencing an Array/
  t.throws(f([ 'string' ]), err, 'throws with a non-empty string in path')

  t.end()
})

test('setPath helper with array', t => {
  const simple = [ 32 ]
  const nested = [ 99, [ 1, 3 ] ]

  t.same(fn([ 1, 0 ], simple), [ 32, [ 'value' ] ], 'adds a new array when it does not exist')
  t.same(fn([ 1, 1 ], nested), [ 99, [ 1, 'value' ] ], 'replaces an existing value on path')
  t.same(fn([ 1, 2 ], nested), [ 99, [ 1, 3, 'value' ] ], 'adds a new index when the path does not exist')

  const sparse = fn([ 1, 3 ], nested)
  t.equal(sparse[1][3], 'value', 'sets value at specifed index in path')
  t.equal(sparse[1][2], undefined, 'fills unallocated indcies with undefined when setting a value')

  t.same(fn([ 0, 0 ], []), [ [ 'value' ] ], 'builds path on empty array')

  t.end()
})

test('setPath helper with mixed array', t => {
  const array = [ { a: 99 }, false ]

  t.same(fn([ 0, 'b' ], array), [ { a: 99, b: 'value' }, false ], 'updates inner existing object in an array')
  t.same(fn([ 1, 'b' ], array), [ { a: 99 }, { b: 'value' } ], 'replaces existing, non-object value with object for String')
  t.same(fn([ 1, 0 ], array), [ { a: 99 },  [ 'value' ] ], 'replaces existing, non-array value with array for Integer')
  t.same(fn([ 2, 'b' ], array), [ { a: 99 }, false, { b: 'value' } ], 'creates new object if index does not exist')

  t.end()
})

test('setPath helper with mixed object', t => {
  const object = { a: [ 'a' ], b: 99 }

  t.same(fn([ 'a', 0 ], object), { a: [ 'value' ], b: 99 }, 'updates inner existing array in an object')
  t.same(fn([ 'b', 'c' ], object), { a: [ 'a' ], b: { c: 'value' } }, 'replaces existing, non-object value with object for String')
  t.same(fn([ 'b', 0 ], object), { a: [ 'a' ], b: [ 'value' ] }, 'replaces existing, non-array value with array for Integer')
  t.same(fn([ 'c', 0 ], object), { a: [ 'a' ], b: 99, c: [ 'value' ] }, 'creates new array if key does not exist')

  t.end()
})
