const test = require('tape')

const isFunction = require('../predicates/isFunction')

const isSameType = require('./isSameType')

test('isSameType predicate function', t => {
  const first = { type: () => 'first' }
  const second = { type: () => 'second' }

  t.ok(isFunction(isSameType), 'is a function')

  t.equal(isSameType(first, first), true, 'reports true when they are the same')
  t.equal(isSameType(first, second), false, 'reports false when they are the different containers')
  t.equal(isSameType(first, []), false, 'reports false when one is not a container')

  t.end()
})
