import test from 'tape'
import Last from '../test/LastMonoid'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'

import mreduce from './mreduce'

test('mreduce helper', t => {
  const mc = bindFunc(mreduce)

  t.ok(isFunction(mreduce), 'is a function')

  const err = /mreduce: Monoid required for first argument/
  t.throws(mc(undefined, []), err, 'throws when first arg is undefined')
  t.throws(mc(null, []), err, 'throws when first arg is null')
  t.throws(mc(0, []), err, 'throws when first arg is falsey number')
  t.throws(mc(1, []), err, 'throws when first arg is truthy number')
  t.throws(mc('', []), err, 'throws when first arg is falsey string')
  t.throws(mc('string', []), err, 'throws when first arg is truthy string')
  t.throws(mc(false, []), err, 'throws when first arg is false')
  t.throws(mc(true, []), err, 'throws when first arg is true')
  t.throws(mc({}, []), err, 'throws when first arg is an object')
  t.throws(mc([], []), err, 'throws when first arg is an array')

  const last = /mreduce: Foldable required for second argument/
  t.throws(mc(Last, undefined), last, 'throws when second arg is undefined')
  t.throws(mc(Last, null), last, 'throws when second arg is null')
  t.throws(mc(Last, 0), last, 'throws when second arg is falsey number')
  t.throws(mc(Last, 1), last, 'throws when second arg is truthy number')
  t.throws(mc(Last, ''), last, 'throws when second arg is falsey string')
  t.throws(mc(Last, 'string'), last, 'throws when second arg is truthy string')
  t.throws(mc(Last, false), last, 'throws when second arg is false')
  t.throws(mc(Last, true), last, 'throws when second arg is true')
  t.throws(mc(Last, {}), last, 'throws when second arg is an object')

  t.doesNotThrow(mc(Last, [ 1, 2, 3 ]), 'allows a populated array as second argument')

  const nothing = mreduce(Last, [])
  const something = mreduce(Last, [ 1, 2, 3 ])

  t.equal(nothing, Last.empty().valueOf(), 'returns the empty value when passed an empty array')
  t.equal(something, 3, 'returns the last value by lifting and calling concat on each')

  t.end()
})
