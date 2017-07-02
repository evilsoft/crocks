const test = require('tape')

const isFunction = require('./core/isFunction')
const isExtend = require('./isExtend')

test('isExtend predicate', t => {
  t.ok(isFunction(isExtend), 'is a function')
  t.end()
})
