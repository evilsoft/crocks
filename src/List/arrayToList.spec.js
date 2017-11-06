const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const List = require('.')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const arrayToList = require('./arrayToList')

test('arrayToList transform', t => {
  const f = bindFunc(arrayToList)

  t.ok(isFunction(arrayToList), 'is a function')

  t.throws(f(undefined), TypeError, 'throws if function returns undefined')
  t.throws(f(null), TypeError, 'throws if function returns null')
  t.throws(f(0), TypeError, 'throws if function returns a falsey number')
  t.throws(f(1), TypeError, 'throws if function returns a truthy number')
  t.throws(f(''), TypeError, 'throws if function returns a falsey string')
  t.throws(f('string'), TypeError, 'throws if function returns a truthy string')
  t.throws(f(false), TypeError, 'throws if function returns false')
  t.throws(f(true), TypeError, 'throws if function returns true')
  t.throws(f({}), TypeError, 'throws if function returns an object')

  t.end()
})

test('arrayToList with Array', t => {
  const data = [ 23, 45, 'a', [ 42, 56, [ '19' ] ] ]

  const a = arrayToList(data)

  t.ok(isSameType(List, a), 'returns a List from an Array')
  t.same(a.valueOf(), data, 'preserves the structure of underlying data')

  t.end()
})

test('arrayToList with Array returning function', t => {
  const f = bindFunc(arrayToList(identity))

  t.throws(f(undefined), TypeError, 'throws if function returns undefined')
  t.throws(f(null), TypeError, 'throws if function returns null')
  t.throws(f(0), TypeError, 'throws if function returns a falsey number')
  t.throws(f(1), TypeError, 'throws if function returns a truthy number')
  t.throws(f(''), TypeError, 'throws if function returns a falsey string')
  t.throws(f('string'), TypeError, 'throws if function returns a truthy string')
  t.throws(f(false), TypeError, 'throws if function returns false')
  t.throws(f(true), TypeError, 'throws if function returns true')
  t.throws(f({}), TypeError, 'throws if function returns an object')

  const data = [ 32, 54, 'b', [ 24, 65 ], [ '91' ] ]

  const m = arrayToList(identity, data)

  t.ok(isSameType(List, m), 'returns a List from a function returning an Array')
  t.same(m.valueOf(), data, 'preserves the structure of underlying data')

  t.end()
})
