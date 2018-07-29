import test from 'tape'

import isFunction from '../core/isFunction'

import isMonad from './isMonad'

test('isMonad predicate', t => {
  t.ok(isFunction(isMonad), 'is a function')
  t.end()
})
