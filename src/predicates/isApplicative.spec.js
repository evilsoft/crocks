import test from 'tape'

import isFunction from '../core/isFunction'
import isApplicative from './isApplicative'

test('isApplicative predicate', t => {
  t.ok(isFunction(isApplicative), 'is a function')
  t.end()
})
