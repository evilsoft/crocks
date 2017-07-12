const test = require('tape')

const unit = require('./_unit')

const isFunction = require('./isFunction')

test('isFunction core', t => {
  t.equal(typeof isFunction, 'function', 'is a function')

  t.equal(isFunction(unit), true, 'returns true when passed a function')
  t.equal(isFunction(undefined), false, 'returns false when passed undefined')
  t.equal(isFunction(null), false, 'returns false when passed null')
  t.equal(isFunction(0), false, 'returns false when passed a falsey number')
  t.equal(isFunction(1), false, 'returns false when passed a truthy number')
  t.equal(isFunction(''), false, 'returns false when passed a falsey string')
  t.equal(isFunction('string'), false, 'returns false when passed a truthy string')
  t.equal(isFunction(false), false, 'returns false when passed false')
  t.equal(isFunction(true), false, 'returns false when passed true')
  t.equal(isFunction([]), false, 'returns false when passed an array')
  t.equal(isFunction({}), false, 'returns false when passed an object')

  t.end()
})
