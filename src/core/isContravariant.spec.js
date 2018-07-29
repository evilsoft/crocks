import test from 'tape'
import { bindFunc } from '../test/helpers'

import isFunction from './isFunction'

const makeFake = helpers.makeFake

const identity = x => x

import isExtend from './isExtend'

test('isExtend predicate function', t => {
  const Fake = makeFake([ 'map', 'extend' ])
  const fake = Fake()

  t.ok(isFunction(isExtend), 'is a function')

  t.equal(isExtend(undefined), false, 'returns false for undefined')
  t.equal(isExtend(null), false, 'returns false for null')
  t.equal(isExtend(0), false, 'returns false for falsey number')
  t.equal(isExtend(1), false, 'returns false for truthy number')
  t.equal(isExtend(''), false, 'returns false for falsey string')
  t.equal(isExtend('string'), false, 'returns false for truthy string')
  t.equal(isExtend(false), false, 'returns false for false')
  t.equal(isExtend(true), false, 'returns false for true')
  t.equal(isExtend({}), false, 'returns false for an object')
  t.equal(isExtend([]), false, 'returns false for an array')
  t.equal(isExtend(identity), false, 'returns false for function')

  t.equal(isExtend(Fake), true, 'returns true when Extend Constructor is passed')
  t.equal(isExtend(fake), true, 'returns true when Extend is passed')

  t.end()
})

test('isExtend fantasy-land', t => {
  const Fake = makeFake([ 'map', 'extend' ], true)
  const fake = Fake()

  t.equal(isExtend(Fake), false, 'returns false when Extend Constructor is passed')
  t.equal(isExtend(fake), true, 'returns true when Extend is passed')

  t.end()
})
