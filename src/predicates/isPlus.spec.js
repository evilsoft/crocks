const test = require('tape')

const isFunction = require('../core/isFunction')

const isPlus = require('./isPlus')

test('isPlus predicate', t => {
  t.ok(isFunction(isPlus), 'is a function')
  t.end()
})
