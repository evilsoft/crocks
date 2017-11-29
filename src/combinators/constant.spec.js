const test = require('tape')

const isFunction = require('../core/isFunction')
const unit = () => undefined

const constant = require('./constant')

test('constant (K combinator)', t => {
  const x = 3

  t.ok(isFunction(constant), 'is a function')

  t.equal(constant(x)(undefined), x, 'returns first parameter when second is undefined')
  t.equal(constant(x)(null), x, 'returns first parameter when second is null')
  t.equal(constant(x)(0), x, 'returns first parameter when second is a falsey number')
  t.equal(constant(x)(1), x, 'returns first parameter when second is a truthy number')
  t.equal(constant(x)(''), x, 'returns first parameter when second is a falsey string')
  t.equal(constant(x)('string'), x, 'returns first parameter when second is a truthy string')
  t.equal(constant(x)(false), x, 'returns first parameter when second is false')
  t.equal(constant(x)(true), x, 'returns first parameter when second is true')
  t.equal(constant(x)([]), x, 'returns first parameter when second is an array')
  t.equal(constant(x)({}), x, 'returns first parameter when second is an object')
  t.equal(constant(x)(unit), x, 'returns first parameter when second is a function')

  t.end()
})
