import test from 'tape'

import isFunction from './isFunction'

test('isFunction predicate', t => {
  t.equal(typeof isFunction, 'function', 'is a function')
  t.end()
})
