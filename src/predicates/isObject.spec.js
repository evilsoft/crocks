import test from 'tape'

import isFunction from '../core/isFunction'

import isObject from './isObject'

test('isObject predicate', t => {
  t.ok(isFunction(isObject), 'is a function')
  t.end()
})
