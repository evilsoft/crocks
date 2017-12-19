const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')

const propOr = require('./propOr')

test('propOr function', t => {
  const p = bindFunc(propOr)
  const def = 'default value'

  t.ok(isFunction(propOr), 'is a function')

  const err = /propOr: String or integer required for second argument/
  t.throws(p(def, undefined, {}), err, 'throws with undefined in second argument')
  t.throws(p(def, null, {}), err, 'throws with null in second argument')
  t.throws(p(def, false, {}), err, 'throws with false in second argument')
  t.throws(p(def, true, {}), err, 'throws with true in second argument')
  t.throws(p(def, 1.5, {}), err, 'throws with float in second argument')
  t.throws(p(def, [], {}), err, 'throws with an array in second argument')
  t.throws(p(def, {}, {}), err, 'throws with an object in second argument')

  const value = 'Bobby Joe'
  const obj = { a: value, bad: null, worse: NaN }

  const objGood = propOr(def)('a')(obj)
  const objBad = propOr(def)('b', obj)
  const objNull = propOr(def)('bad')
  const objNaN = propOr(def)('worse')

  t.equals(objGood, value, 'returns the value when key is found')
  t.equals(objBad, def, 'returns default value when key is not found')
  t.equals(objNull(obj), def, 'returns default value when key is found and value is null')
  t.equals(objNaN(obj), def, 'returns default value when key is found and value is NaN')

  const arr = [ value, null, NaN ]

  const arrGood = propOr(def, 0, arr)
  const arrBad = propOr(def, 5)(arr)
  const arrNull = propOr(def, 1)
  const arrNaN = propOr(def, 2)

  t.equals(arrGood, value, 'returns the value when index is found')
  t.equals(arrBad, def, 'returns default value when index is not found')
  t.equals(arrNull(arr), def, 'returns default value when index is found and value is null')
  t.equals(arrNaN(arr), def, 'returns default value when index is found and value is NaN')

  const fn = propOr(def, 'key')

  t.equals(fn(undefined), def, 'returns default value when data is undefined')
  t.equals(fn(null), def, 'returns default value when data is null')
  t.equals(fn(NaN), def, 'returns default value when data is NaN')

  t.end()
})
