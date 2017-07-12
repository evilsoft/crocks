const test = require('tape')

const isFunction = require('../core/isFunction')
const isApply = require('./isApply')

test('isApply predicate', t => {
  t.ok(isFunction(isApply), 'is a function')
  t.end()
})
