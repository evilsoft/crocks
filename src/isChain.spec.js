const test = require('tape')

const isFunction = require('./core/isFunction')
const isChain = require('./isChain')

test('isChain predicate', t => {
  t.ok(isFunction(isChain), 'is a function')
  t.end()
})
