const test = require('tape')

const isFunction = require('./isFunction')

const identity = require('../combinators/identity')

const isMonoid = require('./isMonoid')

test('isMonoid internal function', t => {
  const fake = { concat: identity, empty: identity }

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

  t.equal(isMonoid(fake), true, 'returns true when an Monoid is passed')

  t.end()
})
