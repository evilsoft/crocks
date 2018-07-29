import test from 'tape'

import Last from '../test/LastMonoid'
import isFunction from './isFunction'

import mconcatMap from './mconcatMap'

test('mconcatMap core', t => {
  t.ok(isFunction(mconcatMap), 'is a function')

  const addOne = x => x + 1
  const nothing = mconcatMap(Last, addOne, [])
  const something = mconcatMap(Last, addOne, [ 1, 2, 3 ])

  t.equal(nothing.valueOf(), Last.empty().valueOf(), 'returns the empty value when passed an empty array')
  t.equal(something.valueOf(), 4, 'returns the last value by lifting and calling concat on each after running through map function')

  t.end()
})
