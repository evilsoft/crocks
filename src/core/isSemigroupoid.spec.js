import test from 'tape'
import { bindFunc } from '../test/helpers'

const makeFake = helpers.makeFake

import isFunction from './isFunction'

const identity = x => x

import isSemigroupoid from './isSemigroupoid'

test('isSemigroupoid predicate', t => {
  const Fake = makeFake([ 'compose' ])
  const fake = Fake()

  t.ok(isFunction(isSemigroupoid))

  t.equal(isSemigroupoid(undefined), false, 'returns false for undefined')
  t.equal(isSemigroupoid(null), false, 'returns false for null')
  t.equal(isSemigroupoid(0), false, 'returns false for falsey number')
  t.equal(isSemigroupoid(1), false, 'returns false for truthy number')
  t.equal(isSemigroupoid(''), false, 'returns false for falsey string')
  t.equal(isSemigroupoid('string'), false, 'returns false for truthy string')
  t.equal(isSemigroupoid(false), false, 'returns false for false')
  t.equal(isSemigroupoid(true), false, 'returns false for true')
  t.equal(isSemigroupoid([]), false, 'returns false for an array')
  t.equal(isSemigroupoid({}), false, 'returns false for an object')
  t.equal(isSemigroupoid(identity), false, 'returns false for function')

  t.equal(isSemigroupoid(Fake), true, 'returns true when Semigroupoid Constructor is passed')
  t.equal(isSemigroupoid(fake), true, 'returns true when Semigroupoid is passed')

  t.end()
})

test('isSemigroupoid fantasy-land', t => {
  const Fake = makeFake([ 'compose' ], true)
  const fake = Fake()

  t.equal(isSemigroupoid(Fake), false, 'returns true when Semigroupoid Constructor is passed')
  t.equal(isSemigroupoid(fake), true, 'returns true when Semigroupoid is passed')

  t.end()
})
