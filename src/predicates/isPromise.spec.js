import test from 'tape'

import isFunction from '../core/isFunction'

import isPromise from './isPromise'

test('isPromise predicate', t => {
  t.ok(isFunction(isPromise), 'is a function')
  t.end()
})
