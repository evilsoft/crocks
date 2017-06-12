const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const identity = require('../combinators/identity')
const isFunction = require('./isFunction')

const isMonoid = require('./isMonoid')

test('isMonoid predicate function', t => {
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

  t.equal(isMonoid(Fake), true, 'returns true when an Monoid Constructor is passed')
  t.equal(isMonoid(fake), true, 'returns true when an Monoid is passed')

  t.end()
})
