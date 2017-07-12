const test = require('tape')

const isFunction = require('../core/isFunction')

const isBifunctor = require('./isBifunctor')

test('isBifunctor predicate', t => {
  t.ok(isFunction(isBifunctor), 'is a function')
  t.end()
})
