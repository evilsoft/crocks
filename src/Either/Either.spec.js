const test = require('tape')

const isFunction = require('../core/isFunction')
const Either = require('.')

test('Either crock', t => {
  t.ok(isFunction(Either), 'is a function')
  t.end()
})
