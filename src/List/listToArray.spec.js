const test = require('tape')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const List = require('.')

const identity = require('../core/identity')
const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')

const listToArray = require('./listToArray')

test('listToArray transform', t => {
  const f = bindFunc(listToArray)

  t.ok(isFunction(listToArray), 'is a function')

  t.throws(f(undefined), TypeError, 'throws if arg is undefined')
  t.throws(f(null), TypeError, 'throws if arg is null')
  t.throws(f(0), TypeError, 'throws if arg is a falsey number')
  t.throws(f(1), TypeError, 'throws if arg is a truthy number')
  t.throws(f(''), TypeError, 'throws if arg is a falsey string')
  t.throws(f('string'), TypeError, 'throws if arg is a truthy string')
  t.throws(f(false), TypeError, 'throws if arg is false')
  t.throws(f(true), TypeError, 'throws if arg is true')
  t.throws(f({}), TypeError, 'throws if arg is an object')

  t.end()
})

test('listToArray with List', t => {
  const data = [ 23, 45, 'a', [ 42, 56, [ '19' ] ] ]
  const list = List.fromArray(data)

  const a = listToArray(list)

  t.ok(isArray(a), 'returns an Array from List')
  t.same(a, data, 'preserves the structure of underlying data')

  t.end()
})

test('listToArray with List returning function', t => {
  const f = bindFunc(listToArray(identity))

  t.throws(f(undefined), TypeError, 'throws if function returns undefined')
  t.throws(f(null), TypeError, 'throws if function returns null')
  t.throws(f(0), TypeError, 'throws if function returns a falsey number')
  t.throws(f(1), TypeError, 'throws if function returns a truthy number')
  t.throws(f(''), TypeError, 'throws if function returns a falsey string')
  t.throws(f('string'), TypeError, 'throws if function returns a truthy string')
  t.throws(f(false), TypeError, 'throws if function returns false')
  t.throws(f(true), TypeError, 'throws if function returns true')
  t.throws(f({}), TypeError, 'throws if function returns an object')
  t.throws(f([]), TypeError, 'throws if function returns an array')

  const data = [ 32, 54, 'b', [ 24, 65 ], [ '91' ] ]
  const list = List.fromArray(data)

  const m = listToArray(identity, list)

  t.ok(isArray(m), 'returns an Array from a function returning a List')
  t.same(m, data, 'preserves the structure of underlying data')

  t.end()
})
