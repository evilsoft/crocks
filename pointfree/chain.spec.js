const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../predicates/isFunction')
const unit = require('../helpers/unit')

const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const chain = require('./chain')

test('chain pointfree', t => {
  const c = bindFunc(chain)
  const x = 'result'
  const m = {
    ap: identity,
    map: identity,
    chain: sinon.spy(constant(x))
  }

  t.ok(isFunction(chain), 'is a function')

  const noFunc = /chain: Chain returning function required for first argument/
  t.throws(c(undefined, m), noFunc, 'throws if first arg is undefined')
  t.throws(c(null, m), noFunc, 'throws if first arg is null')
  t.throws(c(0, m), noFunc, 'throws if first arg is a falsey number')
  t.throws(c(1, m), noFunc, 'throws if first arg is a truthy number')
  t.throws(c('', m), noFunc, 'throws if first arg is a falsey string')
  t.throws(c('string', m), noFunc, 'throws if first arg is a truthy string')
  t.throws(c(false, m), noFunc, 'throws if first arg is false')
  t.throws(c(true, m), noFunc, 'throws if first arg is true')
  t.throws(c([], m), noFunc, 'throws if first arg is an array')
  t.throws(c({}, m), noFunc, 'throws if first arg is an object')

  const noChain = /chain: Chain of the same type required for second argument/
  t.throws(c(unit, undefined), noChain, 'throws if second arg is undefined')
  t.throws(c(unit, null), noChain, 'throws if second arg is null')
  t.throws(c(unit, 0), noChain, 'throws if second arg is a falsey number')
  t.throws(c(unit, 1), noChain, 'throws if second arg is a truthy number')
  t.throws(c(unit, ''), noChain, 'throws if second arg is a falsey string')
  t.throws(c(unit, 'string'), noChain, 'throws if second arg is a truthy string')
  t.throws(c(unit, false), noChain, 'throws if second arg is false')
  t.throws(c(unit, true), noChain, 'throws if second arg is true')
  t.throws(c(unit, {}), noChain, 'throws if second arg is an object')

  const noArray = /chain: Function must return an Array/
  t.throws(c(constant(undefined), [ 1 ]), noArray, 'throws when function returns an undefined')
  t.throws(c(constant(null), [ 1 ]), noArray, 'throws when function returns a null')
  t.throws(c(constant(0), [ 1 ]), noArray, 'throws when function returns a falsey number')
  t.throws(c(constant(1), [ 1 ]), noArray, 'throws when function returns a truthy number')
  t.throws(c(constant(''), [ 1 ]), noArray, 'throws when function returns a falsey string')
  t.throws(c(constant('string'), [ 1 ]), noArray, 'throws when function returns a truthy string')
  t.throws(c(constant(false), [ 1 ]), noArray, 'throws when function returns false')
  t.throws(c(constant(true), [ 1 ]), noArray, 'throws when function returns true')
  t.throws(c(constant({}), [ 1 ]), noArray, 'throws when function returns an object')

  t.doesNotThrow(c(unit, m), 'allows a function and Chain')

  const f = sinon.spy()
  const res = chain(f, m)

  t.ok(m.chain.calledWith(f), 'calls chain on Chain, passing the function')
  t.equal(res, x, 'returns the result of chain on Chain')

  t.end()
})

test('chain array', t => {
  const f = x => [ x, x + 1 ]
  const x = [ 19 ]

  const result = chain(f, x)
  const empty = chain(f, [])

  t.same(result, [ 19, 20 ], 'applys chain as expected')
  t.same(empty, [], 'does not apply chain on empty array')

  t.end()
})
