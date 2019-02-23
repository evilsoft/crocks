const test = require('tape')

const isFunction = require('../core/isFunction')

const isFalsy = require('./isFalsy')

test('isFalsy predicate', t => {
  t.ok(isFunction(isFalsy), 'is a function')

  t.end()
})
