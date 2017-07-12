const test = require('tape')

const isFunction = require('../core/isFunction')

const isEmpty = require('./isEmpty')

test('isEmpty predicate', t => {
  t.ok(isFunction(isEmpty), 'is a function')
  t.end()
})
