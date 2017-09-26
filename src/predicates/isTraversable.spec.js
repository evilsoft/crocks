const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('../core/isFunction')

const identity = x => x

const isTraversable = require('./isTraversable')

test('isTraversable predicate function', t => {
  const Fake = makeFake([ 'map', 'traverse' ])
  const fake = Fake()

  t.ok(isFunction(isTraversable))

  t.equal(isTraversable(undefined), false, 'returns false for undefined')
  t.equal(isTraversable(null), false, 'returns false for null')
  t.equal(isTraversable(0), false, 'returns false for falsey number')
  t.equal(isTraversable(1), false, 'returns false for truthy number')
  t.equal(isTraversable(''), false, 'returns false for falsey string')
  t.equal(isTraversable('string'), false, 'returns false for truthy string')
  t.equal(isTraversable(false), false, 'returns false for false')
  t.equal(isTraversable(true), false, 'returns false for true')
  t.equal(isTraversable({}), false, 'returns false for an object')
  t.equal(isTraversable([]), false, 'returns false for an array')
  t.equal(isTraversable(identity), false, 'returns false for function')

  t.equal(isTraversable(Fake), true, 'returns true when a Traversable Constructor is passed')
  t.equal(isTraversable(fake), true, 'returns true when a Traversable is passed')

  t.end()
})
