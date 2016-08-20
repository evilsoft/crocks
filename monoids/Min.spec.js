const test    = require('tape')
const helpers = require('../test/helpers')

const isObject    = require('../internal/isObject')
const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc

const identity  = require('../combinators/identity')
const constant  = require('../combinators/constant')

const Min = require('./Min')

test('Min', t => {
  const m = bindFunc(Min)

  t.ok(isFunction(Min), 'is a function')

  t.ok(isFunction(Min.empty), 'provides an empty function')
  t.ok(isFunction(Min.type), 'provides an type function')
  t.ok(isObject(Min(0)), 'returns an object')

  t.throws(Min, TypeError, 'throws with nothing')
  t.throws(m(identity), TypeError, 'throws with a function')
  t.throws(m(''), TypeError, 'throws with falsey string')
  t.throws(m('string'), TypeError, 'throws with truthy string')
  t.throws(m(false), TypeError, 'throws with false')
  t.throws(m(true), TypeError, 'throws with true')
  t.throws(m([]), TypeError, 'throws with an array')
  t.throws(m({}), TypeError, 'throws with an object')

  t.doesNotThrow(m(undefined), 'allows undefined')
  t.doesNotThrow(m(null), 'allows null')
  t.doesNotThrow(m(0), 'allows a falsey number')
  t.doesNotThrow(m(1), 'allows a truthy number')

  t.end()
})

test('Min inspect', t => {
  const m = Min(0)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Min 0', 'returns inspect string')

  t.end()
})

test('Min value', t => {
  const empty = Min.empty().value()

  t.ok(isFunction(Min(0).value), 'is a function')

  t.equal(Min(undefined).value(), empty, 'provides an empty value for undefined')
  t.equal(Min(null).value(), empty, 'provides an empty value for null')

  t.equal(Min(0).value(), 0, 'provides a wrapped falsey number')
  t.equal(Min(1).value(), 1, 'provides a wrapped truthy number')

  t.end()
})

test('Min type', t => {
  t.ok(isFunction(Min(0).type), 'is a function')

  t.equal(Min(0).type, Min.type, 'static and instance versions are the same')
  t.equal(Min(0).type(), 'Min', 'reports Min')

  t.end()
})

test('Min concat properties (Semigroup)', t => {
  const a = Min(45)
  const b = Min(20)
  const c = Min(35)

  const left  = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Min(0).concat), 'is a function')

  t.equal(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns Semigroup of the same type')

  t.end()
})

test('Min concat functionality', t => {
  const x = 5
  const y = 23

  const a = Min(x)
  const b = Min(y)

  const notMin = { type: constant('Min...Not') }

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
  t.throws(cat(notMin), TypeError, 'throws with non-Min')

  t.equals(a.concat(b).value(), x, 'provides min of wrapped values as expected')

  t.end()
})

test('Min empty properties (Monoid)', t => {
  const m = Min(32)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty())
  const left  = m.empty().concat(m)

  t.equal(right.value(), m.value(), 'right identity')
  t.equal(left.value(), m.value(), 'left identity')

  t.equal(m.empty().type(), m.type(), 'returns a Monoid of the same type')

  t.end()
})

test('Min empty functionality', t => {
  const x = Min(77).empty()

  t.equal(Min(0).empty, Min.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Min', 'provides a Min')
  t.equal(x.value(), Infinity, 'wraps an Infinity')

  t.end()
})
