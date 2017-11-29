const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('../core/isFunction')

const identity = x => x

const isCategory = require('./isCategory')

test('isCategory predicate function', t => {
  const Fake = makeFake([ 'compose', 'id' ])
  const fake = Fake()

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

  t.equal(isCategory(Fake), true, 'returns true when a Category Constructor is passed')
  t.equal(isCategory(fake), true, 'returns true when a Category is passed')

  t.end()
})
