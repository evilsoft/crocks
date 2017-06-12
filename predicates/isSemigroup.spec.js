const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const identity = require('../combinators/identity')
const isFunction = require('./isFunction')

const isSemigroup = require('./isSemigroup')

test('isSemigroup predicate function', t => {
  const Fake = makeFake([ 'concat' ])
  const fake = Fake()

  t.ok(isFunction(isSemigroup))

  t.equal(isSemigroup(undefined), false, 'returns false for undefined')
  t.equal(isSemigroup(null), false, 'returns false for null')
  t.equal(isSemigroup(0), false, 'returns false for falsey number')
  t.equal(isSemigroup(1), false, 'returns false for truthy number')
  t.equal(isSemigroup(false), false, 'returns false for false')
  t.equal(isSemigroup(true), false, 'returns false for true')
  t.equal(isSemigroup({}), false, 'returns false for an object')
  t.equal(isSemigroup(identity), false, 'returns false for function')

  t.equal(isSemigroup(''), true, 'returns true for falsey string')
  t.equal(isSemigroup('string'), true, 'returns true for truthy string')
  t.equal(isSemigroup([]), true, 'returns true for an array')

  t.equal(isSemigroup(Fake), true, 'returns true when a Semigroup Constructor is passed')
  t.equal(isSemigroup(fake), true, 'returns true when a Semigroup is passed')

  t.end()
})
