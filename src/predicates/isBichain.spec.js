const test = require('tape')

const isFunction = require('../core/isFunction')

const isBichain = require('./isBichain')

test('isBichain predicate', t => {
  t.ok(isFunction(isBichain), 'is a function')
  t.end()
})
