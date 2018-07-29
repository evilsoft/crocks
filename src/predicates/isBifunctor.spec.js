import test from 'tape'

import isFunction from '../core/isFunction'

import isBifunctor from './isBifunctor'

test('isBifunctor predicate', t => {
  t.ok(isFunction(isBifunctor), 'is a function')
  t.end()
})
