const test = require('tape')

const isFunction = require('./isFunction')

const identity = x => x

const isTrue = require('./isTrue')

test('isTrue core', t => {
  t.ok(isFunction(isTrue))

  t.equal(isTrue(undefined), false, 'returns false for undefined')
  t.equal(isTrue(null), false, 'returns false for null')
  t.equal(isTrue(0), false, 'returns false for falsey number')
  t.equal(isTrue(1), false, 'returns false for truthy number')
  t.equal(isTrue(false), false, 'returns false for false')
  t.equal(isTrue({}), false, 'returns false for an object')
  t.equal(isTrue([]), false, 'returns false for an array')
  t.equal(isTrue(identity), false, 'returns false for function')
  t.equal(isTrue(''), false, 'returns false for falsey string')
  t.equal(isTrue('string'), false, 'returns false for truthy string')

  t.equal(isTrue(true), true, 'returns true for true')

  t.end()
})
