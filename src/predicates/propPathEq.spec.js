const test = require('tape')
const helpers = require('../test/helpers')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const bindFunc = helpers.bindFunc

const propPathEq = require('./propPathEq')

test('propPathEq function', t => {

  t.ok(isFunction(propPathEq), 'is a function')

  const val = 5

  const p = bindFunc(propPathEq)

  const err = /propPathEq: Array of Non-empty Strings or Integers required for first argument/
  t.throws(p(undefined, {}, {}), err, 'throws with undefined in first argument')
  t.throws(p(null, {}, {}), err, 'throws with null in first argument')
  t.throws(p(0, {}, {}), err, 'throws with falsey number in first argument')
  t.throws(p(1, {}, {}), err, 'throws with truthy number in first argument')
  t.throws(p('', {}, {}), err, 'throws with falsey string in first argument')
  t.throws(p('string', {}, {}), err, 'throws with truthy string in first argument')
  t.throws(p(false, {}, {}), err, 'throws with false in first argument')
  t.throws(p(true, {}, {}), err, 'throws with true in first argument')
  t.throws(p(unit, {}, {}), err, 'throws with function in first argument')
  t.throws(p({}, {}, {}), err, 'throws with an object in first argument')

  t.throws(p([ undefined ], {}, {}), err, 'throws with undefined in first argument array')
  t.throws(p([ null ], {}, {}), err, 'throws with null in first argument array')
  t.throws(p([ NaN ], {}, {}), err, 'throws with NaN in first argument array')
  t.throws(p([ false ], {}, {}), err, 'throws with false in first argument array')
  t.throws(p([ true ], {}, {}), err, 'throws with true in first argument array')
  t.throws(p([ 1.2345 ], {}, {}), err, 'throws with float in first argument array')
  t.throws(p([ '' ], {}, {}), err, 'throws with empty string in first argument array')
  t.throws(p([ unit ], {}, {}), err, 'throws with function in first argument array')
  t.throws(p([ [] ], {}, {}), err, 'throws with Array in first argument array')
  t.throws(p([ {} ], {}, {}), err, 'throws with Object in first argument array')

  const obj = { some: { key: val, null: null, nan: NaN, undefined: undefined } }

  const goodPath = [ 'some', 'key' ]
  const badPath = [ 'this', 'is', 'really', 'bad' ]

  t.equals(propPathEq(goodPath, val, obj), true, 'returns true on correct path')
  t.equals(propPathEq([ 'some', 'null' ], null, obj), true, 'returns true when comparing to null values that are present')
  t.equals(propPathEq([ 'some', 'nan' ], NaN, obj), true, 'returns true when comparing to NaN values that are present')

  t.equals(propPathEq(badPath, val, obj), false, 'returns false on incorrect path')
  t.equals(propPathEq([ 'some', 'undefined' ], NaN, obj), false, 'returns false for falsey matches (nan)')
  t.equals(propPathEq([ 'some', 'null' ], NaN, obj), false, 'returns false for falsey matches (null)')
  t.equals(propPathEq([ 'some', 'undefined' ], undefined, obj), false, 'returns false when comparing to undefined values that are present')
  t.equals(propPathEq([ 'some', 'wrong', null, {}, [] ], undefined, { some: NaN }), false, 'returns false when comparing early-exited paths with an undefined')
  t.equals(propPathEq([ 'a' ], val, undefined), false, 'returns false with undefined as third argument')
  t.equals(propPathEq([ 'a' ], val, null), false, 'returns false with null as third argument')
  t.equals(propPathEq([ 'a' ], val, NaN), false, 'returns false with NaN as third argument')

  t.end()
})
