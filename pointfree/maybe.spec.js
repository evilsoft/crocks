const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const constant = require('../combinators/constant')

const maybe = require('./maybe')

test('maybe pointfree', t => {
  const f = bindFunc(maybe)
  const x = 'result'
  const m = { maybe: sinon.spy(constant(x)) }

  t.ok(isFunction(maybe), 'is a function')

  t.throws(f(undefined), TypeError, 'throws if passed undefined')
  t.throws(f(null), TypeError, 'throws if passed null')
  t.throws(f(0), TypeError, 'throws if passed a falsey number')
  t.throws(f(1), TypeError, 'throws if passed a truthy number')
  t.throws(f(''), TypeError, 'throws if passed a falsey string')
  t.throws(f('string'), TypeError, 'throws if passed a truthy string')
  t.throws(f(false), TypeError, 'throws if passed false')
  t.throws(f(true), TypeError, 'throws if passed true')
  t.throws(f([]), TypeError, 'throws if passed an array')
  t.throws(f({}), TypeError, 'throws if passed an object')

  const result = maybe(m)

  t.ok(m.maybe.called, 'calls maybe on the passed Maybe')
  t.equal(result, x, 'returns the result of calling m.maybe')

  t.end()
})
