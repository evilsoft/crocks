const test = require('tape')

const isFunction = require('./core/isFunction')
const isFunctor = require('./isFunctor')

test('isFunctor predicate', t => {
  t.ok(isFunction(isFunctor), 'is a function')
  t.end()
})
