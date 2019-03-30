const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit =  Function.prototype

const dissoc = require('./dissoc')

const err =
  /dissoc: Non-empty String required or Positive Integer required for first argument/

test('dissoc helper function', t => {
  t.ok(isFunction(dissoc), 'is a function')

  const fn = bindFunc(x => dissoc(x, {}))

  t.throws(fn(undefined), err, 'throws when first arg is undefined')
  t.throws(fn(null), err, 'throws when first arg is null')
  t.throws(fn(false, {}), err, 'throws when first arg is false')
  t.throws(fn(true, {}), err, 'throws when first arg is true')
  t.throws(fn(unit, {}), err, 'throws when first arg is a function')
  t.throws(fn({}, {}), err, 'throws when first arg is an object')
  t.throws(fn([], {}), err, 'throws when first arg is an array')

  t.end()
})

test('dissoc with Object', t => {
  const fn = bindFunc(dissoc)

  t.throws(fn('', {}), err, 'throws when first arg is empty string')

  const data =
    { a: true }

  const noString =
    x => dissoc(x, data)

  t.equals(noString(0), data, 'does nothing with falsy number as first argument')
  t.equals(noString(1), data, 'does nothing with truthy number as first argument')

  const undefs = { a: undefined, b: undefined }
  t.same(dissoc('key', undefs), {}, 'removes undefined values')

  const defs = { a: 1, b: 2 }
  t.notEqual(dissoc('key', defs), defs, 'returns a new object')
  t.same(dissoc('a', defs), { b: 2 }, 'returns a new object with specified key removed')

  t.end()
})

test('dissoc with Array', t => {
  const fn = bindFunc(dissoc)

  t.throws(fn(3.1416, []), err, 'throws when first arg is float')
  t.throws(fn(-6, []), err, 'throws when first arg is negative')

  const data =
    [ 1, 2, 3 ]

  const noInteger =
    x => dissoc(x, data)

  t.equals(noInteger('string'), data, 'does nothing with truthy string as first argument')

  const undefs = [ undefined, undefined ]
  t.same(dissoc(0, undefs), [ undefined ], 'does not remove undefined values')

  const defs = [ 34, 99, 'string' ]
  t.same(dissoc(3, defs), defs, 'keeps items when index does not exist')
  t.notEqual(dissoc(3, defs), defs, 'returns a new object')

  t.same(dissoc(1, defs), [ 34, 'string' ], 'removes item at index without holes')

  t.end()
})

test('dissoc without Object or Array', t => {
  t.equals(dissoc('a', undefined), undefined, 'returns undefined with undefined')
  t.equals(dissoc('a', null), null, 'returns null with when null')
  t.ok(Number.isNaN(dissoc('a', NaN)), 'returns NaN with NaN')
  t.equals(dissoc('a', 0), 0, 'returns falsy number with falsy number')
  t.equals(dissoc('a', 1), 1, 'returns truthy number with truthy number')
  t.equals(dissoc('a', ''), '', 'returns falsy string with falsy string')
  t.equals(dissoc('a', 'string'), 'string', 'returns truthy string with truthy string')
  t.equals(dissoc('a', false), false, 'returns false with false')
  t.equals(dissoc('a', true), true, 'returns true with true')

  t.end()
})
