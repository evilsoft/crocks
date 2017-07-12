const test = require('tape')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../core/_unit')

const pick = require('./pick')

test('pick helper', t => {
  const fn = bindFunc(pick)

  const noFold = /pick: Foldable required for first argument/
  t.throws(fn(undefined, {}), noFold, 'throws when first arg is undefined')
  t.throws(fn(null, {}), noFold, 'throws when first arg is null')
  t.throws(fn(0, {}), noFold, 'throws when first arg is a falsey number')
  t.throws(fn(1, {}), noFold, 'throws when first arg is a truthy number')
  t.throws(fn('', {}), noFold, 'throws when first arg is  a falsey string')
  t.throws(fn('string', {}), noFold, 'throws when first arg is a truthy string')
  t.throws(fn(false, {}), noFold, 'throws when first arg is false')
  t.throws(fn(true, {}), noFold, 'throws when first arg is true')
  t.throws(fn(unit, {}), noFold, 'throws when first arg is a function')
  t.throws(fn({}, {}), noFold, 'throws when first arg is an object')

  const noObj = /pick: Object required for second argument/
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

  const noString = /pick: Foldable of Strings is required for first argument/
  t.throws(fn([ undefined ], {}), noString, 'throws when first arg contains undefined')
  t.throws(fn([ null ], {}), noString, 'throws when first arg contains null')
  t.throws(fn([ 0 ], {}), noString, 'throws when first arg contains a falsey number')
  t.throws(fn([ 1 ], {}), noString, 'throws when first arg contains a truthy number')
  t.throws(fn([ false ], {}), noString, 'throws when first arg contains false')
  t.throws(fn([ true ], {}), noString, 'throws when first arg contains true')
  t.throws(fn([ unit ], {  }), noString, 'throws when first arg contains a function')
  t.throws(fn([ [] ], {}), noString, 'throws when first arg contains an array')
  t.throws(fn([ {} ], {}), noString, 'throws when first arg contains an object')

  const data = { a: 23, b: true, c: 'sea', d: undefined }

  t.same(pick([ 'a', 'c', 'blah' ], data), { a: 23, c: 'sea' }, 'picks provided keys when keys exist')
  t.same(pick([ 'blah' ], data), {}, 'returns an empty object when no key exists')
  t.same(pick([ '' ], data), {}, 'returns an empty object when blank key exists')
  t.same(pick([ 'd' ], data), {}, 'does not include keys if their values are undefined')

  t.end()
})
