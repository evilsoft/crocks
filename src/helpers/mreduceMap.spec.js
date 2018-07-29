import test from 'tape'
import Last from '../test/LastMonoid'
import { bindFunc } from '../test/helpers'



import isFunction from '../core/isFunction'
import unit from '../core/_unit'

import mreduceMap from './mreduceMap'

test('mreduceMap helper', t => {
  const mc = bindFunc(mreduceMap)

  t.ok(isFunction(mreduceMap), 'is a function')

  const first = /mreduceMap: Monoid required for first argument/
  t.throws(mc(undefined, unit, []), first, 'throws when first arg is undefined')
  t.throws(mc(null, unit, []), first, 'throws when first arg is null')
  t.throws(mc(0, unit, []), first, 'throws when first arg is falsey number')
  t.throws(mc(1, unit, []), first, 'throws when first arg is truthy number')
  t.throws(mc('', unit, []), first, 'throws when first arg is falsey string')
  t.throws(mc('string', unit, []), first, 'throws when first arg is truthy string')
  t.throws(mc(false, unit, []), first, 'throws when first arg is false')
  t.throws(mc(true, unit, []), first, 'throws when first arg is true')
  t.throws(mc({}, unit, []), first, 'throws when first arg is an object')
  t.throws(mc([], unit, []), first, 'throws when first arg is an array')

  const second = /mreduceMap: Function required for second argument/
  t.throws(mc(Last, undefined, []), second, 'throws when second arg is undefined')
  t.throws(mc(Last, null, []), second, 'throws when second arg is null')
  t.throws(mc(Last, 0, []), second, 'throws when second arg is falsey number')
  t.throws(mc(Last, 1, []), second, 'throws when second arg is truthy number')
  t.throws(mc(Last, '', []), second, 'throws when second arg is falsey string')
  t.throws(mc(Last, 'string', []), second, 'throws when second arg is truthy string')
  t.throws(mc(Last, false, []), second, 'throws when second arg is false')
  t.throws(mc(Last, true, []), second, 'throws when second arg is true')
  t.throws(mc(Last, {}, []), second, 'throws when second arg is an object')
  t.throws(mc(Last, [], []), second, 'throws when second arg is an array')

  const last = /mreduceMap: Foldable required for third argument/
  t.throws(mc(Last, unit, undefined), last, 'throws when third arg is undefined')
  t.throws(mc(Last, unit, null), last, 'throws when third arg is null')
  t.throws(mc(Last, unit, 0), last, 'throws when arg third is falsey number')
  t.throws(mc(Last, unit, 1), last, 'throws when arg third is truthy number')
  t.throws(mc(Last, unit, ''), last, 'throws when arg third is falsey string')
  t.throws(mc(Last, unit, 'string'), last, 'throws when third arg is truthy string')
  t.throws(mc(Last, unit, false), last, 'throws when third arg is false')
  t.throws(mc(Last, unit, true), last, 'throws when third arg is true')
  t.throws(mc(Last, unit, {}), last, 'throws when third arg is an object')

  t.doesNotThrow(mc(Last, unit, [ 1, 2, 3 ]), 'allows a populated array as second argument')

  const addOne = x => x + 1
  const nothing = mreduceMap(Last, addOne, [])
  const something = mreduceMap(Last, addOne, [ 1, 2, 3 ])

  t.equal(nothing, Last.empty().valueOf(), 'returns the empty value when passed an empty array')
  t.equal(something, 4, 'returns the last value by lifting and calling concat on each after running through map function')

  t.end()
})
