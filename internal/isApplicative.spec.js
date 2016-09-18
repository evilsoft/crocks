const test = require('tape')

const isFunction = require('./isFunction')

const isApplicative = require('./isApplicative')
const identity = require('../combinators/identity')

test('isApplicative internal function', t => {
  const fake = {
    map: identity,
    ap: identity,
    of: identity
  }

  t.equal(isApplicative(undefined), false, 'returns false for undefined')
  t.equal(isApplicative(null), false, 'returns false for null')
  t.equal(isApplicative(0), false, 'returns false for falsey number')
  t.equal(isApplicative(1), false, 'returns false for truthy number')
  t.equal(isApplicative(''), false, 'returns false for falsey string')
  t.equal(isApplicative('string'), false, 'returns false for truthy string')
  t.equal(isApplicative(false), false, 'returns false for false')
  t.equal(isApplicative(true), false, 'returns false for true')
  t.equal(isApplicative({}), false, 'returns false for an object')
  t.equal(isApplicative([]), false, 'returns false for an array')
  t.equal(isApplicative(identity), false, 'returns false for function')

  t.equal(isApplicative(fake), true, 'returns true when an Apply is passed')

  t.end()
})
