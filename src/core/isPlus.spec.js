const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('./isFunction')

const identity = x => x

const isPlus = require('./isPlus')

test('isPlus predicate function', t => {
  const Fake = makeFake([ 'alt', 'map', 'zero' ])
  const fake = Fake()

  t.ok(isFunction(isPlus))

  t.equal(isPlus(undefined), false, 'returns false for undefined')
  t.equal(isPlus(null), false, 'returns false for null')
  t.equal(isPlus(0), false, 'returns false for falsey number')
  t.equal(isPlus(1), false, 'returns false for truthy number')
  t.equal(isPlus(''), false, 'returns false for falsey string')
  t.equal(isPlus('string'), false, 'returns false for truthy string')
  t.equal(isPlus(false), false, 'returns false for false')
  t.equal(isPlus(true), false, 'returns false for true')
  t.equal(isPlus({}), false, 'returns false for an object')
  t.equal(isPlus([]), false, 'returns false for an array')
  t.equal(isPlus(identity), false, 'returns false for function')

  t.equal(isPlus(Fake), true, 'returns true when Plus Constructor is passed')
  t.equal(isPlus(fake), true, 'returns true when Plus is passed')

  t.end()
})

test('isPlus fantasy-land', t => {
  const Fake = makeFake([ 'alt', 'map', 'zero' ], true)
  const fake = Fake()

  t.equal(isPlus(Fake), false, 'returns true when Plus Constructor is passed')
  t.equal(isPlus(fake), true, 'returns true when Plus is passed')

  t.end()
})
