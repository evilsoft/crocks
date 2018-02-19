const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const equals = require('../core/equals')

const prop = require('./prop')

test('prop function', t => {
  const p = bindFunc(prop)

  t.ok(isFunction(prop), 'is a function')

  const err = /prop: Non-empty String or Integer required for first argument/
  t.throws(p(undefined, {}), err, 'throws with undefined in first argument')
  t.throws(p(null, {}), err, 'throws with null in first argument')
  t.throws(p(false, {}), err, 'throws with false in first argument')
  t.throws(p(true, {}), err, 'throws with true in first argument')
  t.throws(p('', {}), err, 'throws with empty string in first argument')
  t.throws(p(1.5, {}), err, 'throws with float in first argument')
  t.throws(p([], {}), err, 'throws with an array in first argument')
  t.throws(p({}, {}), err, 'throws with an object in first argument')

  const value = 'Bobby Joe'
  const obj = { a: value, null: null, noNum: NaN, undef: undefined }

  const objGood = prop('a')(obj)
  const objBad = prop('b', obj)
  const objUndef = prop('undef')
  const objNull = prop('null')
  const objNaN = prop('noNum')

  t.equals(objGood.option('nothing'), value, 'returns a Just with the value when key is found')
  t.equals(objBad.option('nothing'), 'nothing', 'returns a Nothing when key is not found')
  t.equals(objUndef(obj).option('nothing'), 'nothing', 'returns a Nothing when key is found and value is undefined')
  t.equals(objNull(obj).option('nothing'), null, 'returns a Just when key is found and value is null')
  t.ok(equals(objNaN(obj).option('nothing'), NaN), 'returns a Just when key is found and value is NaN')

  const arr = [ value, null, NaN, undefined ]

  const arrGood = prop(0, arr)
  const arrBad = prop(5)(arr)
  const arrUndef = prop(4)
  const arrNull = prop(1)
  const arrNaN = prop(2)

  t.equals(arrGood.option('nothing'), value, 'returns a Just with the value when index is found')
  t.equals(arrBad.option('nothing'), 'nothing', 'returns a Nothing when index is not found')
  t.equals(arrUndef(arr).option('nothing'), 'nothing', 'returns a Nothing when index is found and value is undefined')
  t.equals(arrNull(arr).option('nothing'), null, 'returns a Just when index is found and value is null')
  t.ok(equals(arrNaN(arr).option('nothing'), NaN), 'returns a Just when index is found and value is NaN')

  const fn =
    x => prop('key', x).option('nothing')

  t.equals(fn(undefined), 'nothing', 'returns Nothing when data is undefined')
  t.equals(fn(null), 'nothing', 'returns Nothing when data is null')
  t.equals(fn(NaN), 'nothing', 'returns Nothing when data is NaN')

  t.end()
})
