const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const first = require('./first')

test('first pointfree', t => {
  const f = bindFunc(first)

  const x = 'result'
  const m = { first: sinon.spy(constant(x)) }

  t.ok(isFunction(first), 'is a function')

  t.throws(f(undefined), 'throws if arg is undefined')
  t.throws(f(null), 'throws if arg is null')
  t.throws(f(0), 'throws if arg is a falsey number')
  t.throws(f(1), 'throws if arg is a truthy number')
  t.throws(f(''), 'throws if arg is a falsey string')
  t.throws(f('string'), 'throws if arg is a truthy string')
  t.throws(f(false), 'throws if arg is false')
  t.throws(f(true), 'throws if arg is true')
  t.throws(f({}), 'throws if arg is an object')

  t.doesNotThrow(f(m), 'allows an Arrow')

  const res = first(m)

  t.ok(m.first.called, 'calls first on Arrow')
  t.equal(res, x, 'returns the result of first on Arrow')

  t.end()
})
