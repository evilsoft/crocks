const test = require('tape')
const MockCrock = require('../test/MockCrock')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')

const constant = x => () => x
const identity = x => x

const Max = require('.')

test('Max', t => {
  const m = bindFunc(Max)

  t.ok(isFunction(Max), 'is a function')
  t.ok(isObject(Max(0)), 'returns an object')

  t.ok(isFunction(Max.empty), 'provides an empty function')
  t.ok(isFunction(Max.type), 'provides a type function')
  t.ok(isString(Max['@@type']), 'provides a @@type string')

  t.equals(Max(0).constructor, Max, 'provides TypeRep on constructor')

  const err = /Max: Numeric value required/
  t.throws(Max, err, 'throws with nothing')
  t.throws(m(identity), err, 'throws with a function')
  t.throws(m(''), err, 'throws with falsey string')
  t.throws(m('string'), err, 'throws with truthy string')
  t.throws(m(false), err, 'throws with false')
  t.throws(m(true), err, 'throws with true')
  t.throws(m([]), err, 'throws with an array')
  t.throws(m({}), err, 'throws with an object')

  t.doesNotThrow(m(undefined), 'allows undefined')
  t.doesNotThrow(m(null), 'allows null')
  t.doesNotThrow(m(0), 'allows a falsey number')
  t.doesNotThrow(m(1), 'allows a truthy number')

  t.end()
})

test('Max fantasy-land api', t => {
  const m = Max(99)

  t.equals(Max['fantasy-land/empty'], Max.empty, 'is same function as public constructor empty')

  t.equals(m['fantasy-land/empty'], m.empty, 'is same function as public instance empty')
  t.equals(m['fantasy-land/concat'], m.concat, 'is same function as public instance concat')
  t.equals(m['fantasy-land/equals'], m.equals, 'is same function as public instance equals')

  t.end()
})

test('Max @@implements', t => {
  const f = Max['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals')

  t.end()
})

test('Max inspect', t => {
  const m = Max(124)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Max 124', 'returns inspect string')

  t.end()
})

test('Max valueOf', t => {
  const empty = Max.empty().valueOf()

  t.ok(isFunction(Max(0).valueOf), 'is a function')

  t.equal(Max(undefined).valueOf(), empty, 'provides an empty value for undefined')
  t.equal(Max(null).valueOf(), empty, 'provides an empty value for null')

  t.equal(Max(0).valueOf(), 0, 'provides a wrapped falsey number')
  t.equal(Max(1).valueOf(), 1, 'provides a wrapped truthy number')

  t.end()
})

test('Max type', t => {
  const m = Max(0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(m.type, Max.type, 'static and instance versions are the same')
  t.equal(m.type(), 'Max', 'reports Max')

  t.end()
})

test('Max @@type', t => {
  const m = Max(0)

  t.equal(m['@@type'], Max['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/Max@1', 'reports crocks/Max@1')

  t.end()
})

test('Max equals properties (Setoid)', t => {
  const a = Max(4)
  const b = Max(4)
  const c = Max(3)
  const d = Max(4)

  t.ok(isFunction(Max(4).equals), 'provides an equals function')
  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Max concat properties (Semigroup)', t => {
  const a = Max(45)
  const b = Max(20)
  const c = Max(35)

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Max(0).concat), 'is a function')

  t.equal(left.valueOf(), right.valueOf(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns Semigroup of the same type')

  t.end()
})

test('Max concat functionality', t => {
  const x = 5
  const y = 23

  const a = Max(x)
  const b = Max(y)

  const notMax = { type: constant('Max...Not') }

  const cat = bindFunc(a.concat)

  const err = /Max.concat: Max requried/
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
  t.throws(cat(notMax), err, 'throws with non-Max')

  t.equals(a.concat(b).valueOf(), y, 'provides max wrapped values as expected')

  t.end()
})

test('Max empty properties (Monoid)', t => {
  const m = Max(32)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty())
  const left  = m.empty().concat(m)

  t.equal(right.valueOf(), m.valueOf(), 'right identity')
  t.equal(left.valueOf(), m.valueOf(), 'left identity')

  t.equal(m.empty().type(), m.type(), 'returns a Monoid of the same type')

  t.end()
})

test('Max empty functionality', t => {
  const x = Max(85).empty()

  t.equal(Max(0).empty, Max.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Max', 'provides a Max')
  t.equal(x.valueOf(), -Infinity, 'wraps a -Infinity')

  t.end()
})

test('Max equals functionality', t => {
  const a = Max(4)
  const b = Max(4)
  const c = Max(5)

  const value = 5
  const nonAssign = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Assigns are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Assigns are equal')
  t.equal(a.equals(nonAssign), false, 'returns false when passed a non-Assign')
  t.equal(c.equals(value), false, 'returns false when passed a simple value')

  t.end()
})
