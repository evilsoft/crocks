import test from 'tape'
import { bindFunc } from '../test/helpers'

const makeFake = helpers.makeFake

import isFunction from './isFunction'

const identity = x => x

import isApply from './isApply'

test('isApply core', t => {
  const Fake = makeFake([ 'ap', 'map' ])
  const fake = Fake()

  t.equal(isApply(undefined), false, 'returns false for undefined')
  t.equal(isApply(null), false, 'returns false for null')
  t.equal(isApply(0), false, 'returns false for falsey number')
  t.equal(isApply(1), false, 'returns false for truthy number')
  t.equal(isApply(''), false, 'returns false for falsey string')
  t.equal(isApply('string'), false, 'returns false for truthy string')
  t.equal(isApply(false), false, 'returns false for false')
  t.equal(isApply(true), false, 'returns false for true')
  t.equal(isApply({}), false, 'returns false for an object')
  t.equal(isApply([]), false, 'returns false for an array')
  t.equal(isApply(identity), false, 'returns false for function')

  t.equal(isApply(Fake), true, 'returns true when Apply Constructor is passed')
  t.equal(isApply(fake), true, 'returns true when Apply is passed')

  t.ok(isFunction(isApply))
  t.end()
})

test('isApply fantasy-land', t => {
  const Fake = makeFake([ 'ap', 'map' ], true)
  const fake = Fake()

  t.equal(isApply(Fake), false, 'returns false when Apply Constructor is passed')
  t.equal(isApply(fake), false, 'returns false when Apply is passed')

  t.ok(isFunction(isApply))
  t.end()
})
