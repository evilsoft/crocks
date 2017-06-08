const test = require('tape')

const isFunction = require('./isFunction')

const identity = require('../combinators/identity')

const isExtend = require('./isExtend')

test('isExtend predicate function', t => {
  const fake = {
    map: identity,
    extend: identity
  }

  t.ok(isFunction(isExtend), 'is a function')

  t.equal(isExtend(undefined), false, 'returns false for undefined')
  t.equal(isExtend(null), false, 'returns false for null')
  t.equal(isExtend(0), false, 'returns false for falsey number')
  t.equal(isExtend(1), false, 'returns false for truthy number')
  t.equal(isExtend(''), false, 'returns false for falsey string')
  t.equal(isExtend('string'), false, 'returns false for truthy string')
  t.equal(isExtend(false), false, 'returns false for false')
  t.equal(isExtend(true), false, 'returns false for true')
  t.equal(isExtend({}), false, 'returns false for an object')
  t.equal(isExtend([]), false, 'returns false for an array')
  t.equal(isExtend(identity), false, 'returns false for function')

  t.equal(isExtend(fake), true, 'returns true when an Extend is passed')

  t.end()
})
