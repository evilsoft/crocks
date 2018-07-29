import test from 'tape'

import isFunction from '../core/isFunction'

import isChain from './isChain'

test('isChain predicate', t => {
  t.ok(isFunction(isChain), 'is a function')
  t.end()
})
