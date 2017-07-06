const test = require('tape')

const unit = require('./unit')
const isFunction = require('./isFunction')

const isNumber = require('./isNumber')

test('isNumber core', t => {
  t.ok(isFunction(isNumber), 'is a function')

  t.equal(isNumber(unit), false, 'returns false with function')
  t.equal(isNumber(undefined), false, 'returns false with undefined')
  t.equal(isNumber(null), false, 'returns false with null')
  t.equal(isNumber(''), false, 'returns false with falsey string')
  t.equal(isNumber('string'), false, 'returns false with truthy string')
  t.equal(isNumber(false), false, 'returns false with false')
  t.equal(isNumber(true), false, 'returns false with true')
  t.equal(isNumber([]), false, 'returns false with an array')
  t.equal(isNumber({}), false, 'returns false with an object')
  t.equal(isNumber(NaN), false, 'returns false with a NaN')

  t.equal(isNumber(0), true, 'returns true with falsey number')
  t.equal(isNumber(1), true, 'returns true with truthy number')

  t.end()
})
