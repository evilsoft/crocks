const test = require('tape')

const isFunction = require('../core/isFunction')

const isMonoid = require('./isMonoid')

test('isMonoid predicate', t => {
  t.ok(isFunction(isMonoid), 'is a function')
  t.end()
})
