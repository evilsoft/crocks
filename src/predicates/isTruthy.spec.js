const test = require('tape')

const isFunction = require('./isFunction')

const identity = x => x

const isTruthy = require('./isTruthy')

test('isTruthy core', t => {
  t.ok(isFunction(isTruthy))

  t.equal(isTruthy(undefined), false, 'returns false for undefined')
  t.equal(isTruthy(null), false, 'returns false for null')
  t.equal(isTruthy(0), false, 'returns false for falsey number')
  t.equal(isTruthy(false), false, 'returns false for false')
  t.equal(isTruthy(''), false, 'returns false for falsey string')
  t.equal(isTruthy(NaN), false, 'returns false for NaN')

  t.equal(isTruthy(1), true, 'returns true for truthy number')
  t.equal(isTruthy(-1), true, 'returns true for negative truthy number')
  t.equal(isTruthy(true), true, 'returns true for true')
  t.equal(isTruthy('string'), true, 'returns true for truthy string')
  t.equal(isTruthy(identity), true, 'returns true for function')
  t.equal(isTruthy([]), true, 'returns true for an array')
  t.equal(isTruthy({}), true, 'returns true for an object')
  t.equal(isTruthy(Infinity), true, 'returns true for Infinity')
  t.equal(isTruthy(new Date()), true, 'returns true for new Date')

  t.end()
})
