const test = require('tape')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../core/_unit')

const omit = require('./omit')

test('omit', t => {
  const fn = bindFunc(omit)

  const noFold = /omit: Foldable required for first argument/
  t.throws(fn(undefined, {}), noFold, 'throws when first arg is undefined')
  t.throws(fn(null, {}), noFold, 'throws when first arg is null')
  t.throws(fn(0, {}), noFold, 'throws when first arg is a falsey number')
  t.throws(fn(1, {}), noFold, 'throws when first arg is a truthy number')
  t.throws(fn('', {}), noFold, 'throws when first arg is a falsey string')
  t.throws(fn('string', {}), noFold, 'throws when first arg is a truthy string')
  t.throws(fn(false, {}), noFold, 'throws when first arg is false')
  t.throws(fn(true, {}), noFold, 'throws when first arg is true')
  t.throws(fn(unit, {}), noFold, 'throws when first arg is a function')
  t.throws(fn({}, {}), noFold, 'throws when first arg is an object')

  const noObj = /omit: Object required for second argument/
  t.throws(fn([], undefined), noObj, 'throws when second arg is undefined')
  t.throws(fn([], null), noObj, 'throws when second arg is null')
  t.throws(fn([], 0), noObj, 'throws when second arg is a falsey number')
  t.throws(fn([], 1), noObj, 'throws when second arg is a truthy number')
  t.throws(fn([], ''), noObj, 'throws when second arg is a falsey string')
  t.throws(fn([], 'string'), noObj, 'throws when second arg is a truthy string')
  t.throws(fn([], false), noObj, 'throws when second arg is false')
  t.throws(fn([], true), noObj, 'throws when second arg is true')
  t.throws(fn([], unit), noObj, 'throws when second arg is a function')
  t.throws(fn([], []), noObj, 'throws when second arg is an array')

  const data = { a: 23, b: true, c: 'sea', d: undefined }

  t.same(omit([], data), { a: 23, b: true, c: 'sea' }, 'removes undefineds')
  t.same(omit([ 'a', 'c' ], data), { b: true }, 'omits provided keys from result')
  t.same(omit([ 'blah' ], data), { a: 23, b: true, c: 'sea' }, 'returns new object without undefineds')
  t.same(omit([ '' ], data), { a: 23, b: true, c: 'sea' }, 'removes undefineds when empty string passed')

  t.end()
})
