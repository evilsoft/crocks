const test = require('tape')

const isFunction = require('../core/isFunction')

const isTruthy = require('./isTruthy')

test('isTruthy predicate', t => {
  t.ok(isFunction(isTruthy), 'is a function')

  t.end()
})
