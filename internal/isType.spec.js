const test = require('tape')

const isFunction = require('../internal/isFunction')

const isType = require('./isType')

test('isType internal helper', t => {
  const first   = { type: () => 'first' }
  const second  = { type: () => 'second' }

  t.ok(isFunction(isType), 'is a function')

  t.equal(isType(first.type(), first), true, 'reports true when they are the same')
  t.equal(isType(first.type(), second), false, 'reports false when they are the different containers')
  t.equal(isType(first.type(), []), false, 'reports false when one is not a container')

  t.end()
})
