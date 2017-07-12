const test = require('tape')

const isFunction = require('../core/isFunction')

const Star = require('.')

test('Star crock', t => {
  t.ok(isFunction(Star), 'is a function')
  t.end()
})
