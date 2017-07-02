const test = require('tape')

const isFunction = require('./core/isFunction')
const isString = require('./isString')

test('isString predicate', t => {
  t.ok(isFunction(isString), 'is a function')
  t.end()
})
