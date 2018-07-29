import test from 'tape'

import isFunction from '../core/isFunction'

import isEmpty from './isEmpty'

test('isEmpty predicate', t => {
  t.ok(isFunction(isEmpty), 'is a function')
  t.end()
})
