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

const Assign = require('.')

const constant = x => () => x
const identity = x => x

test('Assign', t => {
  const a = bindFunc(Assign)

  t.ok(isFunction(Assign), 'is a function')
  t.ok(isObject(Assign({})), 'returns an object')

  t.equals(Assign({}).constructor, Assign, 'provides TypeRep on constructor')

  t.ok(isFunction(Assign.empty), 'provides an empty function')
  t.ok(isFunction(Assign.type), 'provides a type function')
  t.ok(isString(Assign['@@type']), 'provides a @@type string')

  const err = /Assign: Object required/
  t.throws(Assign, err, 'throws with nothing')
  t.throws(a(identity), err, 'throws with a function')
  t.throws(a(0), err, 'throws with falsey number')
  t.throws(a(1), err, 'throws with truthy number')
  t.throws(a(''), err, 'throws with falsey string')
  t.throws(a('string'), err, 'throws with truthy string')
  t.throws(a(false), err, 'throws with false')
  t.throws(a(true), err, 'throws with true')
  t.throws(a([]), err, 'throws with an array')

  t.doesNotThrow(a(undefined), 'allows undefined')
  t.doesNotThrow(a(null), 'allows null')
  t.doesNotThrow(a({}), 'allows an object')

  t.end()
})

test('Assign fantasy-land api', t => {
  const m = Assign({})

  t.ok(isFunction(Assign[fl.empty]), 'provides empty function on constructor')

  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')

  t.end()
})

test('Assign @@implements', t => {
  const f = Assign['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals')
  t.end()
})

test('Assign inspect', t => {
  const m = Assign({ great: true })

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Assign { great: true }', 'returns inspect string')

  t.end()
})

test('Assign valueOf', t => {
  const empty = Assign.empty().valueOf()
  const x = {}

  t.ok(isFunction(Assign(x).valueOf), 'is a function')

  t.same(Assign(undefined).valueOf(), empty, 'provides an empty value for undefined')
  t.same(Assign(null).valueOf(), empty, 'provides an empty value for null')

  t.equal(Assign(x).valueOf(), x, 'provides the wrapped object')

  t.end()
})

test('Assign type', t => {
  t.ok(isFunction(Assign({}).type), 'is a function')

  t.equal(Assign({}).type, Assign.type, 'static and instance versions are the same')
  t.equal(Assign({}).type(), 'Assign', 'reports Assign')

  t.end()
})

test('Assign @@type', t => {
  t.equal(Assign({})['@@type'], Assign['@@type'], 'static and instance versions are the same')
  t.equal(Assign({})['@@type'], 'crocks/Assign@2', 'reports crocks/Assign@2')

  t.end()
})

test('Assign equals properties (Setoid)', t => {
  const a = Assign({ a: 5 })
  const b = Assign({ a: 5 })
  const c = Assign({ a: 5 })
  const d = Assign({ a: 'not' })

  const equals = laws.Setoid('equals')

  t.ok(isFunction(Assign({}).equals), 'provides an equals function')

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Assign fantasy-land equals properties (Setoid)', t => {
  const a = Assign({ a: 5 })
  const b = Assign({ a: 5 })
  const c = Assign({ a: 5 })
  const d = Assign({ a: 'not' })

  const equals = laws.Setoid(fl.equals)

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Assign equals functionality', t => {
  const a = Assign({ a: { b: 10 } })
  const b = Assign({ a: { b: 10 } })
  const c = Assign({})

  const value = {}
  const nonAssign = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Assigns are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Assigns are equal')
  t.equal(a.equals(nonAssign), false, 'returns false when passed a non-Assign')
  t.equal(c.equals(value), false, 'returns false when passed a simple value')

  t.end()
})

test('Assign concat properties (Semigroup)', t => {
  const a = Assign({ value: 'a' })
  const b = Assign({ value: 'b' })
  const c = Assign({ value: 'c' })

  const concat = laws.Semigroup(equals, 'concat')

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Assign fantasy-land concat properties (Semigroup)', t => {
  const a = Assign({ value: 'a' })
  const b = Assign({ value: 'b' })
  const c = Assign({ value: 'c' })

  const concat = laws.Semigroup(equals, fl.concat)

  t.ok(isFunction(a[fl.concat]), 'provides a concat function')
  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Assign concat functionality', t => {
  const x = { value: 'x', x: true }
  const y = { value: 'y', y: true }

  const result = { value: 'y', x: true, y: true }

  const a = Assign(x)
  const b = Assign(y)

  const notAssign = { type: constant('Assign...Not') }

  const cat = bindFunc(a.concat)

  const err = /Assign.concat: Assign required/
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
  t.throws(cat(notAssign), err, 'throws with non-Assign')

  t.same(a.concat(b).valueOf(), result, 'merges values as expected')

  t.end()
})

test('Assign concat fantasy-land errors', t => {
  const a = Assign({ value: 'x', x: true })
  const notAssign = { type: constant('Assign...Not') }

  const cat = bindFunc(a[fl.concat])

  const err = /Assign.fantasy-land\/concat: Assign required/
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
  t.throws(cat(notAssign), err, 'throws with non-Assign')

  t.end()
})

test('Assign empty properties (Monoid)', t => {
  const m = Assign({ value: 'm' })

  const empty = laws.Monoid(equals, 'empty', 'concat')

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.constructor.empty), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Assign fantasy-land empty properties (Monoid)', t => {
  const m = Assign({ value: 'm' })

  const empty = laws.Monoid(equals, fl.empty, fl.concat)

  t.ok(isFunction(m[fl.concat]), 'provides a concat function')
  t.ok(isFunction(m.constructor[fl.empty]), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Assign empty functionality', t => {
  const x = Assign({}).empty()

  t.equal(Assign({}).empty, Assign.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Assign', 'provides an Assign')
  t.same(x.valueOf(), {}, 'wraps an empty object')

  t.end()
})
