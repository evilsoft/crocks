import test from 'tape'

import isFunction from '../core/isFunction'

import Unit from '.'

test('Unit crock', t => {
  t.ok(isFunction(Unit), 'is a function')
  t.end()
})
