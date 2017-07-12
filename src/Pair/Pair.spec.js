const test = require('tape')

const isFunction = require('../core/isFunction')
const Pair = require('.')

test('Pair crock', t => {
  t.ok(isFunction(Pair), 'is a function')
  t.end()
})
