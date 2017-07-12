const test = require('tape')

const isFunction = require('../core/isFunction')
const Async = require('.')

test('Async crock', t => {
  t.ok(isFunction(Async), 'is a function')
  t.end()
})
