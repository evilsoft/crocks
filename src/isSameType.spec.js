const test = require('tape')

const isFunction = require('./core/isFunction')
const isSameType = require('./isSameType')

test('isSameType predicate', t => {
  t.ok(isFunction(isSameType), 'is a function')
  t.end()
})
