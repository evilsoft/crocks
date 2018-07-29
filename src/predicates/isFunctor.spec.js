import test from 'tape'

import isFunction from '../core/isFunction'

import isFunctor from './isFunctor'

test('isFunctor predicate', t => {
  t.ok(isFunction(isFunctor), 'is a function')
  t.end()
})
