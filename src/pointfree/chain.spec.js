import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'



import isFunction from '../core/isFunction'
import unit from '../core/_unit'
import fl from '../core/flNames'

const constant = x => () => x

const mock = x => Object.assign({}, {
  ap: unit,
  map: unit,
  chain: sinon.spy()
}, x)

import chain from './chain'

test('chain pointfree', t => {
  const c = bindFunc(chain)
  const x = 'result'

  const m = mock({
    chain: sinon.spy(constant(x))
  })

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

  t.end()
})

test('chain with Chain', t => {
  const x = 'result'
  const f = sinon.spy()

  const m = mock({
    chain: sinon.spy(constant(x))
  })

  const res = chain(f, m)

  chain(f, m)

  t.ok(m.chain.calledWith(f), 'calls chain on Chain, passing the function')
  t.ok(m.chain.calledOn(m), 'binds chain to second argument')
  t.equal(res, x, 'returns the result of chain on Chain')

  t.end()
})

test('chain with Chain (fantasy-land)', t => {
  const x = 'result'
  const f = sinon.spy()

  const m = mock({
    [fl.chain]: sinon.spy(constant(x))
  })

  const res = chain(f, m)

  chain(f, m)

  t.ok(m[fl.chain].calledWith(f), 'calls fantasy-land/chain on Chain, passing the function')
  t.ok(m[fl.chain].calledOn(m), 'binds fantasy-land/chain to second argument')
  t.equal(res, x, 'returns the result of fantasy-land/chain on Chain')
  t.notOk(m.chain.called, 'does not call chain on second argument')

  t.end()
})

test('chain with Array', t => {
  const f = x => [ x, x + 1 ]
  const x = [ 19 ]

  const result = chain(f, x)
  const empty = chain(f, [])

  t.same(result, [ 19, 20 ], 'applys chain as expected')
  t.same(empty, [], 'does not apply chain on empty array')

  t.end()
})
