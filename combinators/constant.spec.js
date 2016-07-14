const test  = require('tape')

const helpers   = require('../test/helpers')
const noop      = helpers.noop

const constant = require('./constant')

test('constant (K combinator)', t => {
  const x = 3

  t.equal(typeof constant, 'function', 'is a function')

  t.equal(constant(x, 0), x, 'returns first parameter when second is a falsey number')
  t.equal(constant(x, 1), x, 'returns first parameter when second is a truthy number')
  t.equal(constant(x, ''), x, 'returns first parameter when second is a falsey string')
  t.equal(constant(x, 'string'), x, 'returns first parameter when second is a truthy string')
  t.equal(constant(x, false), x, 'returns first parameter when second is false')
  t.equal(constant(x, true), x, 'returns first parameter when second is true')
  t.equal(constant(x, []), x, 'returns first parameter when second is an array')
  t.equal(constant(x, {}), x, 'returns first parameter when second is an object')
  t.equal(constant(x, noop), x, 'returns first parameter when second is an object')

  t.end()
})
