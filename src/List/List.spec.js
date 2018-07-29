import test from 'tape'

import isFunction from '../core/isFunction'

import List from '.'

test('List crock', t => {
  t.ok(isFunction(List), 'is a function')
  t.end()
})
