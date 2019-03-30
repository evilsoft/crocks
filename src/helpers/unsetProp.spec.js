const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit =  Function.prototype

const unsetProp = require('./unsetProp')

const err =
  /unsetProp: Non-empty String required or Positive Integer required for first argument/

test('unsetProp helper function', t => {
  t.ok(isFunction(unsetProp), 'is a function')
  const fn = bindFunc(x => unsetProp(x, {}))

  t.throws(fn(undefined), err, 'throws when first arg is undefined')
  t.throws(fn(null), err, 'throws when first arg is null')
  t.throws(fn(NaN), err, 'throws when first arg is NaN')
  t.throws(fn(false, {}), err, 'throws when first arg is false')
  t.throws(fn(true, {}), err, 'throws when first arg is true')
  t.throws(fn(unit, {}), err, 'throws when first arg is a function')
  t.throws(fn({}, {}), err, 'throws when first arg is an object')
  t.throws(fn([], {}), err, 'throws when first arg is an array')

  t.end()
})

test('unsetProp with Object', t => {
  const fn = bindFunc(unsetProp)

  t.throws(fn('', {}), err, 'throws when first arg is empty string')

  const data =
    { a: true }

  const noString =
    x => unsetProp(x, data)

  t.equals(noString(0), data, 'does nothing with falsy number as first argument')
  t.equals(noString(1), data, 'does nothing with truthy number as first argument')

  const undefs = { a: undefined, b: undefined }
  t.same(unsetProp('key', undefs), {}, 'removes undefined values')

  const defs = { a: 1, b: 2 }
  t.notEqual(unsetProp('key', defs), defs, 'returns a new object')
  t.same(unsetProp('a', defs), { b: 2 }, 'returns a new object with specified key removed')

  t.end()
})

test('unsetProp with Array', t => {
  const fn = bindFunc(unsetProp)

  t.throws(fn(1.34, []), err, 'throws when first arg is float')
  t.throws(fn(-1, []), err, 'throws when first arg is negative')

  const data =
    [ 1, 2, 3 ]

  const noInteger =
    x => unsetProp(x, data)

  t.equals(noInteger('string'), data, 'does nothing with truthy string as first argument')

  const undefs = [ undefined, undefined ]
  t.same(unsetProp(0, undefs), [ undefined ], 'does not remove undefined values')

  const defs = [ 34, 99, 'string' ]
  t.same(unsetProp(3, defs), defs, 'keeps items when index does not exist')
  t.notEqual(unsetProp(3, defs), defs, 'returns a new object')

  t.same(unsetProp(1, defs), [ 34, 'string' ], 'removes item at index without holes')

  t.end()
})

test('unsetProp without Object or Array', t => {
  t.equals(unsetProp('a', undefined), undefined, 'returns undefined with undefined')
  t.equals(unsetProp('a', null), null, 'returns null with when null')
  t.ok(Number.isNaN(unsetProp('a', NaN)), 'returns NaN with NaN')
  t.equals(unsetProp('a', 0), 0, 'returns falsy number with falsy number')
  t.equals(unsetProp('a', 1), 1, 'returns truthy number with truthy number')
  t.equals(unsetProp('a', ''), '', 'returns falsy string with falsy string')
  t.equals(unsetProp('a', 'string'), 'string', 'returns truthy string with truthy string')
  t.equals(unsetProp('a', false), false, 'returns false with false')
  t.equals(unsetProp('a', true), true, 'returns true with true')

  t.end()
})
