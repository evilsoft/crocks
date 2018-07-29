import test from 'tape'

import isFunction from '../core/isFunction'

import isSemigroupoid from './isSemigroupoid'

test('isSemigroupoid predicate', t => {
  t.ok(isFunction(isSemigroupoid), 'is a function')
  t.end()
})
