const test = require('tape')

const isFunction = require('./isFunction')

const identity = require('../combinators/identity')

const isAlt = require('./isAlt')

test('isAlt predicate function', t => {
  const fake = {
    map: identity,
    alt: identity
  }

  t.ok(isFunction(isAlt), 'is a function')

  t.equal(isAlt(undefined), false, 'returns false for undefined')
  t.equal(isAlt(null), false, 'returns false for null')
  t.equal(isAlt(0), false, 'returns false for falsey number')
  t.equal(isAlt(1), false, 'returns false for truthy number')
  t.equal(isAlt(''), false, 'returns false for falsey string')
  t.equal(isAlt('string'), false, 'returns false for truthy string')
  t.equal(isAlt(false), false, 'returns false for false')
  t.equal(isAlt(true), false, 'returns false for true')
  t.equal(isAlt({}), false, 'returns false for an object')
  t.equal(isAlt([]), false, 'returns false for an array')
  t.equal(isAlt(identity), false, 'returns false for function')

  t.equal(isAlt(fake), true, 'returns true when an Alt is passed')

  t.end()
})
