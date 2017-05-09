const test = require('tape')

const unit = require('../helpers/unit')
const isFunction = require('./isFunction')

const isNil = require('./isNil')

test('isNil predicate function', t => {
  t.ok(isFunction(isNil), 'is a function')

  t.equal(isNil(unit), false, 'returns false with function')
  t.equal(isNil(0), false, 'returns false with falsey number')
  t.equal(isNil(1), false, 'returns false with truthy number')
  t.equal(isNil(''), false, 'returns false with falsey string')
  t.equal(isNil('string'), false, 'returns false with truthy string')
  t.equal(isNil(false), false, 'returns false with false')
  t.equal(isNil(true), false, 'returns false with true')
  t.equal(isNil([]), false, 'returns false with an array')
  t.equal(isNil({}), false, 'returns false with an object')

  t.equal(isNil(undefined), true, 'returns true with undefined')
  t.equal(isNil(null), true, 'returns true with null')
  t.equal(isNil(NaN), true, 'returns true with NaN')

  t.end()
})

