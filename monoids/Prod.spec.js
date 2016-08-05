const test    = require('tape')
const helpers = require('../test/helpers')

const isObject    = require('../internal/isObject')
const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc

const identity  = require('../combinators/identity')
const constant  = require('../combinators/constant')

const Prod = require('./Prod')

test('Prod', t => {
  const s = bindFunc(Prod)

  t.ok(isFunction(Prod), 'is a function')

  t.ok(isFunction(Prod.empty), 'provides an empty function')
  t.ok(isFunction(Prod.type), 'provides an type function')

  t.ok(isObject(Prod(0)), 'returns an object')

  t.throws(s(), TypeError, 'throws with nothing')
  t.throws(s(identity), TypeError, 'throws with a function')
  t.throws(s(''), TypeError, 'throws with falsey string')
  t.throws(s('string'), TypeError, 'throws with truthy string')
  t.throws(s(false), TypeError, 'throws with false')
  t.throws(s(true), TypeError, 'throws with true')
  t.throws(s([]), TypeError, 'throws with an array')
  t.throws(s({}), TypeError, 'throws with an object')

  t.doesNotThrow(s(undefined), 'allows undefined')
  t.doesNotThrow(s(null), 'allows null')
  t.doesNotThrow(s(0), 'allows a falsey number')
  t.doesNotThrow(s(1), 'allows a truthy number')

  t.end()
})

test('Prod inspect', t => {
  const m = Prod(1)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect(), 'Prod 1', 'returns inspect string')

  t.end()
})

test('Prod value', t => {
  const empty = Prod.empty().value()

  t.ok(isFunction(Prod(0).value), 'is a function')

  t.equal(Prod(undefined).value(), empty, 'provides an empty value for undefined')
  t.equal(Prod(null).value(), empty, 'provides an empty value for null ')

  t.equal(Prod(0).value(), 0, 'provides a wrapped falsey number')
  t.equal(Prod(1).value(), 1, 'provides a wrapped truthy number')

  t.end()
})

test('Prod type', t => {
  t.ok(isFunction(Prod(0).type), 'is a function')

  t.equal(Prod(0).type, Prod.type, 'static and instance versions are the same')
  t.equal(Prod(0).type(), 'Prod', 'reports the expected type (Prod)')

  t.end()
})

test('Prod concat properties (Semigroup)', t => {
  const a = Prod(45)
  const b = Prod(20)
  const c = Prod(35)

  const left  = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Prod(0).concat), 'is a function')

  t.equal(left.value(), right.value(), 'associativity')
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

  t.throws(cat(undefined), TypeError, 'throws when passed undefined')
  t.throws(cat(null), TypeError, 'throws when passed null')
  t.throws(cat(0), TypeError, 'throws when passed falsey number')
  t.throws(cat(1), TypeError, 'throws when passed truthy number')
  t.throws(cat(''), TypeError, 'throws when passed falsey string')
  t.throws(cat('string'), TypeError, 'throws when passed truthy string')
  t.throws(cat(false), TypeError, 'throws when passed false')
  t.throws(cat(true), TypeError, 'throws when passed true')
  t.throws(cat([]), TypeError, 'throws when passed array')
  t.throws(cat({}), TypeError, 'throws when passed object')
  t.throws(cat(notProd), TypeError, 'throws when passed non-Any')

  t.equals(a.concat(b).value(), (x * y), 'Multiplies wrapped values as expected')

  t.end()
})

test('Prod empty properties (Monoid)', t => {
  const m = Prod(17)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty())
  const left  = m.empty().concat(m)

  t.equal(right.value(), m.value(), 'right identity')
  t.equal(left.value(), m.value(), 'left identity')

  t.equal(m.empty().type(), m.type(), 'returns a Monoid of the same type')

  t.end()
})

test('Prod empty functionality', t => {
  const x = Prod(34).empty()

  t.equal(Prod(5).empty, Prod.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Prod', 'provides a Prod')
  t.equal(x.value(), 1, 'wraps a 1')

  t.end()
})
