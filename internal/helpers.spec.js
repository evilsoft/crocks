const test = require('tape')

const internal    = require('./helpers')
const isFunction  = internal.isFunction
const isSameType  = internal.isSameType

const helpers     = require('../test/helpers')
const noop        = helpers.noop

test('isFunction internal helper', t => {
  t.equal(typeof isFunction, 'function', 'is a function')

  t.equal(isFunction(noop), true, 'returns true when passed a function')
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

test('isSameType internal helper', t => {
  const first   = { type: () => 'first' }
  const second  = { type: () => 'second' }

  t.equal(typeof isSameType, 'function', 'is a function')

  t.equal(isSameType(first, first), true, 'reports true when they are the same')
  t.equal(isSameType(first, second), false, 'reports false when they are the different containers')
  t.equal(isSameType(0, {}), false, 'reports false when both are not containers')
  t.equal(isSameType(first, []), false, 'reports false when one is not a container')

  t.end()
})
