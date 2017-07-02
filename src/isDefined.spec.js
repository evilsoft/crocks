const test = require('tape')

const isFunction = require('./core/isFunction')
const isDefined = require('./isDefined')

test('isDefined predicate', t => {
  t.ok(isFunction(isDefined), 'is a function')
  t.end()
})
