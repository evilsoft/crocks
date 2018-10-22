const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../core/_unit')

const assoc = require('./assoc')

test('assoc helper function', t => {
  const fn = bindFunc(assoc)

  const noKey = /assoc: String required for first argument$/
  t.throws(fn(undefined, 1, {}), noKey, 'throws when first arg is undefined')
  t.throws(fn(null, 1, {}), noKey, 'throws when first arg is null')
  t.throws(fn(NaN, 1, {}), noKey, 'throws when first arg is NaN')
  t.throws(fn(0, 1, {}), noKey, 'throws when first arg is a falsey number')
  t.throws(fn(1, 1, {}), noKey, 'throws when first arg is a truthy number')
  t.throws(fn(false, 1, {}), noKey, 'throws when first arg is false')
  t.throws(fn(true, 1, {}), noKey, 'throws when first arg is true')
  t.throws(fn(unit, 1, {}), noKey, 'throws when first arg is a function')
  t.throws(fn([], 1, {}), noKey, 'throws when first arg is an array')
  t.throws(fn({}, 1, {}), noKey, 'throws when first arg is an object')

  const noObj = /assoc: Object required for third argument/
  t.throws(fn('a', 1, undefined), noObj, 'throws when third arg is undefined')
  t.throws(fn('a', 1, null), noObj, 'throws when third arg is null')
  t.throws(fn('a', 1, NaN), noObj, 'throws when third arg is NaN')
  t.throws(fn('a', 1, 0), noObj, 'throws when third arg is a falsey number')
  t.throws(fn('a', 1, 1), noObj, 'throws when third arg is a truthy number')
  t.throws(fn('a', 1, ''), noObj, 'throws when third arg is a falsey string')
  t.throws(fn('a', 1, 'string'), noObj, 'throws when third arg is a truthy string')
  t.throws(fn('a', 1, false), noObj, 'throws when third arg is a false')
  t.throws(fn('a', 1, true), noObj, 'throws when third arg is a true')
  t.throws(fn('a', 1, unit), noObj, 'throws when third arg is a function')
  t.throws(fn('a', 1, []), noObj, 'throws when third arg is an array')

  const data = { a: 45, b: 23 }

  t.same(assoc('c', 10, data), { a: 45, b: 23, c: 10 }, 'adds a new key when it does not exist')
  t.same(assoc('b', 10, data), { a: 45, b: 10 }, 'overrides an existing key when it exists')
  t.same(data, { a: 45, b: 23 }, 'does not modify exsiting object (shallow)')

  t.end()
})
