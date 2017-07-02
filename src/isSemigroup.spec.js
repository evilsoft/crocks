const test = require('tape')

const isFunction = require('./core/isFunction')
const isSemigroup = require('./isSemigroup')

test('isSemigroup predicate', t => {
  t.ok(isFunction(isSemigroup), 'is a function')
  t.end()
})
