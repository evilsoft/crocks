const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const second = require('./second')

test('second pointfree', t => {
  const s = bindFunc(second)
  const x = 'result'
  const m = { second: sinon.spy(constant(x)) }

  t.ok(isFunction(second), 'is a function')

  t.throws(s(undefined, m), 'throws if first arg is undefined')
  t.throws(s(null, m), 'throws if first arg is null')
  t.throws(s(0, m), 'throws if first arg is a falsey number')
  t.throws(s(1, m), 'throws if first arg is a truthy number')
  t.throws(s('', m), 'throws if first arg is a falsey string')
  t.throws(s('string', m), 'throws if first arg is a truthy string')
  t.throws(s(false, m), 'throws if first arg is false')
  t.throws(s(true, m), 'throws if first arg is true')
  t.throws(s([], m), 'throws if first arg is an array')
  t.throws(s({}, m), 'throws if first arg is an object')

  t.throws(s(noop, undefined), 'throws if second arg is undefined')
  t.throws(s(noop, null), 'throws if second arg is null')
  t.throws(s(noop, 0), 'throws if second arg is a falsey number')
  t.throws(s(noop, 1), 'throws if second arg is a truthy number')
  t.throws(s(noop, ''), 'throws if second arg is a falsey string')
  t.throws(s(noop, 'string'), 'throws if second arg is a truthy string')
  t.throws(s(noop, false), 'throws if second arg is false')
  t.throws(s(noop, true), 'throws if second arg is true')
  t.throws(s(noop, {}), 'throws if second arg is an object')

  t.doesNotThrow(s(noop, m), 'allows a function and Arrow')

  const g = sinon.spy()
  const res = second(g, m)

  t.ok(m.second.calledWith(g), 'calls second on Arrow, passing the function')
  t.equal(res, x, 'returns the result of second on Arrow')

  t.end()
})
