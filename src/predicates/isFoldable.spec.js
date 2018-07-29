import test from 'tape'

import isFunction from '../core/isFunction'

import isFoldable from './isFoldable'

test('isFoldable predicate', t => {
  t.ok(isFunction(isFoldable), 'is a function')
  t.end()
})
