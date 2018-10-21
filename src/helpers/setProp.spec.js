const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../core/_unit')

const setProp = require('./setProp')

test('setProp helper function', t => {
  const fn = bindFunc(setProp)

  const noKey = /setProp: String or Integer required for first argument$/
  t.throws(fn(undefined, 1, {}), noKey, 'throws when first arg is undefined')
  t.throws(fn(null, 1, {}), noKey, 'throws when first arg is null')
  t.throws(fn(NaN, 1, {}), noKey, 'throws when first arg is NaN')
  t.throws(fn(1.23, 1, {}), noKey, 'throws when first arg is a float')
  t.throws(fn(Infinity, 1, {}), noKey, 'throws when first arg is Infinity')
  t.throws(fn(-Infinity, 1, {}), noKey, 'throws when first arg is -Infinity')
  t.throws(fn(false, 1, {}), noKey, 'throws when first arg is false')
  t.throws(fn(true, 1, {}), noKey, 'throws when first arg is true')
  t.throws(fn(unit, 1, {}), noKey, 'throws when first arg is a function')
  t.throws(fn([], 1, {}), noKey, 'throws when first arg is an array')
  t.throws(fn({}, 1, {}), noKey, 'throws when first arg is an object')

  t.end()
})

test('setProp with Objects', t => {
  const fn = bindFunc(setProp)

  const noObj = /setProp: Object required for third argument when first is a String$/
  t.throws(fn('key', 1, undefined), noObj, 'throws when third arg is undefined')
  t.throws(fn('key', 1, null), noObj, 'throws when third arg is null')
  t.throws(fn('key', 1, 0), noObj, 'throws when third arg is a falsey number')
  t.throws(fn('key', 1, 1), noObj, 'throws when third arg is a truthy number')
  t.throws(fn('key', 1, ''), noObj, 'throws when third arg is a falsey string')
  t.throws(fn('key', 1, 'string'), noObj, 'throws when third arg is a truthy string')
  t.throws(fn('key', 1, false), noObj, 'throws when third arg is false')
  t.throws(fn('key', 1, true), noObj, 'throws when third arg is true')
  t.throws(fn('key', 1, unit), noObj, 'throws when third arg is a function')
  t.throws(fn('key', 1, []), noObj, 'throws when third arg is an array')

  const data = { a: 45, b: 23 }

  t.same(setProp('c', 10, data), { a: 45, b: 23, c: 10 }, 'adds a new key when it does not exist')
  t.same(setProp('b', 10, data), { a: 45, b: 10 }, 'overrides an existing key when it exists')
  t.same(data, { a: 45, b: 23 }, 'does not modify exsiting object (shallow)')

  t.end()
})

test('setProp with Arrays', t => {
  const fn = bindFunc(setProp)

  const noObj = /setProp: Array required for third argument when first is an Integer$/
  t.throws(fn(1, 1, undefined), noObj, 'throws when third arg is undefined')
  t.throws(fn(1, 1, null), noObj, 'throws when third arg is null')
  t.throws(fn(1, 1, 0), noObj, 'throws when third arg is a falsey number')
  t.throws(fn(1, 1, 1), noObj, 'throws when third arg is a truthy number')
  t.throws(fn(1, 1, ''), noObj, 'throws when third arg is a falsey string')
  t.throws(fn(1, 1, 'string'), noObj, 'throws when third arg is a truthy string')
  t.throws(fn(1, 1, false), noObj, 'throws when third arg is false')
  t.throws(fn(1, 1, true), noObj, 'throws when third arg is true')
  t.throws(fn(1, 1, unit), noObj, 'throws when third arg is a function')
  t.throws(fn(1, 1, {}), noObj, 'throws when third arg is an object')

  const data = [ 'a', 'b' ]

  t.same(setProp(1, 10, data), [ 'a', 10 ], 'overwrites existing value')
  t.same(setProp(2, 10, data), [ 'a', 'b', 10 ], 'adds a value when it does not exist')

  const sparse = setProp(3, 10, data)

  t.equal(sparse[3], 10, 'sets value at specifed index in path')
  t.equal(sparse[2], undefined, 'fills unallocated indcies with undefined when setting a value')
  t.same(data, [ 'a', 'b' ], 'does not alter original array')

  t.end()
})
