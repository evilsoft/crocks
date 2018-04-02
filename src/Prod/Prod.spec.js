const test= require('tape')
const MockCrock = require('../test/MockCrock')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')

const constant = x => () => x
const identity = x => x

const Prod = require('.')

test('Prod', t => {
  const s = bindFunc(Prod)

  t.ok(isFunction(Prod), 'is a function')
  t.ok(isObject(Prod(0)), 'returns an object')

  t.equals(Prod(0).constructor, Prod, 'provides TypeRep on constructor')

  t.ok(isFunction(Prod.empty), 'provides an empty function')
  t.ok(isFunction(Prod.type), 'provides a type function')
  t.ok(isString(Prod['@@type']), 'provides a @@type string')

  const err = /Prod: Numeric value required/
  t.throws(s(), err, 'throws with nothing')
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

test('Prod fantasy-land api', t => {
  const m = Prod(99)

  t.equals(Prod['fantasy-land/empty'], Prod.empty, 'is same function as public constructor empty')

  t.equals(m['fantasy-land/empty'], m.empty, 'is same function as public instance empty')
  t.equals(m['fantasy-land/concat'], m.concat, 'is same function as public instance concat')
  t.equals(m['fantasy-land/equals'], m.equals, 'is same function as public instance equals')

  t.end()
})

test('Prod @@implements', t => {
  const f = Prod['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals')

  t.end()
})

test('Prod inspect', t => {
  const m = Prod(1)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Prod 1', 'returns inspect string')

  t.end()
})

test('Prod valueOf', t => {
  const empty = Prod.empty().valueOf()

  t.ok(isFunction(Prod(0).valueOf), 'is a function')

  t.equal(Prod(undefined).valueOf(), empty, 'provides an empty value for undefined')
  t.equal(Prod(null).valueOf(), empty, 'provides an empty value for null')

  t.equal(Prod(0).valueOf(), 0, 'provides a wrapped falsey number')
  t.equal(Prod(1).valueOf(), 1, 'provides a wrapped truthy number')

  t.end()
})

test('Prod type', t => {
  const m = Prod(0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(m.type, Prod.type, 'static and instance versions are the same')
  t.equal(m.type(), 'Prod', 'reports Prod')

  t.end()
})

test('Prod @@type', t => {
  const m = Prod(0)

  t.equal(m['@@type'], Prod['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/Prod@1', 'reports crocks/Prod@1')

  t.end()
})

test('Prod equals properties (Setoid)', t => {
  const a = Prod(4)
  const b = Prod(4)
  const c = Prod(3)
  const d = Prod(4)

  t.ok(isFunction(Prod(4).equals), 'provides an equals function')
  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Prod equals functionality', t => {
  const a = Prod(4)
  const b = Prod(4)
  const c = Prod(5)

  const value = 5
  const nonSum = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Prods are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Prods are equal')
  t.equal(a.equals(nonSum), false, 'returns false when passed a non-Prod')
  t.equal(c.equals(value), false, 'returns false when passed a simple value')

  t.end()
})

test('Prod concat properties (Semigroup)', t => {
  const a = Prod(45)
  const b = Prod(20)
  const c = Prod(35)

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Prod(0).concat), 'is a function')

  t.equal(left.valueOf(), right.valueOf(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns Semigroup of the same type')

  t.end()
})

test('Prod concat functionality', t => {
  const x = 8
  const y = 82

  const a = Prod(x)
  const b = Prod(y)

  const notProd = { type: constant('Prod...Not') }

  const cat = bindFunc(a.concat)

  const err = /Prod.concat: Prod required/
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
  t.throws(cat(notProd), err, 'throws with non-Prod')

  t.equals(a.concat(b).valueOf(), x * y, 'Multiplies wrapped values as expected')

  t.end()
})

test('Prod empty properties (Monoid)', t => {
  const m = Prod(17)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(right.valueOf(), m.valueOf(), 'right identity')
  t.equal(left.valueOf(), m.valueOf(), 'left identity')

  t.equal(m.empty().type(), m.type(), 'returns a Monoid of the same type')

  t.end()
})

test('Prod empty functionality', t => {
  const x = Prod(34).empty()

  t.equal(Prod(5).empty, Prod.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Prod', 'provides a Prod')
  t.equal(x.valueOf(), 1, 'wraps a 1')

  t.end()
})
