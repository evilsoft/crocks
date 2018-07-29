import test from 'tape'

import isFunction from '../core/isFunction'

import isNumber from './isNumber'

test('isNumber predicate', t => {
  t.ok(isFunction(isNumber), 'is a function')
  t.end()
})
