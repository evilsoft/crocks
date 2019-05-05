const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const equals = require('../core/equals')
const isFunction = require('../core/isFunction')

const getPropOr  = require('./getPropOr')

test('getPropOr function', t => {
  const def = 'default value'
  const fn = getPropOr(def, 'key')

  t.ok(isFunction(getPropOr), 'is a function')

  t.equals(fn(undefined), def, 'returns default value when data is undefined')
  t.equals(fn(null), def, 'returns default value when data is null')
  t.equals(fn(NaN), def, 'returns default value when data is NaN')

  t.end()
})

test('getPropOr errors', t => {
  const fn = bindFunc(x => getPropOr(0, x, {}))

  const err = /getPropOr: Non-empty String or Integer required for second argument/
  t.throws(fn(undefined), err, 'throws with undefined in second argument')
  t.throws(fn(null), err, 'throws with null in second argument')
  t.throws(fn(false), err, 'throws with false in second argument')
  t.throws(fn(true), err, 'throws with true in second argument')
  t.throws(fn(1.5), err, 'throws with float in second argument')
  t.throws(fn(''), err, 'throws with empty string in second argument')
  t.throws(fn([]), err, 'throws with an array in second argument')
  t.throws(fn({}), err, 'throws with an object in second argument')

  t.end()
})

test('getPropOr object traversal', t => {
  const def = { b: 1 }
  const value = 'value'

  const fn = getPropOr(def, 'a')

  t.equals(fn({ a: value }), value, 'returns the value when key is found')
  t.equals(fn({ a: null }), null, 'returns null when key is found and value is null')
  t.ok(equals(fn({ a: NaN }), NaN), 'returns NaN when key is found and value is NaN')

  t.equals(fn({ b: 'bad' }), def, 'returns default value when key is not found')
  t.equals(fn({ a: undefined }), def, 'returns default value when key is found and value is undefined')

  t.end()
})

test('getPropOr array traversal', t => {
  const def = 33

  const fn = getPropOr(def, 1)
  const string = getPropOr(def, '1')

  t.equals(fn([ 0, false ]), false, 'returns the value when index is found')
  t.equals(string([ 0, '' ]), '', 'returns the value when string index is found')
  t.equals(fn([ 0, null ]), null, 'returns null when index is found and value is null')
  t.ok(equals(fn([ 0, NaN ]), NaN), 'returns NaN when index is found and value is NaN')

  t.equals(fn([ 0, undefined ]), def, 'returns default value when index is found and value is undefined')
  t.equals(fn([ 0 ]), def, 'returns default value when index is not found')

  t.end()
})
