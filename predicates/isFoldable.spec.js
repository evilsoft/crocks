const test = require('tape')

const isFunction = require('./isFunction')

const identity = require('../combinators/identity')

const isFoldable = require('./isFoldable')

test('isFoldable predicate function', t => {
  const fake = { reduce: identity }

  t.ok(isFunction(isFoldable), 'is a function')

  t.equal(isFoldable(undefined), false, 'returns false for undefined')
  t.equal(isFoldable(null), false, 'returns false for null')
  t.equal(isFoldable(0), false, 'returns false for falsey number')
  t.equal(isFoldable(1), false, 'returns false for truthy number')
  t.equal(isFoldable(''), false, 'returns false for falsey string')
  t.equal(isFoldable('string'), false, 'returns false for truthy string')
  t.equal(isFoldable(false), false, 'returns false for false')
  t.equal(isFoldable(true), false, 'returns false for true')
  t.equal(isFoldable({}), false, 'returns false for an object')
  t.equal(isFoldable(identity), false, 'returns false for function')

  t.equal(isFoldable([]), true, 'returns true for an array')
  t.equal(isFoldable(fake), true, 'returns true when a Foldable structure is passed')

  t.end()
})
