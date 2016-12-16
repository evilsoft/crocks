const test = require('tape')

const isFunction = require('./isFunction')
const identity = require('../combinators/identity')

const isFunctor = require('./isFunctor')

test('isFunctor internal function', t => {
  const fake = { map: identity }

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

  t.equal(isFunctor(fake), true, 'returns true when a Functor is passed')
  t.equal(isFunctor([]), true, 'returns true for an array')

  t.ok(isFunction(isFunctor))

  t.end()
})
