const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const identity = require('./core/identity')
const isFunction = require('./core/isFunction')
const unit = require('./core/unit')

const map = require('./map')

test('map pointfree', t => {
  const m = bindFunc(map)
  const f = { map: unit }

  t.ok(isFunction(map), 'is a function')

  const noFunc = /map: Function required for first argument/
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

  const noFunctor = /map: Object, Function or Functor of the same type required for second argument/
  t.throws(m(unit, undefined), noFunctor, 'throws if second arg is undefined')
  t.throws(m(unit, null), noFunctor, 'throws if second arg is null')
  t.throws(m(unit, 0), noFunctor, 'throws if second arg is a falsey number')
  t.throws(m(unit, 1), noFunctor, 'throws if second arg is a truthy number')
  t.throws(m(unit, ''), noFunctor, 'throws if second arg is a falsey string')
  t.throws(m(unit, 'string'), noFunctor, 'throws if second arg is a truthy string')
  t.throws(m(unit, false), noFunctor, 'throws if second arg is false')
  t.throws(m(unit, true), noFunctor, 'throws if second arg is true')

  t.end()
})

test('map functor', t => {
  const m = { map: sinon.spy(unit) }

  map(identity)(m)

  t.ok(m.map.calledWith(identity), 'calls map on functor, passing the function')
  t.end()
})

test('map array', t => {
  const f = x => x + 1
  const m = [ 3, 4 ]

  t.same(map(f, m), [ 4, 5 ], 'applies function to each element in array')

  t.end()
})

test('map function composition', t => {
  const first = sinon.spy(x => x + 2)
  const second = sinon.spy(x => x * 10)

  const comp = map(second)(first)
  const result = comp(0)

  t.ok(isFunction(comp), 'map returns a function')
  t.ok(first.calledBefore(second), 'map calls the second function first')

  t.ok(second.calledWith(first.returnValues[0]), 'result of first is passed to the second')
  t.equal(result, second.returnValues[0], 'result of second is returned')

  t.end()
})

test('map object', t => {
  const f = x => x + 1
  const m = { a: 3, b: 4 }

  t.same(map(f, m), { a: 4, b: 5 }, 'applies function to each element in the object')

  t.end()
})
