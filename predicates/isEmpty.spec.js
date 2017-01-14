const test = require('tape')

const isFunction = require('./isFunction')

const isEmpty = require('./isEmpty')

test('isEmpty predicate function', t => {
  t.ok(isFunction(isEmpty), 'is a function')

  t.equal(isEmpty(undefined), true, 'returns true with undefined')
  t.equal(isEmpty(null), true, 'returns true with null')
  t.equal(isEmpty(0), true, 'returns true with falsey number')
  t.equal(isEmpty(1), false, 'returns false with truthy number')
  t.equal(isEmpty(''), true, 'returns true with empty string')
  t.equal(isEmpty('string'), false, 'returns false with non-empty string')
  t.equal(isEmpty(false), true, 'returns true with false')
  t.equal(isEmpty(true), false, 'returns false with true')
  t.equal(isEmpty({}), true, 'returns true with an empty object')
  t.equal(isEmpty({ Some: 'yep' }), false, 'returns false with non-empty object')
  t.equal(isEmpty([]), true, 'returns true with an empty array')
  t.equal(isEmpty([ 1 ]), false, 'returns false with non-empty array')

  t.end()
})

