import test from 'tape'

import isFunction from '../core/isFunction'
import coreIsIterable from '../core/isIterable'

import isIterable from './isIterable'

test('isIterable predicate', t => {
  t.ok(isFunction(isIterable), 'is a function')
  t.equal(isIterable, coreIsIterable, 'is exposing the expected function')

  t.end()
})
