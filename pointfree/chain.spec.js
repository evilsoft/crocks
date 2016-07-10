const test = require('tape')
const sinon = require('sinon')

const k_comb  = require('../combinators/k_comb')

const helpers = require('../test/helpers')

const bindFunc  = helpers.bindFunc
const noop      = helpers.noop

const chain = require('./chain')

test('chain pointfree', t => {
  const c = bindFunc(chain)
  const x = 'result'
  const m = { chain: sinon.spy(k_comb(x)) }

  t.equal(typeof chain, 'function', 'chain is a function')

  t.throws(c(0, m), 'throws if first arg is a falsey number')
  t.throws(c(1, m), 'throws if first arg is a truthy number')
  t.throws(c('', m), 'throws if first arg is a falsey string')
  t.throws(c('string', m), 'throws if first arg is a truthy string')
  t.throws(c(false, m), 'throws if first arg is false')
  t.throws(c(true, m), 'throws if first arg is true')
  t.throws(c([], m), 'throws if first arg is an array')
  t.throws(c({}, m), 'throws if first arg is an object')

  t.throws(c(noop, 0), 'throws if second arg is a falsey number')
  t.throws(c(noop, 1), 'throws if second arg is a truthy number')
  t.throws(c(noop, ''), 'throws if second arg is a falsey string')
  t.throws(c(noop, 'string'), 'throws if second arg is a truthy string')
  t.throws(c(noop, false), 'throws if second arg is false')
  t.throws(c(noop, true), 'throws if second arg is true')
  t.throws(c(noop, {}), 'throws if second arg is an object')

  t.doesNotThrow(c(noop, m), 'does not throw when a function and chain passed')

  const f   = sinon.spy()
  const res = chain(f, m)

  t.equal(m.chain.calledWith(f), true, 'calls chain on Chain, passing the function')
  t.equal(res, x, 'returns the result of chain on Chain')

  t.end()
})
