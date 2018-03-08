const test = require('tape')

const isFunction = require('../core/isFunction')

const find = require('./find')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

test('find is protected', t => {
  const fn = bindFunc(fn => find(fn, []))
  const err = /find: Function required for first argument/

  t.throws(fn(undefined), err, 'throws if foldable is undefined')

  t.end()
})

test('find', t => {
  t.ok(isFunction(find), 'is a function')

  t.ok(isFunction(find(() => true, undefined).either), 'returns a Maybe for undefined value')
  t.ok(isFunction(find(() => true, []).either), 'returns a Maybe for valid value')

  t.end()
})
