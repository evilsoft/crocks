import test from 'tape'

import isFunction from '../core/isFunction'

import isString from './isString'

test('isString predicate', t => {
  t.ok(isFunction(isString), 'is a function')
  t.end()
})
