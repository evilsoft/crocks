const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const constant = require('../combinators/constant')

const value = require('./value')

test('value pointfree', t => {
  const f = bindFunc(value)
  const x = 'result'
  const m = { value: sinon.spy(constant(x)) }

  t.ok(isFunction(value), 'is a function')

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
  t.throws(f(noop), TypeError, 'throws if passed a function')

  const result = value(m)

  t.ok(m.value.called, 'calls value on the passed Identity')
  t.equal(result, x, 'returns the result of calling m.value')

  t.end()
})
