const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const Pred = require('../crocks/Pred')

const filter = require('./filter')

test('filter pointfree', t => {
  const m = bindFunc(filter)
  const f = { filter: noop }

  t.ok(isFunction(filter), 'is a function')

  const noFunc = /filter: Pred or predicate function required for first argument/
  t.throws(m(undefined, f), noFunc, 'throws if first arg is undefined')
  t.throws(m(null, f), noFunc, 'throws if first arg is null')
  t.throws(m(0, f), noFunc, 'throws if first arg is a falsey number')
  t.throws(m(1, f), noFunc, 'throws if first arg is a truthy number')
  t.throws(m('', f), noFunc, 'throws if first arg is a falsey string')
  t.throws(m('string', f), noFunc, 'throws if first arg is a truthy string')
  t.throws(m(false, f), noFunc, 'throws if first arg is false')
  t.throws(m(true, f), noFunc, 'throws if first arg is true')
  t.throws(m([], f), noFunc, 'throws if first arg is an array')
  t.throws(m({}, f), noFunc, 'throws if first arg is an object')

  const noData = /filter: Foldable or Object required for second argument/
  t.throws(m(noop, undefined), noData, 'throws if second arg is undefined')
  t.throws(m(noop, null), noData, 'throws if second arg is null')
  t.throws(m(noop, 0), noData, 'throws if second arg is a falsey number')
  t.throws(m(noop, 1), noData, 'throws if second arg is a truthy number')
  t.throws(m(noop, ''), noData, 'throws if second arg is a falsey string')
  t.throws(m(noop, 'string'), noData, 'throws if second arg is a truthy string')
  t.throws(m(noop, false), noData, 'throws if second arg is false')
  t.throws(m(noop, true), noData, 'throws if second arg is true')

  t.doesNotThrow(m(noop, f), 'allows a function and Foldable container')
  t.doesNotThrow(m(noop, []), 'allows a function and an array (also Foldable)')
  t.doesNotThrow(m(noop, {}), 'allows a function and an object')

  t.doesNotThrow(m(Pred(noop), f), 'allows a Pred and Foldable container')
  t.doesNotThrow(m(Pred(noop), []), 'allows a Pred and an array (also Foldable)')
  t.doesNotThrow(m(Pred(noop), {}), 'allows a Pred and an object')

  t.end()
})

test('filter Foldable', t => {
  const m = { filter: constant('called') }

  const result = filter(identity, m)

  t.equals(result, 'called', 'calls filter on Foldable, passing the function')

  t.end()
})

test('filter Array', t => {
  const ar = [ 1, 9, 56, 7 ]
  const fn = x => x >= 10
  const pred = Pred(x => x <= 10)

  t.same(filter(fn, ar), [ 56 ], 'filters as expected with a predicate function')
  t.same(filter(pred, ar), [ 1, 9, 7 ], 'filters as expected with a Pred')

  t.end()
})

test('filter Object', t => {
  const obj = { a: 23, b: 10, c: 40, d: 9 }
  const fn = x => x <= 20
  const pred = Pred(x => x >= 20)

  t.same(filter(fn, obj), { b: 10, d: 9 }, 'filters as expected with a predicate function')
  t.same(filter(pred, obj), { a: 23, c: 40 }, 'filters as expected with a Pred')

  t.end()
})
