const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const hasProps = require('./hasProps')

test('hasProps function', t => {
  const fn = hasProps([ 'a' ])

  t.ok(isFunction(hasProps), 'is a function')

  t.equals(fn(undefined), false, 'returns false for undefined')
  t.equals(fn(null), false, 'returns false for null')
  t.equals(fn(NaN), false, 'returns false for NaN')

  t.end()
})

test('hasProps errors', t => {
  const fn = bindFunc(hasProps)

  const err = /hasProps: First argument must be an Array of Non-empty Strings or Integers/

  t.throws(fn(undefined, {}), err, 'throws with undefined in first argument')
  t.throws(fn(null, {}), err, 'throws with null in first argument')
  t.throws(fn(NaN, {}), err, 'throws with NaN in first argument')
  t.throws(fn(false, {}), err, 'throws with false in first argument')
  t.throws(fn(true, {}), err, 'throws with true number in first argument')
  t.throws(fn({}, {}), err, 'throws with object in first argument')
  t.throws(fn([], {}), err, 'throws with empty array in first argument')
  t.throws(fn(unit, {}), err, 'throws with function in first argument')
  t.throws(fn('', {}), err, 'throws with empty string in first argument')
  t.throws(fn(1.265, {}), err, 'throws with float in first argument')
  t.throws(fn('true', {}), err, 'throws with truthy string in first argument')
  t.throws(fn(1, {}), err, 'throws with int in first argument')

  t.end()
})

test('hasProps object traversal', t => {
  const fn = hasProps([ 'a', 'b' ])

  t.equals(fn({ a: 10, b: 20 }), true, 'returns true when keys exists on object')
  t.equals(fn({ a: null, b: null }), true, 'returns true when keys exists on object with a null values')
  t.equals(fn({ a: NaN, b: NaN }), true, 'returns true when keys exists on object with a NaN values')

  t.equals(fn({ c: 10 }), false, 'returns false when keys do not exist on object')
  t.equals(fn({ a: undefined, b: undefined }), false, 'returns false when keys exists on object with undefined values')

  t.end()
})

test('hasProps array traversal', t => {
  const fn = hasProps([ 1, 2 ])
  const string = hasProps([ '1', '2' ])

  t.equals(fn([ 10, 0, 20 ]), true, 'returns true when index exists in array')
  t.equals(string([ 0, false, false ]), true, 'returns true when string index exists in array')
  t.equals(fn([ 0, null, null ]), true, 'returns true when string index exists in array with null value')
  t.equals(fn([ 0, NaN, NaN ]), true, 'returns true when string index exists in array with NaN value')

  t.equals(fn([ 0 ]), false, 'returns false when index does not exist in array')
  t.equals(fn([ 0, undefined, undefined ]), false, 'returns false when index exists in array with undefined value')

  t.end()
})
