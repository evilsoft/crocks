const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const assoc = require('./assoc')

test('assoc helper function', t => {
  t.ok(isFunction(assoc), 'is a function')

  const fn = bindFunc(assoc)

  const err = /assoc: Object or Array required for third argument$/
  t.throws(fn('a', 1, undefined), err, 'throws when third arg is undefined')
  t.throws(fn('a', 1, null), err, 'throws when third arg is null')
  t.throws(fn('a', 1, NaN), err, 'throws when third arg is NaN')
  t.throws(fn('a', 1, 0), err, 'throws when third arg is a falsey number')
  t.throws(fn('a', 1, 1), err, 'throws when third arg is a truthy number')
  t.throws(fn('a', 1, ''), err, 'throws when third arg is a falsey string')
  t.throws(fn('a', 1, 'string'), err, 'throws when third arg is a truthy string')
  t.throws(fn('a', 1, false), err, 'throws when third arg is a false')
  t.throws(fn('a', 1, true), err, 'throws when third arg is a true')
  t.throws(fn('a', 1, unit), err, 'throws when third arg is a function')

  t.end()
})

test('assoc with Object', t => {
  const fn = bindFunc(assoc)

  const err = /assoc: String required for first argument when third argument is an Object$/
  t.throws(fn(undefined, 1, {}), err, 'throws when first arg is undefined')
  t.throws(fn(null, 1, {}), err, 'throws when first arg is null')
  t.throws(fn(NaN, 1, {}), err, 'throws when first arg is NaN')
  t.throws(fn(0, 1, {}), err, 'throws when first arg is a falsey number')
  t.throws(fn(1, 1, {}), err, 'throws when first arg is a truthy number')
  t.throws(fn(false, 1, {}), err, 'throws when first arg is false')
  t.throws(fn(true, 1, {}), err, 'throws when first arg is true')
  t.throws(fn(unit, 1, {}), err, 'throws when first arg is a function')
  t.throws(fn([], 1, {}), err, 'throws when first arg is an array')
  t.throws(fn({}, 1, {}), err, 'throws when first arg is an object')

  const data = { a: 45, b: 23 }

  t.same(assoc('c', 10, data), { a: 45, b: 23, c: 10 }, 'adds a new key when it does not exist')
  t.same(assoc('b', 10, data), { a: 45, b: 10 }, 'overrides an existing key when it exists')
  t.same(data, { a: 45, b: 23 }, 'does not modify exsiting object')

  t.end()
})

test('assoc with Array', t => {
  const fn = bindFunc(assoc)

  const err = /assoc: Integer required for first argument when third argument is an Array$/
  t.throws(fn(undefined, 1, []), err, 'throws when first arg is undefined')
  t.throws(fn(null, 1, []), err, 'throws when first arg is null')
  t.throws(fn(NaN, 1, []), err, 'throws when first arg is NaN')
  t.throws(fn('', 1, []), err, 'throws when first arg is a falsey string')
  t.throws(fn('string', 1, []), err, 'throws when first arg is a truthy string')
  t.throws(fn(false, 1, []), err, 'throws when first arg is false')
  t.throws(fn(true, 1, []), err, 'throws when first arg is true')
  t.throws(fn(unit, 1, []), err, 'throws when first arg is a function')
  t.throws(fn([], 1, []), err, 'throws when first arg is an array')
  t.throws(fn({}, 1, []), err, 'throws when first arg is an object')

  const data = [ 1, 2, 3 ]

  t.same(assoc(3, 10, data), [ 1, 2, 3, 10 ], 'adds a new value when index does not exist')
  t.same(assoc(2, 10, data), [ 1, 2, 10 ], 'overrides an existing value when index exists')

  const sparse = assoc(4, 10, data)

  t.equal(sparse[4], 10, 'sets value at specifed index in path')
  t.equal(sparse[3], undefined, 'fills unallocated indcies with undefined when setting a value')

  t.same(data, [ 1, 2, 3 ], 'does not modify exsiting array')

  t.end()
})
