const test = require('tape')
const MockCrock = require('../test/MockCrock')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')

const fl = require('../core/flNames')

const Any = require('.')

const constant = x => () => x
const identity = x => x

test('Any', t => {
  const a = bindFunc(Any)

  t.ok(isFunction(Any), 'is a function')
  t.ok(isObject(Any(false)), 'returns an object')

  t.equals(Any(true).constructor, Any, 'provides TypeRep on constructor')

  t.ok(isFunction(Any.empty), 'provides an empty function')
  t.ok(isFunction(Any.type), 'provides a type function')
  t.ok(isString(Any['@@type']), 'provides a @@type string')

  const err = /Any: Value must not be a Function/
  t.throws(Any, err, 'throws with nothing')
  t.throws(a(identity), err, 'throws with a function')

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

test('Any fantasy-land api', t => {
  const m = Any(true)

  t.ok(isFunction(Any[fl.empty]), 'provides empty function on constructor')

  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')

  t.end()
})

test('Any @@implements', t => {
  const f = Any['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals')

  t.end()
})

test('Any inspect', t => {
  const m = Any(1)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Any true', 'returns inspect string')

  t.end()
})

test('Any valueOf', t => {
  t.ok(isFunction(Any(0).valueOf), 'is a function')

  t.equal(Any(undefined).valueOf(), false, 'reports false for undefined')
  t.equal(Any(null).valueOf(), false, 'reports false for null')
  t.equal(Any(0).valueOf(), false, 'reports false for falsey number')
  t.equal(Any(1).valueOf(), true, 'reports true for truthy number')
  t.equal(Any('').valueOf(), false, 'reports false for falsey number')
  t.equal(Any('string').valueOf(), true, 'reports true for truthy string')
  t.equal(Any(false).valueOf(), false, 'reports false for false')
  t.equal(Any(true).valueOf(), true, 'reports true for true')
  t.equal(Any([]).valueOf(), true, 'reports true for an array')
  t.equal(Any({}).valueOf(), true, 'reports true for an object')

  t.end()
})

test('Any type', t => {
  t.ok(isFunction(Any(0).type), 'is a function')

  t.equal(Any(0).type, Any.type, 'static and instance versions are the same')
  t.equal(Any(0).type(), 'Any', 'reports Any')

  t.end()
})

test('Any @@type', t => {
  t.equal(Any['@@type'], Any(0)['@@type'], 'static and instance versions are the same')
  t.equal(Any(0)['@@type'], 'crocks/Any@2', 'reports crocks/Any@2')

  t.end()
})

test('Any concat functionality', t => {
  const a = Any(true)
  const b = Any(false)

  const notAny = { type: constant('Any...Not') }

  const cat = bindFunc(a.concat)

  const err = /Any.concat: Any required/
  t.throws(cat(undefined), err, 'throws with undefined')
  t.throws(cat(null), err, 'throws with null')
  t.throws(cat(0), err, 'throws with falsey number')
  t.throws(cat(1), err, 'throws with truthy number')
  t.throws(cat(''), err, 'throws with falsey string')
  t.throws(cat('string'), err, 'throws with truthy string')
  t.throws(cat(false), err, 'throws with false')
  t.throws(cat(true), err, 'throws with true')
  t.throws(cat([]), err, 'throws with an array')
  t.throws(cat({}), err, 'throws with an object')
  t.throws(cat(notAny), err, 'throws with non-Any')

  t.equal(a.concat(b).valueOf(), true, 'true to false reports true')
  t.equal(a.concat(a).valueOf(), true, 'true to true reports true')
  t.equal(b.concat(b).valueOf(), false, 'false to false reports false')

  t.end()
})

test('Any concat fantasy-land errors', t => {
  const a = Any(true)

  const notAny = { type: constant('Any...Not') }

  const cat = bindFunc(a[fl.concat])

  const err = /Any.fantasy-land\/concat: Any required/
  t.throws(cat(undefined), err, 'throws with undefined')
  t.throws(cat(null), err, 'throws with null')
  t.throws(cat(0), err, 'throws with falsey number')
  t.throws(cat(1), err, 'throws with truthy number')
  t.throws(cat(''), err, 'throws with falsey string')
  t.throws(cat('string'), err, 'throws with truthy string')
  t.throws(cat(false), err, 'throws with false')
  t.throws(cat(true), err, 'throws with true')
  t.throws(cat([]), err, 'throws with an array')
  t.throws(cat({}), err, 'throws with an object')
  t.throws(cat(notAny), err, 'throws with non-Any')

  t.end()
})

test('Any concat properties (Semigroup)', t => {
  const a = Any(0)
  const b = Any(true)
  const c = Any('')

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(left.valueOf(), right.valueOf(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns an Any')

  t.end()
})

test('Any empty properties (Monoid)', t => {
  const m = Any(3)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(right.valueOf(), m.valueOf(), 'right identity')
  t.equal(left.valueOf(), m.valueOf(), 'left identity')

  t.end()
})

test('Any equals properties (Setoid)', t => {
  const a = Any(true)
  const b = Any(true)
  const c = Any(false)
  const d = Any(true)

  t.ok(isFunction(Any({}).equals), 'provides an equals function')
  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Any equals functionality', t => {
  const a = Any(true)
  const b = Any(true)
  const c = Any(false)

  const value = {}
  const nonAny = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Anys are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Anys are equal')
  t.equal(a.equals(nonAny), false, 'returns false when passed a non-Any')
  t.equal(c.equals(value), false, 'returns false when passed a simple value')

  t.end()
})

test('Any empty functionality', t => {
  const x = Any(0).empty()

  t.equal(x.type(), 'Any', 'provides an Any')
  t.equal(x.valueOf(), false, 'wraps a false value')

  t.end()
})
