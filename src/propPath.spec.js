const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('./core/isFunction')

const propPath = require('./propPath')

test('propPath function', t => {
  const p = bindFunc(propPath)

  t.ok(isFunction(propPath), 'is a function')

  t.throws(p(undefined, {}), TypeError, 'throws with undefined in first argument')
  t.throws(p(null, {}), TypeError, 'throws with null in first argument')
  t.throws(p(0, {}), TypeError, 'throws with falsey number in first argument')
  t.throws(p(1, {}), TypeError, 'throws with truthy number in first argument')
  t.throws(p('', {}), TypeError, 'throws with falsey string in first argument')
  t.throws(p('string', {}), TypeError, 'throws with truthy string in first argument')
  t.throws(p(false, {}), TypeError, 'throws with false in first argument')
  t.throws(p(true, {}), TypeError, 'throws with true in first argument')
  t.throws(p({}, {}), TypeError, 'throws with an object in first argument')

  t.throws(p([ undefined ], {}), TypeError, 'throws with an array of undefined in first argument')
  t.throws(p([ null ], {}), TypeError, 'throws with array of null in first argument')
  t.throws(p(false, {}), TypeError, 'throws with an arrau of false in first argument')
  t.throws(p(true, {}), TypeError, 'throws with an array of true in first argument')
  t.throws(p([ {} ], {}), TypeError, 'throws with an array of objects in first argument')
  t.throws(p([ [ 'key' ] ], {}), TypeError, 'throws with a nested array in first argument')

  const value = 'Cry Clown Cry'
  const obj = { a: { b: value }, bad: { thing: null } }

  const objGood = propPath([ 'a', 'b' ])(obj)
  const objBad = propPath([ 'b', 'c' ], obj)
  const objNull = propPath([ 'bad', 'thing' ])

  t.equals(objGood.option('nothing'), value, 'returns a Just with the value when key path is found')
  t.equals(objBad.option('nothing'), 'nothing', 'returns a Nothing when key path is not found')
  t.equals(objNull(obj).option('nothing'), null, 'returns a Just null when keypath is found and value is null')

  const arr = [ [ 'blank', value ], [ null, 'crazy' ] ]

  const arrGood = propPath([ 0, 1 ], arr)
  const arrBad = propPath([ 5 ])(arr)
  const arrNull = propPath([ 1, 0 ])

  t.equals(arrGood.option('nothing'), value, 'returns a Just with the value when index is found')
  t.equals(arrBad.option('nothing'), 'nothing', 'returns a Nothing when index is not found')
  t.equals(arrNull(arr).option('nothing'), null, 'returns a Just null when index is found and value is null')
  t.same(propPath([], arr).option('nothing'), arr, 'returns a Just with original value when an empty array is provided as path')

  const mixed = { things: [ 1, 45, value, 10 ] }

  t.equals(propPath([ 'things', 2 ], mixed).option('nothing'), value, 'allows for traversal with a mixed path on a mixed structure')

  t.end()
})
