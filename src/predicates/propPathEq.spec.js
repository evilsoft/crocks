const test = require('tape')
const helpers = require('../test/helpers')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const bindFunc = helpers.bindFunc

const propPathEq = require('./propPathEq')

test('propPathEq function', t => {
  const p = bindFunc(propPathEq)

  t.ok(isFunction(propPathEq), 'is a function')

  const err = /propPathEq: Array of strings or integers required for first argument/
  const val = 5

  t.throws(p(undefined, val, {}), err, 'throws with undefined in first argument')
  t.throws(p(null, val, {}), err, 'throws with null in first argument')
  t.throws(p(0, val, {}), err, 'throws with falsey number in first argument')
  t.throws(p(1, val, {}), err, 'throws with truthy number in first argument')
  t.throws(p('', val, {}), err, 'throws with falsey string in first argument')
  t.throws(p('string', val, {}), err, 'throws with truthy string in first argument')
  t.throws(p(false, val, {}), err, 'throws with false in first argument')
  t.throws(p(true, val, {}), err, 'throws with true in first argument')
  t.throws(p(unit, val, {}), err, 'throws with function in third argument')
  t.throws(p({}, {}, val, {}), err, 'throws with an object in first argument')

  t.throws(p([ undefined ], val, {}), err, 'throws with an array of undefined in first argument')
  t.throws(p([ null ], val, {}), err, 'throws with array of null in first argument')
  t.throws(p(false, val, {}), err, 'throws with an array of false in first argument')
  t.throws(p(true, val, {}), err, 'throws with an array of true in first argument')
  t.throws(p([ val, {} ], val, {}), err, 'throws with an array of objects in first argument')
  t.throws(p([ [ 'key' ] ], val, {}), err, 'throws with a nested array in first argument')
  t.throws(p([ 'some', null, 5 ], val, { some: { key: 5 } }), err, 'throws with unexpected input beyond first index in first argument')

  const obj = { some: { key: val, null: null, nan: NaN, undefined: undefined } }
  const goodPath = [ 'some', 'key' ]
  const badPath = [ 'this', 'is', 'really', 'bad' ]

  t.equals(propPathEq(goodPath, val, obj), true, 'returns true on correct path')
  t.equals(propPathEq([ 'some', 'null' ], null, obj), true, 'returns true when comparing to null values that are present')
  t.equals(propPathEq([ 'some', 'nan' ], NaN, obj), true, 'returns true when comparing to NaN values that are present')
  t.equals(propPathEq([ 'some', 'undefined' ], undefined, obj), true, 'returns true when comparing to undefined values that are present')
  t.equals(propPathEq([ 'some', 'wrong', null, {}, [] ], undefined, { some: NaN }), true, 'returns true when comparing early-exited paths with an undefined')

  t.equals(propPathEq(badPath, val, obj), false, 'returns false on incorrect path')
  t.equals(propPathEq([ 'some', 'undefined' ], NaN, obj), false, 'returns false for falsey matches (nan)')
  t.equals(propPathEq([ 'some', 'null' ], NaN, obj), false, 'returns false for falsey matches (null)')
  t.equals(propPathEq([ 'some', 'undefined' ], null, obj), false, 'returns false for falsey matches (undefined)')

  t.end()
})
