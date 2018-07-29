import test from 'tape'
import { bindFunc } from '../test/helpers'

const makeFake = helpers.makeFake

import isFunction from './isFunction'

const identity = x => x

import isChain from './isChain'

test('isChain core', t => {
  const Fake = makeFake([ 'ap', 'chain', 'map' ])
  const fake = Fake()

  t.equal(isChain(undefined), false, 'returns false for undefined')
  t.equal(isChain(null), false, 'returns false for null')
  t.equal(isChain(0), false, 'returns false for falsey number')
  t.equal(isChain(1), false, 'returns false for truthy number')
  t.equal(isChain(''), false, 'returns false for falsey string')
  t.equal(isChain('string'), false, 'returns false for truthy string')
  t.equal(isChain(false), false, 'returns false for false')
  t.equal(isChain(true), false, 'returns false for true')
  t.equal(isChain({}), false, 'returns false for an object')
  t.equal(isChain([]), false, 'returns false for an array')
  t.equal(isChain(identity), false, 'returns false for function')

  t.equal(isChain(Fake), true, 'returns true when Chain Constructor is passed')
  t.equal(isChain(fake), true, 'returns true when Chain is passed')

  t.ok(isFunction(isChain))
  t.end()
})

test('isChain fantasy-land', t => {
  const Fake = makeFake([ 'ap', 'chain', 'map' ], true)
  const fake = Fake()

  t.equal(isChain(Fake), false, 'returns false when Chain Constructor is passed')
  t.equal(isChain(fake), false, 'returns false when Chain is passed')

  t.end()
})
