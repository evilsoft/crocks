import test from 'tape'

import isFunction from '../core/isFunction'

import isNil from './isNil'

test('isNil predicate', t => {
  t.ok(isFunction(isNil), 'is a function')
  t.end()
})
