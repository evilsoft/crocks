import test from 'tape'

import isFunction from '../core/isFunction'

import isAlt from './isAlt'

test('isAlt predicate', t => {
  t.ok(isFunction(isAlt), 'is a function')
  t.end()
})
