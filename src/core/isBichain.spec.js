const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('./isFunction')

const identity = x => x

const isBichain = require('./isBichain')

test('isBichain predicate function', t => {
  const Fake = makeFake([ 'bichain' ])
  const fake = Fake()

  t.equal(isBichain(undefined), false, 'returns false for undefined')
  t.equal(isBichain(null), false, 'returns false for null')
  t.equal(isBichain(0), false, 'returns false for falsey number')
  t.equal(isBichain(1), false, 'returns false for truthy number')
  t.equal(isBichain(''), false, 'returns false for falsey string')
  t.equal(isBichain('string'), false, 'returns false for truthy string')
  t.equal(isBichain(false), false, 'returns false for false')
  t.equal(isBichain(true), false, 'returns false for true')
  t.equal(isBichain({}), false, 'returns false for an object')
  t.equal(isBichain([]), false, 'returns false for an array')
  t.equal(isBichain(identity), false, 'returns false for function')

  t.equal(isBichain(Fake), true, 'returns true when Bifunctor Constructor is passed')
  t.equal(isBichain(fake), true, 'returns true when Bifunctor is passed')

  t.ok(isFunction(isBichain))
  t.end()
})
