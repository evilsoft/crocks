const test = require('tape')

const isFunction = require('../core/isFunction')
const coreIsIterable = require('../core/isIterable')

const isIterable = require('./isIterable')

test('isIterable predicate', t => {
  t.ok(isFunction(isIterable), 'is a function')
  t.equal(isIterable, coreIsIterable, 'is exposing the expected function')

  t.end()
})
