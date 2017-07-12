const test = require('tape')

const isFunction = require('../core/isFunction')

const isArray = require('./isArray')

test('isArray predicate', t => {
  t.ok(isFunction(isArray), 'is a function')
  t.end()
})
