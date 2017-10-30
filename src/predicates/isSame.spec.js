const test = require('tape')

const isFunction = require('../core/isFunction')

const isSame = require('./isSame')

test('isSame predicate', t => {
  t.ok(isFunction(isSame), 'is a function')
  t.end()
})
