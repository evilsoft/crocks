import test from 'tape'
import { makeFake } from '../test/helpers'

import isFunction from './isFunction'

const identity = x => x

import isFunctor from './isFunctor'

test('isFunctor core', t => {
  const Fake = makeFake([ 'map' ])
  const fake = Fake()

  t.ok(isFunction(isFunctor))

  t.equal(isFunctor(undefined), false, 'returns false for undefined')
  t.equal(isFunctor(null), false, 'returns false for null')
  t.equal(isFunctor(0), false, 'returns false for falsey number')
  t.equal(isFunctor(1), false, 'returns false for truthy number')
  t.equal(isFunctor(''), false, 'returns false for falsey string')
  t.equal(isFunctor('string'), false, 'returns false for truthy string')
  t.equal(isFunctor(false), false, 'returns false for false')
  t.equal(isFunctor(true), false, 'returns false for true')
  t.equal(isFunctor({}), false, 'returns false for an object')
  t.equal(isFunctor(identity), false, 'returns false for function')

  t.equal(isFunctor([]), true, 'returns true for an array')
  t.equal(isFunctor(Fake), true, 'returns true when Functor Constructor is passed')
  t.equal(isFunctor(fake), true, 'returns true when Functor is passed')

  t.end()
})

test('isFunctor fantasy-land', t => {
  const Fake = makeFake([ 'map' ], true)
  const fake = Fake()

  t.equal(isFunctor(Fake), false, 'returns false when Functor Constructor is passed')
  t.equal(isFunctor(fake), true, 'returns true when Functor is passed')

  t.end()
})
