import test from 'tape'

import isFunction from '../core/isFunction'
import isApply from './isApply'

test('isApply predicate', t => {
  t.ok(isFunction(isApply), 'is a function')
  t.end()
})
