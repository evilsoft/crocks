const test = require('tape')
const { bindFunc } = require('../test/helpers')

const Pred = require('../Pred')
const isFunction = require('../core/isFunction')
const isNumber = require('../core/isNumber')
const unit = require('../core/_unit')

const propPathSatisfies = require('./propPathSatisfies')

const T =
  () => true

test('propPathSatisfies function', t => {
  const fn = propPathSatisfies([ 'a' ], T)

  t.ok(isFunction(propPathSatisfies), 'is a function')

  t.equals(fn(null), false, 'returns false when target is null')
  t.equals(fn(NaN), false, 'returns false when target is NaN')
  t.equals(fn(undefined), false, 'returns false when target is undefined')

  t.end()
})

test('propPathSatisfies errors', t => {
  const firstArg = bindFunc(
    x => propPathSatisfies(x, T, 'target')
  )

  const err = /propPathSatisfies: Array of Non-empty Strings or Integers required for first argument/
  t.throws(firstArg(undefined), err, 'throws with undefined as first argument')
  t.throws(firstArg(null), err, 'throws with null as first argument')
  t.throws(firstArg(NaN), err, 'throws with NaN as first argument')
  t.throws(firstArg(false), err, 'throws with false as first argument')
  t.throws(firstArg(true), err, 'throws with true as first argument')
  t.throws(firstArg(''), err, 'throws with falsey string as first argument')
  t.throws(firstArg('string'), err, 'throws with truthy string as first argument')
  t.throws(firstArg(0), err, 'throws with falsey Number as first argument')
  t.throws(firstArg(1), err, 'throws with truthy Number as first argument')
  t.throws(firstArg({}), err, 'throws with Object as first argument')
  t.throws(firstArg(unit), err, 'throws with Function as first argument')

  t.throws(firstArg([ undefined ]), err, 'throws with undefined in first argument array')
  t.throws(firstArg([ null ]), err, 'throws with null in first argument array')
  t.throws(firstArg([ NaN ]), err, 'throws with NaN in first argument array')
  t.throws(firstArg([ '' ]), err, 'throws with empty String in first argument array')
  t.throws(firstArg([ 1.93 ]), err, 'throws with Float in first argument array')
  t.throws(firstArg([ false ]), err, 'throws with false in first argument array')
  t.throws(firstArg([ true ]), err, 'throws with true in first argument array')
  t.throws(firstArg([ [] ]), err, 'throws with Array in first argument array')
  t.throws(firstArg([ {} ]), err, 'throws with Object in first argument array')
  t.throws(firstArg([ unit ]), err, 'throws with Function in first argument array')

  const secondArg = bindFunc(
    x => propPathSatisfies([ 'a' ], x, 'target')
  )

  const predErr = /propPathSatisfies: Pred or predicate function required for second argument/
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

test('propPathSatisfies object traversal', t => {
  const fn = propPathSatisfies([ 'a', 'b' ], isNumber)

  t.equals(fn({ a: { b: 23 } }), true, 'returns true when function predicate matches')
  t.equals(fn({ a: { b: '33' } }), false, 'returns false when function predicate does not match')
  t.equals(fn({ a: null }), false, 'returns false when null encountered with predicate function')
  t.equals(fn({ a: NaN }), false, 'returns false when NaN encountered with predicate function')
  t.equals(fn({ a: undefined }), false, 'returns false when undefined encountered with predicate function')
  t.equals(fn({ a: { c: 'not' } }), false, 'returns false when key does not exist with predicate function')
  t.equals(fn({ b: 23 }), false, 'returns false on shallow path with predicate function')

  const pred = propPathSatisfies([ 'a', 'b' ], Pred(isNumber))

  t.equals(pred({ a: { b: 23 } }), true, 'returns true when Pred matches')
  t.equals(pred({ a: { b: '33' } }), false, 'returns false when Pred does not match')
  t.equals(pred({ a: null }), false, 'returns false when null encountered with Pred')
  t.equals(pred({ a: NaN }), false, 'returns false when NaN encountered with Pred')
  t.equals(pred({ a: undefined }), false, 'returns false when undefined encountered with Pred')
  t.equals(pred({ a: { c: 'not' } }), false, 'returns false when key does not exist with Pred')
  t.equals(pred({ b: 23 }), false, 'returns false on shallow path with Pred')

  t.end()
})

test('propPathSatisfies array traversal', t => {
  const fn = propPathSatisfies([ 1, 1 ], isNumber)

  t.equals(fn([ 34, [ 99, 44 ] ]), true, 'returns true when function predicate matches')
  t.equals(fn([ 'three', [ 'one', 'two' ] ]), false, 'returns false when function predicate does not match')
  t.equals(fn([ 75, [ 33 ] ]), false, 'returns false when index does not exist with predicate function')
  t.equals(fn([ 75, null ]), false, 'returns false when null encountered with predicate function')
  t.equals(fn([ 75, NaN ]), false, 'returns false when NaN encountered with predicate function')
  t.equals(fn([ 75, undefined ]), false, 'returns false when undefined encountered with predicate function')
  t.equals(fn([ 75 ]), false, 'returns false on shallow path with predicate function')

  const pred = propPathSatisfies([ 1, 1 ], Pred(isNumber))

  t.equals(pred([ 34, [ 99, 44 ] ]), true, 'returns true when Pred matches')
  t.equals(pred([ 'three', [ 'one', 'two' ] ]), false, 'returns false when Pred does not match')
  t.equals(pred([ 75, [ 33 ] ]), false, 'returns false when index does not exist with Pred')
  t.equals(pred([ 75, null ]), false, 'returns false when null encountered with Pred')
  t.equals(pred([ 75, NaN ]), false, 'returns false when NaN encountered with Pred')
  t.equals(pred([ 75, undefined ]), false, 'returns false when undefined encountered with Pred')
  t.equals(pred([ 75 ]), false, 'returns false on shallow path with Pred')

  t.end()
})
