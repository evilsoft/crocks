const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const constant = require('../combinators/constant')

const first = require('./first')

test('first pointfree', t => {
  const f = bindFunc(first)
  const x = 'result'
  const m = { first: sinon.spy(constant(x)) }

  t.ok(isFunction(first), 'is a function')

  t.throws(f(undefined, m), 'throws if first arg is undefined')
  t.throws(f(null, m), 'throws if first arg is null')
  t.throws(f(0, m), 'throws if first arg is a falsey number')
  t.throws(f(1, m), 'throws if first arg is a truthy number')
  t.throws(f('', m), 'throws if first arg is a falsey string')
  t.throws(f('string', m), 'throws if first arg is a truthy string')
  t.throws(f(false, m), 'throws if first arg is false')
  t.throws(f(true, m), 'throws if first arg is true')
  t.throws(f([], m), 'throws if first arg is an array')
  t.throws(f({}, m), 'throws if first arg is an object')

  t.throws(f(noop, undefined), 'throws if second arg is undefined')
  t.throws(f(noop, null), 'throws if second arg is null')
  t.throws(f(noop, 0), 'throws if second arg is a falsey number')
  t.throws(f(noop, 1), 'throws if second arg is a truthy number')
  t.throws(f(noop, ''), 'throws if second arg is a falsey string')
  t.throws(f(noop, 'string'), 'throws if second arg is a truthy string')
  t.throws(f(noop, false), 'throws if second arg is false')
  t.throws(f(noop, true), 'throws if second arg is true')
  t.throws(f(noop, {}), 'throws if second arg is an object')

  t.doesNotThrow(f(noop, m), 'allows a function and Arrow')

  const g = sinon.spy()
  const res = first(g, m)

  t.ok(m.first.calledWith(g), 'calls first on Arrow, passing the function')
  t.equal(res, x, 'returns the result of first on Arrow')

  t.end()
})
