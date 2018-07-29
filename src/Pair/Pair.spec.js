import test from 'tape'

import isFunction from '../core/isFunction'
import Pair from '.'

test('Pair crock', t => {
  t.ok(isFunction(Pair), 'is a function')
  t.end()
})
