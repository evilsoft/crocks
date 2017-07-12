const test = require('tape')

const isFunction = require('../core/isFunction')

const Pred = require('.')

test('Pred crock', t => {
  t.ok(isFunction(Pred), 'is a function')
  t.end()
})
