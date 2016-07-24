const test = require('tape')

const isFunction = require('./isFunction')

const identity = require('../combinators/identity')

const isString = require('./isString')

test('isString internal function', t => {

  t.ok(isFunction(isString))

  t.equal(isString(undefined), false, 'returns false for undefined')
  t.equal(isString(null), false, 'returns false for null')
  t.equal(isString(0), false, 'returns false for falsey number')
  t.equal(isString(1), false, 'returns false for truthy number')
  t.equal(isString(false), false, 'returns false for false')
  t.equal(isString(true), false, 'returns false for true')
  t.equal(isString({}), false, 'returns false for an object')
  t.equal(isString([]), false, 'returns false for an array')
  t.equal(isString(identity), false, 'returns false for function')

  t.equal(isString(''), true, 'returns true for falsey string')
  t.equal(isString('string'), true, 'returns true for truthy string')

  t.end()
})
