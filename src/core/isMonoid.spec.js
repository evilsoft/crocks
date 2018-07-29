import test from 'tape'
import { bindFunc } from '../test/helpers'

const makeFake = helpers.makeFake

import isFunction from './isFunction'

const identity = x => x

import isMonoid from './isMonoid'

test('isMonoid core', t => {
  const Fake = makeFake([ 'concat', 'empty' ])
  const fake = Fake()

  t.ok(isFunction(isMonoid))

  t.equal(isMonoid(undefined), false, 'returns false for undefined')
  t.equal(isMonoid(null), false, 'returns false for null')
  t.equal(isMonoid(0), false, 'returns false for falsey number')
  t.equal(isMonoid(1), false, 'returns false for truthy number')
  t.equal(isMonoid(''), false, 'returns false for falsey string')
  t.equal(isMonoid('string'), false, 'returns false for truthy string')
  t.equal(isMonoid(false), false, 'returns false for false')
  t.equal(isMonoid(true), false, 'returns false for true')
  t.equal(isMonoid({}), false, 'returns false for an object')
  t.equal(isMonoid([]), false, 'returns false for an array')
  t.equal(isMonoid(identity), false, 'returns false for function')

  t.equal(isMonoid(Fake), true, 'returns true when Monoid Constructor is passed')
  t.equal(isMonoid(fake), true, 'returns true when Monoid is passed')

  t.end()
})

test('isMonoid fantasy-land', t => {
  const Fake = makeFake([ 'concat', 'empty' ], true)
  const fake = Fake()

  t.equal(isMonoid(Fake), false, 'returns false when Monoid Constructor is passed')
  t.equal(isMonoid(fake), true, 'returns true when Monoid is passed')

  t.end()
})
