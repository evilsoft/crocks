const test = require('tape')

const isFunction = require('./core/isFunction')
const isFoldable = require('./isFoldable')

test('isFoldable predicate', t => {
  t.ok(isFunction(isFoldable), 'is a function')
  t.end()
})
