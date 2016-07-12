const test  = require('tape')
const sinon = require('sinon')

const helpers   = require('../test/helpers')
const bindFunc  = helpers.bindFunc

const k_comb = require('../combinators/k_comb')

const value = require('./value')

test('value pointfree', t => {
  const f = bindFunc(value)
  const x = 'result'
  const m = { value: sinon.spy(k_comb(x)) }

  t.equal(typeof value, 'function', 'is a function')

  t.throws(f(0), TypeError, 'throws if passed a falsey number')
  t.throws(f(1), TypeError, 'throws if passed a truthy number')
  t.throws(f(''), TypeError, 'throws if passed a falsey string')
  t.throws(f('string'), TypeError, 'throws if passed a truthy string')
  t.throws(f(false), TypeError, 'throws if passed false')
  t.throws(f(true), TypeError, 'throws if passed true')
  t.throws(f([]), TypeError, 'throws if passed an array')
  t.throws(f({}), TypeError, 'throws if passed an object')

  const result = value(m)

  t.equal(m.value.called, true, 'calls value on the passed Identity')
  t.equal(result, x, 'returns the result of calling m.value')

  t.end()
})
