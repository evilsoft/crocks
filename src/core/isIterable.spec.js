const test = require('tape')
const { testIterable } = require('../test/helpers')
const isFunction = require('./isFunction')

const identity = x => x
const iterable = testIterable(1, 5, 1)

const isIterable = require('./isIterable')

test('isIterable core', t => {
  t.ok(isFunction(isIterable))

  t.equal(isIterable(undefined), false, 'returns false for undefined')
  t.equal(isIterable(null), false, 'returns false for null')
  t.equal(isIterable(0), false, 'returns false for falsey number')
  t.equal(isIterable(1), false, 'returns false for truthy number')
  t.equal(isIterable(false), false, 'returns false for false')
  t.equal(isIterable(true), false, 'returns false for true')
  t.equal(isIterable({}), false, 'returns false for an object')
  t.equal(isIterable(identity), false, 'returns false for function')

  t.equal(isIterable([]), true, 'returns true for an array')
  t.equal(isIterable('string'), true, 'returns true for truthy string')
  t.equal(isIterable(''), true, 'returns true for falsey string')
  t.equal(isIterable(iterable), true, 'returns true for fake iterable')

  t.end()
})
