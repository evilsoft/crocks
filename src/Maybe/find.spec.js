const test = require('tape')

const Pred = require('../Pred')
const List = require('../core/List')
const Maybe = require('../core/Maybe')

const constant = require('../combinators/constant')
const find = require('./find')
const isFunction = require('../core/isFunction')
const isNumber = require('../core/isNumber')
const isSameType = require('../core/isSameType')

const { bindFunc } = require('../test/helpers')
const { fromArray } = List

test('find is protected from bad fn', t => {
  const fn = bindFunc(fn => find(fn, []))
  const err = /^TypeError: find: First argument must be a Pred or predicate/

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
  const err = /^TypeError: find: Second argument must be a Foldable/

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
  const largeNumber =
    Pred(isNumber).concat(Pred(x => x > 100))

  const wrapPred =
    fn => find(Pred(fn))

  const gt3 =
    wrapPred(x => x > 3)

  const isTrue =
    wrapPred(constant(true))

  t.equal(find(largeNumber, [ 10, '12', 150, 200, 2000 ]).option(0), 150, 'works with predicates')
  t.ok(isSameType(Maybe, isTrue([])), 'returns a Maybe for array value')
  t.ok(isSameType(Maybe, isTrue(fromArray([]))), 'returns a Maybe for List value')
  t.equal(gt3([ 1, 2, 3, 4, 5, 6 ]).option('Nothing'), 4, 'returns the correct value')
  t.equal(gt3([ 0, null, undefined, 4, 5, 6 ]).option('Nothing'), 4, 'handles bad values in foldable')
  t.equal(gt3([ 1, 2, 3 ]).option('Nothing'), 'Nothing', 'returns nothing when value is not found')
  t.equal(isTrue([]).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items ([])')
  t.equal(isTrue(new Array()).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items (Array)')
  t.equal(isTrue(fromArray([])).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items (List)')

  t.end()
})

test('find works as expected', t => {
  const gt3 =
    find(x => x > 3)

  const isTrue =
    find(constant(true))

  t.ok(isFunction(find), 'is a function')

  t.ok(isSameType(Maybe, isTrue([])), 'returns a Maybe for array value')
  t.ok(isSameType(Maybe, isTrue(fromArray([]))), 'returns a Maybe for List value')

  t.equal(gt3([ 1, 2, 3, 4, 5, 6 ]).option('Nothing'), 4, 'returns the correct value')

  t.equal(gt3([ 0, null, undefined, 4, 5, 6 ]).option('Nothing'), 4, 'handles bad values in foldable')
  t.equal(gt3([ 1, 2, 3 ]).option('Nothing'), 'Nothing', 'returns nothing when value is not found')
  t.equal(isTrue([]).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items ([])')
  t.equal(isTrue(new Array()).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items (Array)')
  t.equal(isTrue(fromArray([])).option('Nothing'), 'Nothing', 'returns a Nothing when there are no items (List)')

  t.end()
})
