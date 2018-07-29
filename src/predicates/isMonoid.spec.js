import test from 'tape'

import isFunction from '../core/isFunction'

import isMonoid from './isMonoid'

test('isMonoid predicate', t => {
  t.ok(isFunction(isMonoid), 'is a function')
  t.end()
})
