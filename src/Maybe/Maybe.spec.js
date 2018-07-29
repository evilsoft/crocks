import test from 'tape'

import isFunction from '../core/isFunction'
import Maybe from '.'

test('Maybe crock', t => {
  t.ok(isFunction(Maybe), 'is a function')
  t.end()
})
