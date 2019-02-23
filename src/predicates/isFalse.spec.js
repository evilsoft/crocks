const test = require('tape')

const isFunction = require('../core/isFunction')

const isFalse = require('./isFalse')

test('isFalse predicate', t => {
  t.ok(isFunction(isFalse), 'is a function')

  t.end()
})
