const test = require('tape')

const isFunction = require('./isFunction')

const identity = x => x

const isFalse = require('./isFalse')

test('isFalse core', t => {
  t.ok(isFunction(isFalse))

  t.equal(isFalse(undefined), false, 'returns false for undefined')
  t.equal(isFalse(null), false, 'returns false for null')
  t.equal(isFalse(0), false, 'returns false for falsey number')
  t.equal(isFalse(1), false, 'returns false for truthy number')
  t.equal(isFalse(true), false, 'returns false for true')
  t.equal(isFalse({}), false, 'returns false for an object')
  t.equal(isFalse([]), false, 'returns false for an array')
  t.equal(isFalse(identity), false, 'returns false for function')
  t.equal(isFalse(''), false, 'returns false for falsey string')
  t.equal(isFalse('string'), false, 'returns false for truthy string')

  t.equal(isFalse(false), true, 'returns true for false')

  t.end()
})
