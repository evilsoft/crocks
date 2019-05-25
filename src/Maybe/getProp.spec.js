const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const equals = require('../core/equals')

const getProp = require('./getProp')

test('getProp function', t => {
  const fn =
    x => getProp('key', x).option('nothing')

  t.ok(isFunction(getProp), 'is a function')

  t.equals(fn(undefined), 'nothing', 'returns Nothing when data is undefined')
  t.equals(fn(null), 'nothing', 'returns Nothing when data is null')
  t.equals(fn(NaN), 'nothing', 'returns Nothing when data is NaN')

  t.end()
})

test('getProp errors', t => {
  const fn = bindFunc(x => getProp(x, {}))

  const err = /getProp: Non-empty String or Integer required for first argument/
  t.throws(fn(undefined), err, 'throws with undefined in first argument')
  t.throws(fn(null), err, 'throws with null in first argument')
  t.throws(fn(false), err, 'throws with false in first argument')
  t.throws(fn(true), err, 'throws with true in first argument')
  t.throws(fn(''), err, 'throws with empty string in first argument')
  t.throws(fn(1.5), err, 'throws with float in first argument')
  t.throws(fn([]), err, 'throws with an array in first argument')
  t.throws(fn({}), err, 'throws with an object in first argument')

  t.end()
})

test('getProp object traversal', t => {
  const fn = x =>
    getProp('a', x).option('nothing')

  t.equals(fn({ a: false }), false, 'returns a Just with the value when key is found')
  t.equals(fn({ a: null }), null, 'returns a Just when key is found and value is null')
  t.ok(equals(fn({ a: NaN }), NaN), 'returns a Just when key is found and value is NaN')

  t.equals(fn({ b: null }), 'nothing', 'returns a Nothing when key is not found')
  t.equals(fn({ a: undefined }), 'nothing', 'returns a Nothing when key is found and value is undefined')

  t.end()
})

test('getProp array traversal', t => {
  const fn = x =>
    getProp(1, x).option('nothing')

  const string = x =>
    getProp('1', x).option('nothing')

  t.equals(fn([ null, false ]), false, 'returns a Just with the value when index is found')
  t.equals(string([ null, false ]), false, 'returns a Just with the value when string index is found')
  t.equals(fn([ undefined, null ]), null, 'returns a Just when index is found and value is null')
  t.ok(equals(fn([ 0, NaN ]), NaN), 'returns a Just when index is found and value is NaN')

  t.equals(fn([ 'string' ]), 'nothing', 'returns a Nothing when index is not found')
  t.equals(fn([ 1, undefined ]), 'nothing', 'returns a Nothing when index is found and value is undefined')

  t.end()
})
