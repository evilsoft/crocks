import test from 'tape'
import Last from '../test/LastMonoid'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'
import unit from '../core/_unit'

import mconcatMap from './mconcatMap'

test('mconcatMap helper', t => {
  const mc = bindFunc(mconcatMap)

  t.ok(isFunction(mconcatMap), 'is a function')

  const first = /mconcatMap: Monoid required for first argument/
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

  const second = /mconcatMap: Function required for second argument/
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

  const last = /mconcatMap: Foldable required for third argument/
  t.throws(mc(Last, unit, undefined), last, 'throws when third arg is undefined')
  t.throws(mc(Last, unit, null), last, 'throws when third arg is null')
  t.throws(mc(Last, unit, 0), last, 'throws when arg third is falsey number')
  t.throws(mc(Last, unit, 1), last, 'throws when arg third is truthy number')
  t.throws(mc(Last, unit, ''), last, 'throws when arg third is falsey string')
  t.throws(mc(Last, unit, 'string'), last, 'throws when third arg is truthy string')
  t.throws(mc(Last, unit, false), last, 'throws when third arg is false')
  t.throws(mc(Last, unit, true), last, 'throws when third arg is true')
  t.throws(mc(Last, unit, {}), last, 'throws when third arg is an object')

  t.doesNotThrow(mc(Last, unit, []), 'does not throw with Monoid, function and foldable')

  t.end()
})
