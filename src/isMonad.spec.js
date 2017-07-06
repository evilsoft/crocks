const test = require('tape')

const isFunction = require('./core/isFunction')
const isMonad = require('./isMonad')

test('isMonad predicate', t => {
  t.ok(isFunction(isMonad), 'is a function')
  t.end()
})
