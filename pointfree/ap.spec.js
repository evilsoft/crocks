const test  = require('tape')
const sinon = require('sinon')

const i_comb = require('../combinators/i_comb')

const helpers   = require('../test/helpers')
const bindFunc  = helpers.bindFunc

const ap  = require('./ap')

test('ap pointfree', t => {
  const a = bindFunc(ap)
  const m = { ap: i_comb }

  t.equal(typeof ap, 'function', 'is a function')

  t.throws(a(0, m), TypeError, 'throws if first arg is a falsey number')
  t.throws(a(1, m), TypeError, 'throws if first arg is a truthy number')
  t.throws(a('', m), TypeError, 'throws if first arg is a falsey number')
  t.throws(a('string', m), TypeError, 'throws if first arg is a truthy number')
  t.throws(a(false, m), TypeError, 'throws if first arg is false')
  t.throws(a(true, m), TypeError, 'throws if first arg is true')
  t.throws(a([], m), TypeError, 'throws if first arg is an array')
  t.throws(a({}, m), TypeError, 'throws if first arg is an object without an ap method')

  t.throws(a(m, 0), TypeError, 'throws if second arg is a falsey number')
  t.throws(a(m, 1), TypeError, 'throws if second arg is a truthy number')
  t.throws(a(m, ''), TypeError, 'throws if second arg is a falsey number')
  t.throws(a(m, 'string'), TypeError, 'throws if second arg is a truthy number')
  t.throws(a(m, false), TypeError, 'throws if second arg is false')
  t.throws(a(m, true), TypeError, 'throws if second arg is true')
  t.throws(a(m, []), TypeError, 'throws if second arg is an array')
  t.throws(a(m, {}), TypeError, 'throws if second arg is an object without an ap method')

  t.end()
})

test('ap applicative', t => {
  const m = { ap: sinon.spy(i_comb) }
  const x = { ap: sinon.spy(i_comb) }

  const result = ap(m)(x)

  t.equal(x.ap.calledWith(m), true, 'calls the ap method on the second arg passing in the first arg')

  t.end()
})
