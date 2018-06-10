const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('./isFunction')

const identity = x => x

const isMonad = require('./isMonad')

test('isMonad predicate function', t => {
  const Fake = makeFake([ 'ap', 'chain', 'map', 'of' ])
  const fake = Fake()

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

  t.equal(isMonad(Fake), true, 'returns true when Monad Constructor is passed')
  t.equal(isMonad(fake), true, 'returns true when Monad is passed')

  t.end()
})

test('isMonad fantasy-land', t => {
  const Fake = makeFake([ 'ap', 'chain', 'map', 'of' ], true)
  const fake = Fake()

  t.equal(isMonad(Fake), false, 'returns false when Monad Constructor is passed')
  t.equal(isMonad(fake), false , 'returns false when Monad is passed')

  t.end()
})
