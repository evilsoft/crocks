import test from 'tape'

import isFunction from '../core/isFunction'

import isSemigroup from './isSemigroup'

test('isSemigroup predicate', t => {
  t.ok(isFunction(isSemigroup), 'is a function')
  t.end()
})
