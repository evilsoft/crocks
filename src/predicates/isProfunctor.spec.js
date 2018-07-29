import test from 'tape'

import isFunction from '../core/isFunction'

import isProfunctor from './isProfunctor'

test('isProfunctor predicate function', t => {
  t.ok(isFunction(isProfunctor), 'is a function')
  t.end()
})
