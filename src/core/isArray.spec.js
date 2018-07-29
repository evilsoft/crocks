import test from 'tape'

import isFunction  from './isFunction'
import unit from './_unit'

import isArray from './isArray'

test('isArray predicate function', t => {
  t.ok(isFunction(isArray), 'is a function')

  t.ok(isArray([]), 'returns true when passed an array')
  t.notOk(isArray(unit), 'returns false when passed a function')
  t.notOk(isArray(undefined), 'returns false when passed undefined')
  t.notOk(isArray(null), 'returns false when passed null')
  t.notOk(isArray(0), 'returns false when passed a falsey number')
  t.notOk(isArray(1), 'returns false when passed a truthy number')
  t.notOk(isArray(''), 'returns false when passed a falsey string')
  t.notOk(isArray('string'), 'returns false when passed a truthy string')
  t.notOk(isArray(false), 'returns false when passed false')
  t.notOk(isArray(true), 'returns false when passed true')
  t.notOk(isArray({}), 'returns false when passed an object')

  t.end()
})
