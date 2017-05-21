const test = require('tape')

const identity = require('../combinators/identity')
const isFunction = require('./isFunction')

const isCategory = require('./isCategory')

test('isCategory predicate function', t => {
  const fake = {
    compose: identity,
    id: identity
  }

  t.ok(isFunction(isCategory))

  t.equal(isCategory(undefined), false, 'returns false for undefined')
  t.equal(isCategory(null), false, 'returns false for null')
  t.equal(isCategory(0), false, 'returns false for falsey number')
  t.equal(isCategory(1), false, 'returns false for truthy number')
  t.equal(isCategory(''), false, 'returns false for falsey string')
  t.equal(isCategory('string'), false, 'returns false for truthy string')
  t.equal(isCategory(false), false, 'returns false for false')
  t.equal(isCategory(true), false, 'returns false for true')
  t.equal(isCategory([]), false, 'returns false for an array')
  t.equal(isCategory({}), false, 'returns false for an object')
  t.equal(isCategory(identity), false, 'returns false for function')

  t.equal(isCategory(fake), true, 'returns true when a Semigroupoid is passed')

  t.end()
})
