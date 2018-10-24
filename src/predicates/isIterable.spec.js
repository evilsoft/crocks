const test = require('tape')

const isFunction = require('../core/isFunction')

const isMonad = require('./isIterable')

test('isIterable predicate', t => {
  t.ok(isFunction(isMonad), 'is a function')
  t.end()
})
