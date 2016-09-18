const test = require('tape')
const helpers = require('../test/helpers')

const noop = helpers.noop
const isFunction = require('./isFunction')

const isUndefOrNull = require('./isUndefOrNull')

test('isUndefOrNull internal function', t => {
  t.ok(isFunction(isUndefOrNull), 'is a function')

  t.equal(isUndefOrNull(noop), false, 'returns false with function')
  t.equal(isUndefOrNull(0), false, 'returns false with falsey number')
  t.equal(isUndefOrNull(1), false, 'returns false with truthy number')
  t.equal(isUndefOrNull(''), false, 'returns false with falsey string')
  t.equal(isUndefOrNull('string'), false, 'returns false with truthy string')
  t.equal(isUndefOrNull(false), false, 'returns false with false')
  t.equal(isUndefOrNull(true), false, 'returns false with true')
  t.equal(isUndefOrNull([]), false, 'returns false with an array')
  t.equal(isUndefOrNull({}), false, 'returns false with an object')

  t.equal(isUndefOrNull(undefined), true, 'returns true with undefined')
  t.equal(isUndefOrNull(null), true, 'returns true with null')

  t.end()
})

