const test = require('tape')

const isFunction = require('./core/isFunction')
const isAlt = require('./isAlt')

test('isAlt predicate', t => {
  t.ok(isFunction(isAlt), 'is a function')
  t.end()
})
