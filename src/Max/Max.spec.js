const test = require('tape')
const MockCrock = require('../test/MockCrock')
const helpers = require('../test/helpers')
const laws = require('../test/laws')

const bindFunc = helpers.bindFunc

const equals = require('../core/equals')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')

const fl = require('../core/flNames')

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

  t.ok(isFunction(Max[fl.empty]), 'provides empty function on constructor')

  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')

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
  t.equal(m['@@type'], 'crocks/Max@2', 'reports crocks/Max@2')

  t.end()
})

test('Max equals properties (Setoid)', t => {
  const a = Max(4)
  const b = Max(4)
  const c = Max(4)
  const d = Max(3)

  const equals = laws.Setoid('equals')

  t.ok(isFunction(Max(4).equals), 'provides an equals function')

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Max fantasy-land equals properties (Setoid)', t => {
  const a = Max(90)
  const b = Max(90)
  const c = Max(90)
  const d = Max(0)

  const equals = laws.Setoid(fl.equals)

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Max equals functionality', t => {
  const a = Max(4)
  const b = Max(4)
  const c = Max(5)

  const value = 5
  const nonMax = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Maxs are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Maxs are equal')
  t.equal(a.equals(nonMax), false, 'returns false when passed a non-Max')
  t.equal(c.equals(value), false, 'returns false when passed a simple value')

  t.end()
})

test('Max concat errors', t => {
  const a = Max(5)

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

  t.end()
})

test('Max concat fantasy-land errors', t => {
  const a = Max(5)

  const notMax = { type: constant('Max...Not') }

  const cat = bindFunc(a[fl.concat])

  const err = /Max.fantasy-land\/concat: Max requried/
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

  t.end()
})

test('Max concat functionality', t => {
  const x = 5
  const y = 23

  const a = Max(x)
  const b = Max(y)

  t.equals(a.concat(b).valueOf(), y, 'provides max wrapped values as expected')

  t.end()
})

test('Max concat properties (Semigroup)', t => {
  const a = Max(45)
  const b = Max(20)
  const c = Max(35)

  const concat = laws.Semigroup(equals, 'concat')

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Max fantasy-land concat properties (Semigroup)', t => {
  const a = Max(45)
  const b = Max(20)
  const c = Max(35)

  const concat = laws.Semigroup(equals, fl.concat)

  t.ok(isFunction(a[fl.concat]), 'provides a concat function')
  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Max empty properties (Monoid)', t => {
  const m = Max(32)

  const empty = laws.Monoid(equals, 'empty', 'concat')

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.constructor.empty), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Max fantasy-land empty properties (Monoid)', t => {
  const m = Max(32)

  const empty = laws.Monoid(equals, fl.empty, fl.concat)

  t.ok(isFunction(m[fl.concat]), 'provides a concat function')
  t.ok(isFunction(m.constructor[fl.empty]), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Max empty functionality', t => {
  const x = Max(85).empty()

  t.equal(Max(0).empty, Max.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Max', 'provides a Max')
  t.equal(x.valueOf(), -Infinity, 'wraps a -Infinity')

  t.end()
})
