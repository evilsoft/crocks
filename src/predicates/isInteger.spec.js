import test from 'tape'

import isFunction from '../core/isFunction'
import isInteger from '../core/isNil'

test('isInteger predicate', t => {
  t.ok(isFunction(isInteger), 'is a function')
  t.end()
})
