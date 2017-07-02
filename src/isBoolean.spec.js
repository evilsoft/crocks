const test = require('tape')

const isFunction = require('./core/isFunction')
const unit = require('./core/unit')

const isBoolean = require('./isBoolean')

test('isBoolean predicate function', t => {
  t.ok(isFunction(isBoolean), 'is a function')

  t.equal(isBoolean(unit), false, 'returns false with function')
  t.equal(isBoolean(undefined), false, 'returns false with undefined')
  t.equal(isBoolean(null), false, 'returns false with null')
  t.equal(isBoolean(''), false, 'returns false with falsey string')
  t.equal(isBoolean('string'), false, 'returns false with truthy string')
  t.equal(isBoolean(0), false, 'returns false with falsey number')
  t.equal(isBoolean(1), false, 'returns false with truthy number')
  t.equal(isBoolean([]), false, 'returns false with an array')
  t.equal(isBoolean({}), false, 'returns false with an object')

  t.equal(isBoolean(false), true, 'returns true with false')
  t.equal(isBoolean(true), true, 'returns true with true')

  t.end()
})
