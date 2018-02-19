const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const equals = require('../core/equals')
const isFunction = require('../core/isFunction')

const propPathOr = require('./propPathOr')

test('propPathOr function', t => {
  const p = bindFunc(propPathOr)
  const def = 'default value'

  t.ok(isFunction(propPathOr), 'is a function')

  const err = /propPathOr: Array of Non-empty Strings or Integers required for second argument/
  t.throws(p(def, undefined, {}), err, 'throws with undefined in second argument')
  t.throws(p(def, null, {}), err, 'throws with null in second argument')
  t.throws(p(def, 0, {}), err, 'throws with falsey number in second argument')
  t.throws(p(def, 1, {}), err, 'throws with truthy number in second argument')
  t.throws(p(def, '', {}), err, 'throws with falsey string in second argument')
  t.throws(p(def, 'string', {}), err, 'throws with truthy string in second argument')
  t.throws(p(def, false, {}), err, 'throws with false in second argument')
  t.throws(p(def, true, {}), err, 'throws with true in second argument')
  t.throws(p(def, {}, {}), err, 'throws with an object in second argument')

  t.throws(p(def, [ undefined ], {}), err, 'throws with an array of undefined in second argument')
  t.throws(p(def, [ null ], {}), err, 'throws with array of null in second argument')
  t.throws(p(def, [ false ], {}), err, 'throws with an array of false in second argument')
  t.throws(p(def, [ true ], {}), err, 'throws with an array of true in second argument')
  t.throws(p(def, [ '' ], {}), err, 'throws with an array of empty in second argument')
  t.throws(p(def, [ {} ], {}), err, 'throws with an array of objects in second argument')
  t.throws(p(def, [ [ 'key' ] ], {}), err, 'throws with a nested array in second argument')

  const value = 'Cry Clown Cry'
  const obj = { a: { b: value }, bad: { null: null, nonNum: NaN, undef: undefined } }

  const objGood = propPathOr(def, [ 'a', 'b' ])(obj)
  const objBad = propPathOr(def, [ 'b', 'c' ], obj)
  const objNull = propPathOr(def, [ 'bad', 'null' ])
  const objNaN = propPathOr(def, [ 'bad', 'nonNum' ])
  const objUndef = propPathOr(def, [ 'bad', 'undef' ])

  t.equals(objGood, value, 'returns the value when key path is found')
  t.equals(objBad, def, 'returns the default value when key path is not found')

  t.equals(objUndef(obj), def, 'returns the default value when keypath is found and value is undefined')
  t.equals(objNull(obj), null, 'returns null when keypath is found and value is null')
  t.ok(equals(objNaN(obj), NaN), 'returns NaN when keypath is found and value is NaN')

  const arr = [ [ 'blank', value ], [ null, NaN, undefined ] ]

  const arrGood = propPathOr(def, [ 0, 1 ], arr)
  const arrBad = propPathOr(def, [ 5 ])(arr)
  const arrNull = propPathOr(def, [ 1, 0 ])
  const arrNaN = propPathOr(def, [ 1, 1 ])
  const arrUndef = propPathOr(def, [ 1, 2 ])

  t.equals(arrGood, value, 'returns the value when index is found')
  t.equals(arrBad, def, 'returns the default value when index is not found')

  t.equals(arrUndef(arr), def, 'returns the default value when index is found and value is undefined')
  t.equals(arrNull(arr), null , 'returns null when index is found and value is null')
  t.ok(equals(arrNaN(arr), NaN), 'returns NaN when index is found and value is NaN')

  t.same(propPathOr(def, [], arr), arr, 'returns the original value when an empty array is provided as path')

  const mixed = { things: [ 1, 45, value, 10 ] }

  t.equals(propPathOr(def, [ 'things', 2 ], mixed), value, 'allows for traversal with a mixed path on a mixed structure')

  const fn = propPathOr(def, [ 'key' ])

  t.equals(fn(undefined), def, 'returns the default value when data is undefined')
  t.equals(fn(null), def, 'returns the default value when data is null')
  t.equals(fn(NaN), def, 'returns the default value when data is NaN')

  const objDefault =  { b: 1 }

  t.equals(propPathOr(objDefault, [ 'a', 'b' ], { c: { b: 2 } }), objDefault, 'returns the default value when default is an object that has the same property as a nested property in target')
  t.equals(propPathOr(1, [ 'a' ], { a: 0 } ), 0, 'returns found falsy value')

  t.end()
})
