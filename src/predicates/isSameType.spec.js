import test from 'tape'

import isFunction from '../core/isFunction'

import isSameType from './isSameType'

test('isSameType predicate', t => {
  t.ok(isFunction(isSameType), 'is a function')
  t.end()
})
