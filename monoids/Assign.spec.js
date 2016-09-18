const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const isObject = require('../internal/isObject')
const isFunction = require('../internal/isFunction')

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')

const Assign = require('./Assign')

test('Assign', t => {
  const a = bindFunc(Assign)

  t.ok(isFunction(Assign), 'is a function')
  t.ok(isObject(Assign({})), 'returns an object')

  t.ok(isFunction(Assign.empty), 'provides an empty function')
  t.ok(isFunction(Assign.type), 'provides an type function')

  t.throws(Assign, TypeError, 'throws with nothing')
  t.throws(a(identity), TypeError, 'throws with a function')
  t.throws(a(0), TypeError, 'throws with falsey number')
  t.throws(a(1), TypeError, 'throws with truthy number')
  t.throws(a(''), TypeError, 'throws with falsey string')
  t.throws(a('string'), TypeError, 'throws with truthy string')
  t.throws(a(false), TypeError, 'throws with false')
  t.throws(a(true), TypeError, 'throws with true')
  t.throws(a([]), TypeError, 'throws with an array')

  t.doesNotThrow(a(undefined), 'allows undefined')
  t.doesNotThrow(a(null), 'allows null')
  t.doesNotThrow(a({}), 'allows an object')

  t.end()
})

test('Assign inspect', t => {
  const m = Assign({ great: true })

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Assign {}', 'returns inspect string')

  t.end()
})

test('Assign value', t => {
  const empty = Assign.empty().value()
  const x = {}

  t.ok(isFunction(Assign(x).value), 'is a function')

  t.same(Assign(undefined).value(), empty, 'provides an empty value for undefined')
  t.same(Assign(null).value(), empty, 'provides an empty value for null')

  t.equal(Assign(x).value(), x, 'provides the wrapped object')

  t.end()
})

test('Assign type', t => {
  t.ok(isFunction(Assign({}).type), 'is a function')

  t.equal(Assign({}).type, Assign.type, 'static and instance versions are the same')
  t.equal(Assign({}).type(), 'Assign', 'reports Assign')

  t.end()
})

test('Assign concat properties (Semigroup)', t => {
  const a = Assign({ value: 'a' })
  const b = Assign({ value: 'b' })
  const c = Assign({ value: 'c' })

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Assign({}).concat), 'is a function')

  t.same(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns Semigroup of the same type')

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
  t.throws(cat(notAssign), TypeError, 'throws with non-Assign')

  t.same(a.concat(b).value(), result, 'merges values as expected')

  t.end()
})

test('Assign empty properties (Monoid)', t => {
  const m = Assign({ value: 'm' })

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.same(right.value(), m.value(), 'right identity')
  t.same(left.value(), m.value(), 'left identity')

  t.equal(m.empty().type(), m.type(), 'returns a Monoid of the same type')

  t.end()
})

test('Assign empty functionality', t => {
  const x = Assign({}).empty()

  t.equal(Assign({}).empty, Assign.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Assign', 'provides an Assign')
  t.same(x.value(), {}, 'wraps an empty object')

  t.end()
})
