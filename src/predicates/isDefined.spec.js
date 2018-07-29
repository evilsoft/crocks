import test from 'tape'

import isFunction from '../core/isFunction'

import isDefined from './isDefined'

test('isDefined predicate', t => {
  t.ok(isFunction(isDefined), 'is a function')
  t.end()
})
