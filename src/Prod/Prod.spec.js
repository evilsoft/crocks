const test= require('tape')
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

  t.ok(isFunction(Prod[fl.empty]), 'provides empty function on constructor')

  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')

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
  t.equal(m['@@type'], 'crocks/Prod@2', 'reports crocks/Prod@2')

  t.end()
})

test('Prod equals properties (Setoid)', t => {
  const a = Prod(4)
  const b = Prod(4)
  const c = Prod(4)
  const d = Prod(3)

  const equals = laws.Setoid('equals')

  t.ok(isFunction(Prod(4).equals), 'provides an equals function')

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Prod fantasy-land equals properties (Setoid)', t => {
  const a = Prod(10)
  const b = Prod(10)
  const c = Prod(10)
  const d = Prod(0)

  const equals = laws.Setoid(fl.equals)

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

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

  const concat = laws.Semigroup(equals, 'concat')

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Prod fantasy-land concat properties (Semigroup)', t => {
  const a = Prod(45)
  const b = Prod(20)
  const c = Prod(35)

  const concat = laws.Semigroup(equals, fl.concat)

  t.ok(isFunction(a[fl.concat]), 'provides a concat function')
  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Prod concat errors', t => {
  const a = Prod(8)
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

  t.end()
})

test('Prod concat fantasy-land errors', t => {
  const a = Prod(8)
  const notProd = { type: constant('Prod...Not') }

  const cat = bindFunc(a[fl.concat])

  const err = /Prod.fantasy-land\/concat: Prod required/
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

  t.end()
})

test('Prod concat functionality', t => {
  const x = 8
  const y = 82

  const a = Prod(x)
  const b = Prod(y)

  t.equals(a.concat(b).valueOf(), x * y, 'Multiplies wrapped values as expected')

  t.end()
})

test('Prod empty properties (Monoid)', t => {
  const m = Prod(17)

  const empty = laws.Monoid(equals, 'empty', 'concat')

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.constructor.empty), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Prod fantasy-land empty properties (Monoid)', t => {
  const m = Prod(33)

  const empty = laws.Monoid(equals, fl.empty, fl.concat)

  t.ok(isFunction(m[fl.concat]), 'provides a concat function')
  t.ok(isFunction(m.constructor[fl.empty]), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Prod empty functionality', t => {
  const x = Prod(34).empty()

  t.equal(Prod(5).empty, Prod.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Prod', 'provides a Prod')
  t.equal(x.valueOf(), 1, 'wraps a 1')

  t.end()
})
