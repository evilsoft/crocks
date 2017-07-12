const test = require('tape')

const isFunction = require('../core/isFunction')

const isPromise = require('./isPromise')

test('isPromise predicate', t => {
  t.ok(isFunction(isPromise), 'is a function')
  t.end()
})
