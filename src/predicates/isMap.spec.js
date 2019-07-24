const test = require('tape')

const isFunction = require('../core/isFunction')

const isMap = require('./isMap')

test('isMap predicate', t => {
  t.ok(isFunction(isMap), 'is a function')
  t.end()
})
