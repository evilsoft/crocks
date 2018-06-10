const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('./isFunction')

const identity = x => x

const isProfunctor = require('./isProfunctor')

test('isProfunctor core', t => {
  const Fake = makeFake([ 'map', 'contramap', 'promap' ])
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
  t.equal(isProfunctor([]), false, 'returns false for an array')
  t.equal(isProfunctor(identity), false, 'returns false for function')

  t.equal(isProfunctor(Fake), true, 'returns true when Profunctor Constructor is passed')
  t.equal(isProfunctor(fake), true, 'returns true when Profunctor is passed')

  t.end()
})

test('isProfunctor fantasy-land', t => {
  const Fake = makeFake([ 'map', 'contramap', 'promap' ], true)
  const fake = Fake()

  t.equal(isProfunctor(Fake), false, 'returns false when Profunctor Constructor is passed')
  t.equal(isProfunctor(fake), true, 'returns true when Profunctor is passed')

  t.end()
})
