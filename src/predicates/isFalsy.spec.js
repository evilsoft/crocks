const test = require('tape')

const isFunction = require('./isFunction')

const identity = x => x

const isFalsy = require('./isFalsy')

test('isFalsy core', t => {
  t.ok(isFunction(isFalsy))

  t.equal(isFalsy(1), false, 'returns false for truthy number')
  t.equal(isFalsy(true), false, 'returns false for true')
  t.equal(isFalsy({}), false, 'returns false for an object')
  t.equal(isFalsy([]), false, 'returns false for an array')
  t.equal(isFalsy(identity), false, 'returns false for function')
  t.equal(isFalsy('string'), false, 'returns false for truthy string')
  t.equal(isFalsy(Infinity), false, 'returns false for Infinity')
  t.equal(isFalsy(new Date()), false, 'returns false for new Date')

  t.equal(isFalsy(false), true, 'returns true for false')
  t.equal(isFalsy(undefined), true, 'returns true for undefined')
  t.equal(isFalsy(null), true, 'returns true for null')
  t.equal(isFalsy(0), true, 'returns true for falsey number')
  t.equal(isFalsy(''), true, 'returns true for falsey string')
  t.equal(isFalsy(NaN), true, 'returns true for falsey string')

  t.end()
})
