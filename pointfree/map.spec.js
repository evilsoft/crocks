const test  = require('tape')
const sinon = require('sinon')

const identity = require('../combinators/identity')
const helpers = require('../test/helpers')

const bindFunc  = helpers.bindFunc
const noop      = helpers.noop

const map   = require('./map')

test('map pointfree', t => {
  const m = bindFunc(map)
  const f = { map: noop }

  t.equal(typeof map, 'function', 'is a function')

  t.throws(m(undefined, f), 'throws if first arg is undefined')
  t.throws(m(null, f), 'throws if first arg is null')
  t.throws(m(0, f), 'throws if first arg is a falsey number')
  t.throws(m(1, f), 'throws if first arg is a truthy number')
  t.throws(m('', f), 'throws if first arg is a falsey string')
  t.throws(m('string', f), 'throws if first arg is a truthy string')
  t.throws(m(false, f), 'throws if first arg is false')
  t.throws(m(true, f), 'throws if first arg is true')
  t.throws(m([], f), 'throws if first arg is an array')
  t.throws(m({}, f), 'throws if first arg is an object')

  t.throws(m(noop, undefined), 'throws if second arg is undefined')
  t.throws(m(noop, null), 'throws if second arg is null')
  t.throws(m(noop, 0), 'throws if second arg is a falsey number')
  t.throws(m(noop, 1), 'throws if second arg is a truthy number')
  t.throws(m(noop, ''), 'throws if second arg is a falsey string')
  t.throws(m(noop, 'string'), 'throws if second arg is a truthy string')
  t.throws(m(noop, false), 'throws if second arg is false')
  t.throws(m(noop, true), 'throws if second arg is true')
  t.throws(m(noop, {}), 'throws if second arg is an object')

  t.doesNotThrow(m(noop, f), 'does not throw when a function and functor passed')
  t.doesNotThrow(m(noop, []), 'does not throw when a function and an array passed')
  t.doesNotThrow(m(noop, noop), 'does not throw when two functions are passed')
  t.end()
})

test('map functor', t => {
  const m = { map: sinon.spy(noop) }

  map(identity)(m)

  t.equal(m.map.calledWith(identity), true, 'calls map on functor, passing the function')
  t.end()
})

test('map function composition', t => {
  const first   = sinon.spy(x => x + 2)
  const second  = sinon.spy(x => x * 10)

  const comp    = map(second)(first)
  const result  = comp(0)

  t.equal(typeof comp, 'function', 'map returns a function')
  t.equal(first.calledBefore(second), true, 'map calls the second function first')

  t.equal(second.calledWith(first.returnValues[0]), true, 'result of first is passed to the second')
  t.equal(result, second.returnValues[0], 'result of second is returned')

  t.end()
})
