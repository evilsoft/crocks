const test = require('tape')

const isFunction = require('../core/isFunction')

const unit = require('./unit')

test('unit helper', t => {
  t.ok(isFunction(unit), 'is a function')
  t.end()
})
