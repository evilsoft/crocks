import test from 'tape'

import isFunction from '../core/isFunction'

import isSame from './isSame'

test('isSame predicate', t => {
  t.ok(isFunction(isSame), 'is a function')
  t.end()
})
