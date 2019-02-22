const test = require('tape')

const isFunction = require('../core/isFunction')

const isTrue = require('./isTrue')

test('isTrue predicate', t => {
  t.ok(isFunction(isTrue), 'is a function')

  t.end()
})
