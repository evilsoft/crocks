const test = require('tape')

const isFunction = require('../core/isFunction')

const find = require('./find')

const helpers = require('../test/helpers')

const List = require('../core/List')
const { fromArray } = List

const bindFunc = helpers.bindFunc

test('find is protected', t => {
  const fn = bindFunc(fn => find(fn, []))
  const err = /find: Function required for first argument/

  t.throws(fn(undefined), err, 'throws if foldable is undefined')
  t.throws(fn(null), err, 'throws if foldable is null')
  t.throws(fn(0), err, 'throws if foldable is falsey number')
  t.throws(fn(1), err, 'throws if foldable is truthy number')
  t.throws(fn(NaN), err, 'throws if foldable is NaN')
  t.throws(fn(''), err, 'throws if foldable is falsey string')
  t.throws(fn('string'), err, 'throws if foldable is truthy string')
  t.throws(fn(false), err, 'throws if arg is false')
  t.throws(fn(true), err, 'throws if arg is true')
  t.throws(fn({}), err, 'throws if arg is empty POJO')
  t.throws(fn({ hi: 'there' }), err, 'throws if arg is non-empty POJO')

  t.end()
})

test('find works as expected', t => {
  t.ok(isFunction(find), 'is a function')

  t.ok(isFunction(find(() => true, undefined).either), 'returns a Maybe for undefined value')
  t.ok(isFunction(find(() => true, []).either), 'returns a Maybe for array value')
  t.ok(isFunction(find(() => true, fromArray([])).either), 'returns a Maybe for List value')

  t.equal(find(() => true, undefined).either(() => 'Nothing', x => x), 'Nothing', 'returns a Nothing for undefined value')
  t.equal(find(x => x > 3, [ 1, 2, 3, 4, 5, 6 ]).either(() => 'Nothing', x => x), 4, 'returns the correct value')

  t.equal(find(x => x > 3, [ 0, null, undefined, 4, 5, 6 ]).either(() => 'Nothing', x => x), 4, 'handles bad values in foldable')
  t.equal(find(x => x > 6, [ 1, 2, 3, 4, 5, 6 ]).either(() => 'Nothing', x => x), 'Nothing', 'returns nothing when value is not found')

  t.end()
})
