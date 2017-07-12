const test = require('tape')

const isFunction = require('../core/isFunction')

const identity = require('./identity')

test('identity (I combinator)', t => {
  t.ok(isFunction(identity), 'is a function')
  t.end()
})
