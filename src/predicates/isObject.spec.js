const test = require('tape')

const isFunction = require('../core/isFunction')

const isObject = require('./isObject')

test('isObject predicate', t => {
  t.ok(isFunction(isObject), 'is a function')
  t.end()
})
