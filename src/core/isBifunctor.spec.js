const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('./isFunction')

const identity = x => x

const isBifunctor = require('./isBifunctor')

test('isBifunctor predicate function', t => {
  const Fake = makeFake([ 'bimap', 'map' ])
  const fake = Fake()

  t.equal(isBifunctor(undefined), false, 'returns false for undefined')
  t.equal(isBifunctor(null), false, 'returns false for null')
  t.equal(isBifunctor(0), false, 'returns false for falsey number')
  t.equal(isBifunctor(1), false, 'returns false for truthy number')
  t.equal(isBifunctor(''), false, 'returns false for falsey string')
  t.equal(isBifunctor('string'), false, 'returns false for truthy string')
  t.equal(isBifunctor(false), false, 'returns false for false')
  t.equal(isBifunctor(true), false, 'returns false for true')
  t.equal(isBifunctor({}), false, 'returns false for an object')
  t.equal(isBifunctor([]), false, 'returns false for an array')
  t.equal(isBifunctor(identity), false, 'returns false for function')

  t.equal(isBifunctor(Fake), true, 'returns true when a Bifunctor Constructor is passed')
  t.equal(isBifunctor(fake), true, 'returns true when a Bifunctor is passed')

  t.ok(isFunction(isBifunctor))
  t.end()
})
