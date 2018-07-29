import test from 'tape'

import isFunction from '../core/isFunction'

import unit from './unit'

test('unit helper', t => {
  t.ok(isFunction(unit), 'is a function')
  t.end()
})
