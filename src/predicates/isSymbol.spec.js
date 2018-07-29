import test from 'tape'

import isFunction from '../core/isFunction'

import isSymbol from './isSymbol'

test('isSymbol predicate', t => {
  t.ok(isFunction(isSymbol), 'is a function')
  t.end()
})
