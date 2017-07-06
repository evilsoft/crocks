const test = require('tape')

const isFunction = require('./core/isFunction')
const isApplicative = require('./isApplicative')

test('isApplicative predicate', t => {
  t.ok(isFunction(isApplicative), 'is a function')
  t.end()
})
