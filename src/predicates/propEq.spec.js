const test = require('tape')
const { bindFunc } = require('../test/helpers')

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const propEq = require('./propEq')

test('propEq function', t => {
  const fn = propEq('a')

  t.ok(isFunction(propEq), 'is a function')

  t.equals(fn(null, null), false, 'returns false when target is null')
  t.equals(fn(NaN, NaN), false, 'returns false when target is NaN')
  t.equals(fn(undefined, undefined), false, 'returns false when target is undefined')

  t.end()
})

test('propEq errors', t => {
  const fn = bindFunc(x => propEq(x, 'val', 'key'))

  const err = /propEq: Non-empty String or Integer required for first argument/
  t.throws(fn(undefined), err, 'throws with undefined as first argument')
  t.throws(fn(null), err, 'throws with null as first argument')
  t.throws(fn(NaN), err, 'throws with NaN as first argument')
  t.throws(fn(false), err, 'throws with false as first argument')
  t.throws(fn(true), err, 'throws with true as first argument')
  t.throws(fn(''), err, 'throws with empty string as first argument')
  t.throws(fn(1.234), err, 'throws with float as first argument')
  t.throws(fn({}), err, 'throws with object as first argument')
  t.throws(fn([]), err, 'throws with Array as first argument')
  t.throws(fn(unit), err, 'throws with Function as first argument')

  t.end()
})

test('propEq object traversal', t => {
  const fn = propEq('a')

  t.equals(fn({ b: 32 }, { a: { b: 32 } }), true, 'returns true when value exists on object')
  t.equals(fn(null, { a: null }), true, 'returns true when null compared')
  t.equals(fn(NaN, { a: NaN }), true, 'returns true when NaN compared')

  t.equals(fn(3, { b: 3 }), false, 'returns false when value does not exist on object')
  t.equals(fn(true, { a: false }), false, 'returns false when values are not equal')
  t.equals(fn(undefined, { a: undefined }), false, 'returns false when undefined compared')

  t.end()
})

test('propEq array traversal', t => {
  const fn = propEq(1)
  const string = propEq('1')

  t.equals(fn(false, [ undefined, false ]), true, 'returns true when index found is equal to value')
  t.equals(string(false, [ undefined, false ]), true, 'returns true when string index found is equal to value')
  t.equals(fn({ a: [ undefined ] }, [ false, { a: [ undefined ] } ]), true, 'returns true when a deep matching object exists on object')
  t.equals(fn(null, [ 0, null ]), true, 'returns true when found null compared')
  t.equals(fn(NaN, [ '', NaN ]), true, 'returns true when found NaN compared')

  t.equals(fn('', [ '' ]), false, 'returns false when value does not exist on object')
  t.equals(fn('97', [ false, 97 ]), false, 'returns false when values are not equal')
  t.equals(fn(undefined, [ NaN, undefined ]), false, 'returns false when undefined compared')

  t.end()
})
