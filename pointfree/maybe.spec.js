const test  = require('tape')
const sinon = require('sinon')

const helpers   = require('../test/helpers')
const bindFunc  = helpers.bindFunc

const constant = require('../combinators/constant')

const maybe = require('./maybe')

test('maybe pointfree', t => {
  const f = bindFunc(maybe)
  const x = 'result'
  const m = { maybe: sinon.spy(constant(x)) }

  t.equal(typeof maybe, 'function', 'is a function')

  t.throws(f(0), TypeError, 'throws if passed a falsey number')
  t.throws(f(1), TypeError, 'throws if passed a truthy number')
  t.throws(f(''), TypeError, 'throws if passed a falsey string')
  t.throws(f('string'), TypeError, 'throws if passed a truthy string')
  t.throws(f(false), TypeError, 'throws if passed false')
  t.throws(f(true), TypeError, 'throws if passed true')
  t.throws(f([]), TypeError, 'throws if passed an array')
  t.throws(f({}), TypeError, 'throws if passed an object')

  const result = maybe(m)

  t.equal(m.maybe.called, true, 'calls maybe on the passed Maybe')
  t.equal(result, x, 'returns the result of calling m.maybe')

  t.end()
})
