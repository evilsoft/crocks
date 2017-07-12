const test = require('tape')

const isFunction = require('../core/isFunction')

const Unit = require('.')

test('Unit crock', t => {
  t.ok(isFunction(Unit), 'is a function')
  t.end()
})
