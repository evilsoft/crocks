const test = require('tape')

const isFunction = require('./isFunction')
const identity = require('../combinators/identity')

const isApply = require('./isApply')

test('isApply predicate function', t => {
  const fake = { map: identity, ap: identity }

  t.equal(isApply(undefined), false, 'returns false for undefined')
  t.equal(isApply(null), false, 'returns false for null')
  t.equal(isApply(0), false, 'returns false for falsey number')
  t.equal(isApply(1), false, 'returns false for truthy number')
  t.equal(isApply(''), false, 'returns false for falsey string')
  t.equal(isApply('string'), false, 'returns false for truthy string')
  t.equal(isApply(false), false, 'returns false for false')
  t.equal(isApply(true), false, 'returns false for true')
  t.equal(isApply({}), false, 'returns false for an object')
  t.equal(isApply([]), false, 'returns false for an array')
  t.equal(isApply(identity), false, 'returns false for function')

  t.equal(isApply(fake), true, 'returns true when an Apply is passed')

  t.ok(isFunction(isApply))
  t.end()
})
