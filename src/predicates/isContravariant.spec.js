import test from 'tape'

import isFunction from '../core/isFunction'
import isContravariant from './isContravariant'

test('isContravariant predicate', t => {
  t.ok(isFunction(isContravariant), 'is a function')
  t.end()
})
