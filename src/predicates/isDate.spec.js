const test = require('tape')

const isFunction = require('../core/isFunction')

const isDate = require('./isDate')

test('isDate predicate', t => {
  t.ok(isFunction(isDate), 'is a function')

  t.end()
})
