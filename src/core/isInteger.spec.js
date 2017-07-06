const test = require('tape')

const isFunction = require('./isFunction')
const isInteger = require('./isInteger')
const unit = require('./unit')

test('isInteger predicate function', t => {
  t.ok(isFunction(isInteger), 'is a function')

  t.equal(isInteger(unit), false, 'returns false with function')
  t.equal(isInteger(undefined), false, 'returns false with undefined')
  t.equal(isInteger(null), false, 'returns false with null')
  t.equal(isInteger(''), false, 'returns false with falsey string')
  t.equal(isInteger('string'), false, 'returns false with truthy string')
  t.equal(isInteger(false), false, 'returns false with false')
  t.equal(isInteger(true), false, 'returns false with true')
  t.equal(isInteger([]), false, 'returns false with an array')
  t.equal(isInteger({}), false, 'returns false with an object')

  t.equal(isInteger(Infinity), false, 'returns false with Infinity')
  t.equal(isInteger(NaN), false, 'returns false with NaN')
  t.equal(isInteger(0.675), false, 'returns false with Float')

  t.equal(isInteger(0), true, 'returns true with falsey integer')
  t.equal(isInteger(1), true, 'returns true with truthy integer')

  t.end()
})
