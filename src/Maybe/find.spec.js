const test = require('tape')

const isFunction = require('../core/isFunction')
const constant = require('../combinators/constant')
const isSameType = require('../core/isSameType')
const Pred = require('../Pred')
const find = require('./find')
const Maybe = require('../core/Maybe')
const helpers = require('../test/helpers')
const List = require('../core/List')
const isNumber = require('../core/isNumber')

const { fromArray } = List

const bindFunc = helpers.bindFunc

test('find is protected from bad fn', t => {
  const fn = bindFunc(fn => find(fn, []))
  const err = /find: Pred or a predicate function is required for first argument/

  t.throws(fn(undefined), err, 'throws if fn is undefined')
  t.throws(fn(null), err, 'throws if fn is null')
  t.throws(fn(0), err, 'throws if fn is falsey number')
  t.throws(fn(1), err, 'throws if fn is truthy number')
  t.throws(fn(NaN), err, 'throws if fn is NaN')
  t.throws(fn(''), err, 'throws if fn is falsey string')
  t.throws(fn('string'), err, 'throws if fn is truthy string')
  t.throws(fn(false), err, 'throws if fn is false')
  t.throws(fn(true), err, 'throws if fn is true')
  t.throws(fn({}), err, 'throws if fn is empty POJO')
  t.throws(fn({ hi: 'there' }), err, 'throws if fn is non-empty POJO')

  t.end()
})

test('find is protected from bad foldable', t => {
  const fn = bindFunc(v => find(() => true, v))
  const err = /find: Foldable required for second argument/

  t.throws(fn(undefined), err, 'throws if foldable is undefined')
  t.throws(fn(null), err, 'throws if foldable is null')
  t.throws(fn(0), err, 'throws if foldable is falsey number')
  t.throws(fn(1), err, 'throws if foldable is truthy number')
  t.throws(fn(NaN), err, 'throws if foldable is NaN')
  t.throws(fn(''), err, 'throws if foldable is falsey string')
  t.throws(fn('string'), err, 'throws if foldable is truthy string')
  t.throws(fn(false), err, 'throws if foldable is false')
  t.throws(fn(true), err, 'throws if foldable is true')
  t.throws(fn({}), err, 'throws if foldable is empty POJO')
  t.throws(fn({ hi: 'there' }), err, 'throws if foldable is non-empty POJO')

  t.end()
})

test('find works with predicates', t => {
  const largeNumber = Pred(isNumber).concat(Pred(x => x > 100))
  const nonBoolPred =
    x => Pred(constant(x))
  const findWrapPred =
    (fn, foldable) => find(Pred(fn), foldable)

  t.equal(find(largeNumber, [ 10, '12', 150, 200, 2000 ]).option(0), 150, 'works with predicates')

  t.equals(find(nonBoolPred(undefined), []).option('Nothing'), 'Nothing', 'returns false when wrapped function returns undefined')

  t.ok(isSameType(Maybe, findWrapPred(() => true, [])), 'returns a Maybe for array value')
  t.ok(isSameType(Maybe, findWrapPred(() => true, fromArray([]))), 'returns a Maybe for List value')

  t.equal(findWrapPred(x => x > 3, [ 1, 2, 3, 4, 5, 6 ]).option('Nothing'), 4, 'returns the correct value')

  t.equal(findWrapPred(x => x > 3, [ 0, null, undefined, 4, 5, 6 ]).option('Nothing'), 4, 'handles bad values in foldable')
  t.equal(findWrapPred(x => x > 6, [ 1, 2, 3, 4, 5, 6 ]).option('Nothing'), 'Nothing', 'returns nothing when value is not found')
  t.equal(findWrapPred(() => true, []).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items ([])')
  t.equal(findWrapPred(() => true, new Array()).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items (Array)')
  t.equal(findWrapPred(() => true, fromArray([])).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items (List)')


  t.end()
})

test('find works as expected', t => {
  t.ok(isFunction(find), 'is a function')

  t.ok(isSameType(Maybe, find(() => true, [])), 'returns a Maybe for array value')
  t.ok(isSameType(Maybe, find(() => true, fromArray([]))), 'returns a Maybe for List value')

  t.equal(find(x => x > 3, [ 1, 2, 3, 4, 5, 6 ]).option('Nothing'), 4, 'returns the correct value')

  t.equal(find(x => x > 3, [ 0, null, undefined, 4, 5, 6 ]).option('Nothing'), 4, 'handles bad values in foldable')
  t.equal(find(x => x > 6, [ 1, 2, 3, 4, 5, 6 ]).option('Nothing'), 'Nothing', 'returns nothing when value is not found')
  t.equal(find(() => true, []).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items ([])')
  t.equal(find(() => true, new Array()).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items (Array)')
  t.equal(find(() => true, fromArray([])).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items (List)')

  t.end()
})
