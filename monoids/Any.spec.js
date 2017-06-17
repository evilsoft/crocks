const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../predicates/isFunction')
const isObject = require('../predicates/isObject')

const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const Any = require('./Any')

test('Any', t => {
  const a = bindFunc(Any)

  t.ok(isFunction(Any), 'is a function')
  t.ok(isObject(Any(0)), 'returns an object')

  t.ok(isFunction(Any.empty), 'provides an empty function')
  t.ok(isFunction(Any.type), 'provides a type function')

  t.throws(Any, TypeError, 'throws with nothing')
  t.throws(a(identity), TypeError, 'throws with a function')

  t.doesNotThrow(a(undefined), 'allows undefined')
  t.doesNotThrow(a(null), 'allows null')
  t.doesNotThrow(a(0), 'allows a falsey number')
  t.doesNotThrow(a(1), 'allows a truthy number')
  t.doesNotThrow(a(''), 'allows a falsey string')
  t.doesNotThrow(a('string'), 'allows a truthy string')
  t.doesNotThrow(a(false), 'allows false')
  t.doesNotThrow(a(true), 'allows true')
  t.doesNotThrow(a([]), 'allows an array')
  t.doesNotThrow(a({}), 'allows an object')

  t.end()
})

test('Any @@implements', t => {
  const f = Any['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')

  t.end()
})

test('Any inspect', t => {
  const m = Any(1)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Any true', 'returns inspect string')

  t.end()
})

test('Any value', t => {
  t.ok(isFunction(Any(0).value), 'is a function')

  t.equal(Any(undefined).value(), false, 'reports false for undefined')
  t.equal(Any(null).value(), false, 'reports false for null')
  t.equal(Any(0).value(), false, 'reports false for falsey number')
  t.equal(Any(1).value(), true, 'reports true for truthy number')
  t.equal(Any('').value(), false, 'reports false for falsey number')
  t.equal(Any('string').value(), true, 'reports true for truthy string')
  t.equal(Any(false).value(), false, 'reports false for false')
  t.equal(Any(true).value(), true, 'reports true for true')
  t.equal(Any([]).value(), true, 'reports true for an array')
  t.equal(Any({}).value(), true, 'reports true for an object')

  t.end()
})

test('Any type', t => {
  t.ok(isFunction(Any(0).type), 'is a function')

  t.equal(Any(0).type, Any.type, 'static and instance versions are the same')
  t.equal(Any(0).type(), 'Any', 'reports Any')

  t.end()
})

test('Any concat properties (Semigroup)', t => {
  const a = Any(0)
  const b = Any(true)
  const c = Any('')

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns an Any')

  t.end()
})

test('Any concat functionality', t => {
  const a = Any(true)
  const b = Any(false)

  const notAny = { type: constant('Any...Not') }

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
  t.throws(cat(notAny), TypeError, 'throws with non-Any')

  t.equal(a.concat(b).value(), true, 'true to false reports true')
  t.equal(a.concat(a).value(), true, 'true to true reports true')
  t.equal(b.concat(b).value(), false, 'false to false reports false')

  t.end()
})

test('Any empty properties (Monoid)', t => {
  const m = Any(3)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(right.value(), m.value(), 'right identity')
  t.equal(left.value(), m.value(), 'left identity')

  t.end()
})

test('Any empty functionality', t => {
  const x = Any(0).empty()

  t.equal(x.type(), 'Any', 'provides an Any')
  t.equal(x.value(), false, 'wraps a false value')

  t.end()
})
