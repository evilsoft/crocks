import test from 'tape'
import { bindFunc } from '../test/helpers'

import Pred from '../Pred'
import isFunction from '../core/isFunction'
import isNumber from '../core/isNumber'
import unit from '../core/_unit'

import propSatisfies from './propSatisfies'

const T =
  () => true

test('propSatisfies function', t => {
  const fn = propSatisfies('a', T)

  t.ok(isFunction(propSatisfies), 'is a function')

  t.equals(fn(null), false, 'returns false when target is null')
  t.equals(fn(NaN), false, 'returns false when target is NaN')
  t.equals(fn(undefined), false, 'returns false when target is undefined')

  t.end()
})

test('propSatisfies errors', t => {
  const firstArg = bindFunc(
    x => propSatisfies(x, T, 'target')
  )

  const err = /propSatisfies: Non-empty String or Integer required for first argument/
  t.throws(firstArg(undefined), err, 'throws with undefined as first argument')
  t.throws(firstArg(null), err, 'throws with null as first argument')
  t.throws(firstArg(NaN), err, 'throws with NaN as first argument')
  t.throws(firstArg(false), err, 'throws with false as first argument')
  t.throws(firstArg(true), err, 'throws with true as first argument')
  t.throws(firstArg(''), err, 'throws with empty string as first argument')
  t.throws(firstArg(1.234), err, 'throws with float as first argument')
  t.throws(firstArg({}), err, 'throws with object as first argument')
  t.throws(firstArg([]), err, 'throws with Array as first argument')
  t.throws(firstArg(unit), err, 'throws with Function as first argument')

  const secondArg = bindFunc(
    x => propSatisfies('a', x, 'target')
  )

  const predErr = /propSatisfies: Pred or predicate function required for second argument/
  t.throws(secondArg(undefined), predErr, 'throws with undefined as second argument')
  t.throws(secondArg(null), predErr, 'throws with null as second argument')
  t.throws(secondArg(NaN), predErr, 'throws with NaN as second argument')
  t.throws(secondArg(false), predErr, 'throws with false as second argument')
  t.throws(secondArg(true), predErr, 'throws with true as second argument')
  t.throws(secondArg(''), predErr, 'throws with falsey string as second argument')
  t.throws(secondArg('string'), predErr, 'throws with truthy string as second argument')
  t.throws(secondArg(0), predErr, 'throws with falsey number as second argument')
  t.throws(secondArg(1), predErr, 'throws with truthy number as second argument')
  t.throws(secondArg({}), predErr, 'throws with object as second argument')
  t.throws(secondArg([]), predErr, 'throws with Array as second argument')

  t.end()
})

test('propSatisfies object traversal', t => {
  const fn = propSatisfies('a', isNumber)

  t.equals(fn({ a: 33 }), true, 'returns true when function predicate matches')
  t.equals(fn({ a: '33' }), false, 'returns false when function predicate does not match')
  t.equals(fn({ b: 33 }), false, 'returns false when key does not exist with predicate function')

  const pred = propSatisfies('a', Pred(isNumber))

  t.equals(pred({ a: 33 }), true, 'returns true when Pred matches')
  t.equals(pred({ a: '33' }), false, 'returns false when Pred does not match')
  t.equals(pred({ b: 33 }), false, 'returns false when key does not exist with Pred')

  t.end()
})

test('propSatisfies array traversal', t => {
  const fn = propSatisfies(1, isNumber)

  t.equals(fn([ 34, 99 ]), true, 'returns true when function predicate matches')
  t.equals(fn([ 'one', 'two' ]), false, 'returns false when function predicate does not match')
  t.equals(fn([ 75 ]), false, 'returns false when index does not exist with predicate function')

  const pred = propSatisfies(1, Pred(isNumber))

  t.equals(pred([ 34, 99 ]), true, 'returns true when function predicate matches')
  t.equals(pred([ 'one', 'two' ]), false, 'returns false when function predicate does not match')
  t.equals(pred([ 75 ]), false, 'returns false when index does not exist with predicate function')

  t.end()
})
