import test from 'tape'

import isFunction from '../core/isFunction'

import isArray from './isArray'

test('isArray predicate', t => {
  t.ok(isFunction(isArray), 'is a function')
  t.end()
})
