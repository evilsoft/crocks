const test = require('tape')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')

const prop = require('./prop')

test('prop function', t => {
  const p = bindFunc(prop)

  t.ok(isFunction(prop), 'is a function')

  const err = /prop: String or integer required for first argument/
  t.throws(p(undefined, {}), err, 'throws with undefined in first argument')
  t.throws(p(null, {}), err, 'throws with null in first argument')
  t.throws(p(false, {}), err, 'throws with false in first argument')
  t.throws(p(true, {}), err, 'throws with true in first argument')
  t.throws(p(1.5, {}), err, 'throws with float in first argument')
  t.throws(p([], {}), err, 'throws with an array in first argument')
  t.throws(p({}, {}), err, 'throws with an object in first argument')

  const value = 'Bobby Joe'
  const obj = { a: value, bad: null }

  const objGood = prop('a')(obj)
  const objBad = prop('b', obj)
  const objNull = prop('bad')

  t.equals(objGood.option('nothing'), value, 'returns a Just with the value when key is found')
  t.equals(objBad.option('nothing'), 'nothing', 'returns a Nothing when key is not found')
  t.equals(objNull(obj).option('nothing'), null, 'returns a Just null when key is found and value is null')

  const arr = [ value, null ]

  const arrGood = prop(0, arr)
  const arrBad = prop(5)(arr)
  const arrNull = prop(1)

  t.equals(arrGood.option('nothing'), value, 'returns a Just with the value when index is found')
  t.equals(arrBad.option('nothing'), 'nothing', 'returns a Nothing when index is not found')
  t.equals(arrNull(arr).option('nothing'), null, 'returns a Just null when index is found and value is null')

  t.end()
})
