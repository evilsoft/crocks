const test = require('tape')

const isFunction = require('../core/isFunction')

const List = require('.')

test('List crock', t => {
  t.ok(isFunction(List), 'is a function')
  t.end()
})
