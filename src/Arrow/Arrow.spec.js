const test = require('tape')

const isFunction = require('../core/isFunction')

const Arrow = require('.')

test('Arrow crock', t => {
  t.ok(isFunction(Arrow), 'is a function')
  t.end()
})
