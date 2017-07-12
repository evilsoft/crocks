const test = require('tape')

const isFunction = require('../core/isFunction')
const Maybe = require('.')

test('Maybe crock', t => {
  t.ok(isFunction(Maybe), 'is a function')
  t.end()
})
