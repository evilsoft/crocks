import test from 'tape'

import isFunction from '../core/isFunction'

import isExtend from './isExtend'

test('isExtend predicate', t => {
  t.ok(isFunction(isExtend), 'is a function')
  t.end()
})
