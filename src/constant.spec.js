const test = require('tape')

const isFunction  = require('./core/isFunction')

const constant = require('./constant')

test('constant (K combinator)', t => {
  t.ok(isFunction(constant), 'is a function')
  t.end()
})
