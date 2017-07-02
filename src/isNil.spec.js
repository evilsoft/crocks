const test = require('tape')

const isFunction = require('./core/isFunction')
const isNil = require('./isNil')

test('isNil predicate', t => {
  t.ok(isFunction(isNil), 'is a function')
  t.end()
})
