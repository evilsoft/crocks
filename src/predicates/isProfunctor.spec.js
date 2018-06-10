const test = require('tape')

const isFunction = require('../core/isFunction')

const isProfunctor = require('./isProfunctor')

test('isProfunctor predicate function', t => {
  t.ok(isFunction(isProfunctor), 'is a function')
  t.end()
})
