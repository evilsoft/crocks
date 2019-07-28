const test = require('tape')
const MockCrock = require('../test/MockCrock')
const helpers = require('../test/helpers')
const laws = require('../test/laws')

const bindFunc = helpers.bindFunc

const equals = require('../core/equals')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString  = require('../core/isString')

const fl = require('../core/flNames')

const constant = x => () => x
const identity = x => x

const Sum = require('.')

test('Sum', t => {
  const s = bindFunc(Sum)

  t.ok(isFunction(Sum), 'is a function')
  t.ok(isObject(Sum(0)), 'returns an object')

  t.equals(Sum(0).constructor, Sum, 'provides TypeRep on constructor')

  t.ok(isFunction(Sum.empty), 'provides an empty function')
  t.ok(isFunction(Sum.type), 'provides a type function')
  t.ok(isString(Sum['@@type']), 'provides a @@type string')

  const err = /Sum: Numeric value required/
  t.throws(Sum, err, 'throws with nothing')
  t.throws(s(identity), err, 'throws with a function')
  t.throws(s(''), err, 'throws with falsey string')
  t.throws(s('string'), err, 'throws with truthy string')
  t.throws(s(false), err, 'throws with false')
  t.throws(s(true), err, 'throws with true')
  t.throws(s([]), err, 'throws with an array')
  t.throws(s({}), err, 'throws with an object')

  t.doesNotThrow(s(undefined), 'allows undefined')
  t.doesNotThrow(s(null), 'allows null')
  t.doesNotThrow(s(0), 'allows a falsey number')
  t.doesNotThrow(s(1), 'allows a truthy number')

  t.end()
})

test('Sum fantasy-land api', t => {
  const m = Sum(99)

  t.ok(isFunction(Sum[fl.empty]), 'provides empty function on constructor')

  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')

  t.end()
})

test('Sum @@implements', t => {
  const f = Sum['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals')

  t.end()
})

test('Sum inspect', t => {
  const m = Sum(90)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Sum 90', 'returns inspect string')

  t.end()
})

test('Sum valueOf', t => {
  const empty = Sum.empty().valueOf()

  t.ok(isFunction(Sum(0).valueOf), 'is a function')

  t.equal(Sum(undefined).valueOf(), empty, 'provides an empty value for undefined')
  t.equal(Sum(null).valueOf(), empty, 'provides an empty value for null')

  t.equal(Sum(0).valueOf(), 0, 'provides a wrapped falsey number')
  t.equal(Sum(1).valueOf(), 1, 'provides a wrapped truthy number')

  t.end()
})

test('Sum type', t => {
  const m = Sum(0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(m.type, Sum.type, 'static and instance versions are the same')
  t.equal(m.type(), 'Sum', 'reports Sum')

  t.end()
})

test('Sum @@type', t => {
  const m = Sum(0)

  t.equal(m['@@type'], Sum['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/Sum@2', 'reports crocks/Sum@2')

  t.end()
})

test('Sum equals properties (Setoid)', t => {
  const a = Sum(4)
  const b = Sum(4)
  const c = Sum(4)
  const d = Sum(3)

  const equals = laws.Setoid('equals')

  t.ok(isFunction(Sum(4).equals), 'provides an equals function')

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Sum fantasy-land equals properties (Setoid)', t => {
  const a = Sum(78)
  const b = Sum(78)
  const c = Sum(78)
  const d = Sum(1)

  const equals = laws.Setoid(fl.equals)

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Sum equals functionality', t => {
  const a = Sum(4)
  const b = Sum(4)
  const c = Sum(5)

  const value = 5
  const nonSum = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Sums are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Sums are equal')
  t.equal(a.equals(nonSum), false, 'returns false when passed a non-Sum')
  t.equal(c.equals(value), false, 'returns false when passed a simple value')

  t.end()
})

test('Sum concat properties (Semigroup)', t => {
  const a = Sum(45)
  const b = Sum(20)
  const c = Sum(35)

  const concat = laws.Semigroup(equals, 'concat')

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Sum fantasy-land concat properties (Semigroup)', t => {
  const a = Sum(45)
  const b = Sum(20)
  const c = Sum(35)

  const concat = laws.Semigroup(equals, fl.concat)

  t.ok(isFunction(a[fl.concat]), 'provides a concat function')
  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Sum concat errors', t => {
  const a = Sum(5)
  const notSum = { type: constant('Sum...Not') }

  const cat = bindFunc(a.concat)

  const err = /Sum.concat: Sum required/
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
  t.throws(cat(notSum), err, 'throws with non-Sum')

  t.end()
})

test('Sum concat fantasy-land errors', t => {
  const a = Sum(5)
  const notSum = { type: constant('Sum...Not') }

  const cat = bindFunc(a[fl.concat])

  const err = /Sum.fantasy-land\/concat: Sum required/
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
  t.throws(cat(notSum), err, 'throws with non-Sum')

  t.end()
})

test('Sum concat functionality', t => {
  const x = 5
  const y = 23

  const a = Sum(x)
  const b = Sum(y)

  t.equals(a.concat(b).valueOf(), x + y, 'sums wrapped values as expected')

  t.end()
})

test('Sum empty properties (Monoid)', t => {
  const m = Sum(32)

  const empty = laws.Monoid(equals, 'empty', 'concat')

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.constructor.empty), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Sum fantasy-land empty properties (Monoid)', t => {
  const m = Sum(32)

  const empty = laws.Monoid(equals, fl.empty, fl.concat)

  t.ok(isFunction(m[fl.concat]), 'provides a concat function')
  t.ok(isFunction(m.constructor[fl.empty]), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Sum empty functionality', t => {
  const x = Sum(85).empty()

  t.equal(Sum(0).empty, Sum.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Sum', 'provides a Sum')
  t.equal(x.valueOf(), 0, 'wraps a 0')

  t.end()
})
