import test from 'tape'

import isFunction from '../core/isFunction'

import isPlus from './isPlus'

test('isPlus predicate', t => {
  t.ok(isFunction(isPlus), 'is a function')
  t.end()
})
