import test from 'tape'

import isFunction from '../core/isFunction'

import isDate from './isDate'

test('isDate predicate', t => {
  t.ok(isFunction(isDate), 'is a function')

  t.end()
})
