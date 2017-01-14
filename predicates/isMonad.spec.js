const test = require('tape')

const isFunction = require('./isFunction')

const identity = require('../combinators/identity')

const isMonad = require('./isMonad')

test('isMonad predicate function', t => {
  const fake = {
    map: identity,
    ap: identity,
    of: identity,
    chain: identity
  }

  t.ok(isFunction(isMonad), 'is a function')

  t.equal(isMonad(undefined), false, 'returns false for undefined')
  t.equal(isMonad(null), false, 'returns false for null')
  t.equal(isMonad(0), false, 'returns false for falsey number')
  t.equal(isMonad(1), false, 'returns false for truthy number')
  t.equal(isMonad(''), false, 'returns false for falsey string')
  t.equal(isMonad('string'), false, 'returns false for truthy string')
  t.equal(isMonad(false), false, 'returns false for false')
  t.equal(isMonad(true), false, 'returns false for true')
  t.equal(isMonad({}), false, 'returns false for an object')
  t.equal(isMonad([]), false, 'returns false for an array')
  t.equal(isMonad(identity), false, 'returns false for function')

  t.equal(isMonad(fake), true, 'returns true when a Monad is passed')

  t.end()
})
