import test from 'tape'
import { makeFake } from '../test/helpers'

import isFunction from './isFunction'

const identity = x => x

import isApplicative from './isApplicative'

test('isApplicative predicate function', t => {
  const Fake = makeFake([ 'ap', 'map', 'of' ])
  const fake = Fake()

  t.ok(isFunction(isApplicative), 'is a function')

  t.equal(isApplicative(undefined), false, 'returns false for undefined')
  t.equal(isApplicative(null), false, 'returns false for null')
  t.equal(isApplicative(0), false, 'returns false for falsey number')
  t.equal(isApplicative(1), false, 'returns false for truthy number')
  t.equal(isApplicative(''), false, 'returns false for falsey string')
  t.equal(isApplicative('string'), false, 'returns false for truthy string')
  t.equal(isApplicative(false), false, 'returns false for false')
  t.equal(isApplicative(true), false, 'returns false for true')
  t.equal(isApplicative({}), false, 'returns false for an object')
  t.equal(isApplicative([]), false, 'returns false for an array')
  t.equal(isApplicative(identity), false, 'returns false for function')

  t.equal(isApplicative(Fake), true, 'returns true when Applicative Constructor is passed')
  t.equal(isApplicative(fake), true, 'returns true when Applicative is passed')

  t.end()
})

test('isApplicative fantasy-land', t => {
  const Fake = makeFake([ 'ap', 'map', 'of' ], true)
  const fake = Fake()

  t.equal(isApplicative(Fake), false, 'returns false when Applicative Constructor is passed')
  t.equal(isApplicative(fake), false, 'returns false when Applicative is passed')

  t.end()
})
