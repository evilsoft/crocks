const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('./core/unit')

const dissoc = require('./dissoc')

test('dissoc', t => {
  const fn = bindFunc(dissoc)

  const noString = /dissoc: String required for first argument/
  t.throws(fn(undefined, {}), noString, 'throws when first arg is undefined')
  t.throws(fn(null, {}), noString, 'throws when first arg is null')
  t.throws(fn(0, {}), noString, 'throws when first arg is falsey number')
  t.throws(fn(1, {}), noString, 'throws when first arg is truthy number')
  t.throws(fn(false, {}), noString, 'throws when first arg is false')
  t.throws(fn(true, {}), noString, 'throws when first arg is true')
  t.throws(fn(unit, {}), noString, 'throws when first arg is a function')
  t.throws(fn({}, {}), noString, 'throws when first arg is an object')
  t.throws(fn([], {}), noString, 'throws when first arg is an array')

  const noObj = /dissoc: Object required for second argument/
  t.throws(fn('', undefined), noObj, 'throws when second arg is undefined')
  t.throws(fn('', null), noObj, 'throws when second arg is null')
  t.throws(fn('', 0), noObj, 'throws when second arg is falsey number')
  t.throws(fn('', 1), noObj, 'throws when second arg is truthy number')
  t.throws(fn('', ''), noObj, 'throws when second arg is falsey string')
  t.throws(fn('', 'string'), noObj, 'throws when second arg is truthy string')
  t.throws(fn('', false), noObj, 'throws when second arg is false')
  t.throws(fn('', true), noObj, 'throws when second arg is true')

  const undefs = { a: undefined, b: undefined }
  t.same(dissoc('', undefs), {}, 'removes undefined values')

  const defs = { a: 1, b: 2 }
  t.same(dissoc('', defs), defs, 'empty string returns with nothing removed')
  t.notEqual(dissoc('', defs), defs, 'returns a new object')
  t.same(dissoc('a', defs), { b: 2 }, 'returns a new object with specified key removed')

  t.end()
})
