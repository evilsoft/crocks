const test = require('tape')
const helpers = require('../test/helpers')
const Maybe = require('../core/Maybe')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const { Just, Nothing } = Maybe

const bindFunc = helpers.bindFunc

const propPathEq = require('./propPathEq')

test.only('propPathEq function', t => {
  const p = bindFunc(propPathEq)

  t.ok(isFunction(propPathEq), 'is a function')

  const err = /propPathEq: Array of strings or integers required for first argument/
  const val = Just(5)
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
  t.throws(p([ 'some', 'key', null, 5 ], val, {}), err, 'throws with unexpected input beyond first index in first argument')
  t.ok(p([ 'life', 'on', 'mars' ], val, {}), 'accepts an array of strings in the first argument')
  t.ok(p([ 'life', 0, 'on', 1, 'mars' ], val, {}), 'accepts a array of strings and numbers in the first argument')


  const obj = { some: { key: 5 } }
  const goodPath = [ 'some', 'key' ]
  const badPath = [ 'this', 'is', 'really', 'bad' ]

  t.equals(propPathEq(goodPath, Just(5), obj), true, 'returns true on correct path')
  t.equals(propPathEq(badPath, Just(5), obj), false, 'returns false on incorrect path')
  t.equals(propPathEq(badPath, 5, obj), false, 'returns false on when value is not a Maybe')
  t.equals(propPathEq(badPath, Nothing(), obj), true, 'returns true on Nothing matches')
  t.end()
})
