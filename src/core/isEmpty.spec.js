const test = require('tape')
const helpers = require('../test/helpers')

const makeFake = helpers.makeFake

const isFunction = require('./isFunction')

const fl = require('../core/flNames')

const isEmpty = require('./isEmpty')

test('isEmpty predicate function', t => {
  const Fake = makeFake([ 'concat', 'empty' ])
  const primitiveMonoid = {
    concat: x => x,
    empty: () => true
  }

  t.ok(isFunction(isEmpty), 'is a function')

  t.equal(isEmpty(undefined), true, 'returns true with undefined')
  t.equal(isEmpty(null), true, 'returns true with null')
  t.equal(isEmpty(0), true, 'returns true with falsey number')
  t.equal(isEmpty(1), true, 'returns false with truthy number')
  t.equal(isEmpty(false), true, 'returns true with false')
  t.equal(isEmpty(true), true, 'returns false with true')

  t.equal(isEmpty({}), true, 'returns true with an empty object')
  t.equal(isEmpty({ Some: 'yep' }), false, 'returns false with non-empty object')

  t.equal(isEmpty([]), true, 'returns true with an empty array')
  t.equal(isEmpty([ 1 ]), false, 'returns false with non-empty array')

  t.equal(isEmpty(''), true, 'returns true with empty string')
  t.equal(isEmpty('string'), false, 'returns false with non-empty string')

  t.equal(isEmpty(Fake.empty()), true, 'returns true with empty monoid')
  t.equal(isEmpty(Fake()), false, 'returns true with empty monoid')

  t.equal(isEmpty(primitiveMonoid), false, 'returns true with empty monoid')

  t.end()
})

test('isEmpty fantasy-land predicate function', t => {
  const Fake = makeFake([ 'concat', 'empty' ], true)

  t.equal(isEmpty(Fake[fl.empty]()), true, 'returns true with empty monoid')
  t.equal(isEmpty(Fake()), false, 'returns true with empty monoid')

  t.end()
})
