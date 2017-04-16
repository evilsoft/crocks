const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const Pred = require('../crocks/Pred')

const reject = require('./reject')

test('reject pointfree', t => {
  const m = bindFunc(reject)
  const f = { reject: noop }

  t.ok(isFunction(reject), 'is a function')

  const noPred = /reject: Pred or predicate function required for first argument/
  t.throws(m(undefined, f), noPred, 'throws if first arg is undefined')
  t.throws(m(null, f), noPred, 'throws if first arg is null')
  t.throws(m(0, f), noPred, 'throws if first arg is a falsey number')
  t.throws(m(1, f), noPred, 'throws if first arg is a truthy number')
  t.throws(m('', f), noPred, 'throws if first arg is a falsey string')
  t.throws(m('string', f), noPred, 'throws if first arg is a truthy string')
  t.throws(m(false, f), noPred, 'throws if first arg is false')
  t.throws(m(true, f), noPred, 'throws if first arg is true')
  t.throws(m([], f), noPred, 'throws if first arg is an array')
  t.throws(m({}, f), noPred, 'throws if first arg is an object')

  const noData = /reject: Foldable or Object required for second argument/
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

test('reject on Array', t => {
  const fn = reject(x => x > 5)
  const pred = reject(Pred(x => x < 5))

  const xs = [ 1, 20, 15, 2 ]

  t.same(fn(xs), [ 1, 2 ], 'rejects as expected with predicate function')
  t.same(pred(xs), [ 20, 15 ], 'rejects as expected with Pred')

  t.end()
})

test('reject on Object', t => {
  const fn = reject(x => x > 5)
  const pred = reject(Pred(x => x < 5))

  const xs = { a: 1, b: 20, c: 15, d: 2 }

  t.same(fn(xs), { a: 1, d: 2 }, 'rejects as expected with predicate function')
  t.same(pred(xs), { b: 20, c: 15 }, 'rejects as expected with Pred')

  t.end()
})

test('reject on Foldable', t => {
  const f = sinon.spy(noop)
  const x = 85
  const m = { reject: f => f(x) }

  reject(f, m)

  t.ok(f.calledWith(x), 'calls reject on Foldable, passing the function')

  t.end()
})
