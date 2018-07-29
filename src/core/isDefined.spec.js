import test from 'tape'

import isFunction from './isFunction'
import unit from './_unit'

import isDefined from './isDefined'

test('isDefined predicate function', t => {
  t.ok(isFunction(isDefined), 'is a function')

  t.equal(isDefined(unit), true, 'returns true with function')
  t.equal(isDefined(null), true, 'returns true with null')
  t.equal(isDefined(''), true, 'returns true with falsey string')
  t.equal(isDefined('string'), true, 'returns true with truthy string')
  t.equal(isDefined(0), true, 'returns true with falsey number')
  t.equal(isDefined(1), true, 'returns true with truthy number')
  t.equal(isDefined(false), true, 'returns true with false')
  t.equal(isDefined(true), true, 'returns true with true')
  t.equal(isDefined([]), true, 'returns true with an array')
  t.equal(isDefined({}), true, 'returns true with an object')

  t.equal(isDefined(undefined), false, 'returns false with undefined')

  t.end()
})
