const test = require('tape')

const isFunction = require('../core/isFunction')

const find = require('./find')

const helpers = require('../test/helpers')

const List = require('../core/List')
const { fromArray } = List

const bindFunc = helpers.bindFunc

test('find is protected', t => {
  const fn = bindFunc(fn => find(fn, []))
  const err = /find: Function required for first argument/

  t.throws(fn(undefined), err, 'throws if foldable is undefined')
  t.throws(fn(2), err, 'throws if foldable is number')
  t.throws(fn('hello'), err, 'throws if foldable is string')

  t.end()
})

test('find', t => {
  t.ok(isFunction(find), 'is a function')

  t.ok(isFunction(find(() => true, undefined).either), 'returns a Maybe for undefined value')
  t.ok(isFunction(find(() => true, []).either), 'returns a Maybe for array value')
  t.ok(isFunction(find(() => true, fromArray([])).either), 'returns a Maybe for List value')

  t.end()
})
