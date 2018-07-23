const test = require('tape')

const isFunction = require('../core/isFunction')

const isSymbol = require('./isSymbol')

test('isSymbol predicate', t => {
  t.ok(isFunction(isSymbol), 'is a function')
  t.end()
})
