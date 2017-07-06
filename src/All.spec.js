const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const constant = require('./core/constant')
const identity = require('./core/identity')
const isFunction = require('./core/isFunction')
const isObject = require('./core/isObject')

const All = require('./All')

test('All', t => {
  const m = bindFunc(All)

  t.ok(isFunction(All), 'is a function')
  t.ok(isObject(All(0)), 'returns an object')

  t.ok(isFunction(All.empty), 'provides an empty function')
  t.ok(isFunction(All.type), 'provides a type function')

  t.throws(All, TypeError, 'throws with nothing')
  t.throws(m(identity), TypeError, 'throws with a function')

  t.doesNotThrow(m(undefined), 'allows undefined')
  t.doesNotThrow(m(null), 'allows null')
  t.doesNotThrow(m(0), 'allows a falsey number')
  t.doesNotThrow(m(1), 'allows a truthy number')
  t.doesNotThrow(m(''), 'allows a falsey string')
  t.doesNotThrow(m('string'), 'allows a truthy string')
  t.doesNotThrow(m(false), 'allows false')
  t.doesNotThrow(m(true), 'allows true')
  t.doesNotThrow(m([]), 'allows an array')
  t.doesNotThrow(m({}), 'allows an object')

  t.end()
})

test('All @@implements', t => {
  const f = All['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')

  t.end()
})

test('All inspect', t => {
  const m = All(0)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'All false', 'returns inspect string')

  t.end()
})

test('All value', t => {
  t.ok(isFunction(All(0).value), 'is a function')

  t.equal(All(undefined).value(), true, 'reports true for undefined')
  t.equal(All(null).value(), true, 'reports true for null')
  t.equal(All(0).value(), false, 'reports false for falsey number')
  t.equal(All(1).value(), true, 'reports true for truthy number')
  t.equal(All('').value(), false, 'reports false for falsey number')
  t.equal(All('string').value(), true, 'reports true for truthy string')
  t.equal(All(false).value(), false, 'reports false for false')
  t.equal(All(true).value(), true, 'reports true for true')
  t.equal(All([]).value(), true, 'reports true for an array')
  t.equal(All({}).value(), true, 'reports true for an object')

  t.end()
})

test('All type', t => {
  t.ok(isFunction(All(0).type), 'is a function')
  t.equal(All.type, All(0).type, 'is the same function as the static type')
  t.equal(All(0).type(), 'All', 'reports All')

  t.end()
})

test('All concat functionality', t => {
  const a = All(true)
  const b = All(false)

  const notAll = { type: constant('All...Not') }

  const cat = bindFunc(a.concat)

  t.throws(cat(undefined), TypeError, 'throws with undefined')
  t.throws(cat(null), TypeError, 'throws with null')
  t.throws(cat(0), TypeError, 'throws with falsey number')
  t.throws(cat(1), TypeError, 'throws with truthy number')
  t.throws(cat(''), TypeError, 'throws with falsey string')
  t.throws(cat('string'), TypeError, 'throws with truthy string')
  t.throws(cat(false), TypeError, 'throws with false')
  t.throws(cat(true), TypeError, 'throws with true')
  t.throws(cat([]), TypeError, 'throws with an array')
  t.throws(cat({}), TypeError, 'throws with an object')
  t.throws(cat(notAll), TypeError, 'throws when passed non-All')

  t.equal(a.concat(a).value(), true, 'true to true reports true')
  t.equal(a.concat(b).value(), false, 'true to false reports false')
  t.equal(b.concat(b).value(), false, 'false to false reports false')

  t.end()
})

test('All concat properties (Semigroup)', t => {
  const a = All(0)
  const b = All(true)
  const c = All('')

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns an All')

  t.end()
})

test('All empty functionality', t => {
  const x = All(0).empty()

  t.equal(x.type(), 'All', 'provides an All')
  t.equal(x.value(), true, 'provides a true value')

  t.end()
})

test('All empty properties (Monoid)', t => {
  const m = All(3)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(right.value(), m.value(), 'right identity')
  t.equal(left.value(), m.value(), 'left identity')

  t.end()
})
