const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('../core/isFunction')

const identity = x => x

const isProfunctor = require('./isProfunctor')

test('isProfunctor predicate function', t => {
  const Fake = makeFake([ 'contramap', 'map', 'promap' ])
  const fake = Fake()

  t.ok(isFunction(isProfunctor))

  t.equal(isProfunctor(undefined), false, 'returns false for undefined')
  t.equal(isProfunctor(null), false, 'returns false for null')
  t.equal(isProfunctor(0), false, 'returns false for falsey number')
  t.equal(isProfunctor(1), false, 'returns false for truthy number')
  t.equal(isProfunctor(''), false, 'returns false for falsey string')
  t.equal(isProfunctor('string'), false, 'returns false for truthy string')
  t.equal(isProfunctor(false), false, 'returns false for false')
  t.equal(isProfunctor(true), false, 'returns false for true')
  t.equal(isProfunctor({}), false, 'returns false for an object')
  t.equal(isProfunctor(identity), false, 'returns false for function')

  t.equal(isProfunctor(Fake), true, 'returns true when a Contravariant Functor Constructor is passed')
  t.equal(isProfunctor(fake), true, 'returns true when a Contravariant Functor is passed')

  t.end()
})
