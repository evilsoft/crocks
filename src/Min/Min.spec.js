const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')

const constant = x => () => x
const identity = x => x

const Min = require('.')

test('Min', t => {
  const m = bindFunc(Min)

  t.ok(isFunction(Min), 'is a function')

  t.ok(isFunction(Min.empty), 'provides an empty function')
  t.ok(isFunction(Min.type), 'provides a type function')
  t.ok(isObject(Min(0)), 'returns an object')

  t.equals(Min(0).constructor, Min, 'provides TypeRep on constructor')

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

test('Min @@implements', t => {
  const f = Min['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')

  t.end()
})

test('Min inspect', t => {
  const m = Min(0)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Min 0', 'returns inspect string')

  t.end()
})

test('Min valueOf', t => {
  const empty = Min.empty().valueOf()

  t.ok(isFunction(Min(0).valueOf), 'is a function')

  t.equal(Min(undefined).valueOf(), empty, 'provides an empty value for undefined')
  t.equal(Min(null).valueOf(), empty, 'provides an empty value for null')

  t.equal(Min(0).valueOf(), 0, 'provides a wrapped falsey number')
  t.equal(Min(1).valueOf(), 1, 'provides a wrapped truthy number')

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

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Min(0).concat), 'is a function')

  t.equal(left.valueOf(), right.valueOf(), 'associativity')
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

  t.equals(a.concat(b).valueOf(), x, 'provides min of wrapped values as expected')

  t.end()
})

test('Min empty properties (Monoid)', t => {
  const m = Min(32)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(right.valueOf(), m.valueOf(), 'right identity')
  t.equal(left.valueOf(), m.valueOf(), 'left identity')

  t.equal(m.empty().type(), m.type(), 'returns a Monoid of the same type')

  t.end()
})

test('Min empty functionality', t => {
  const x = Min(77).empty()

  t.equal(Min(0).empty, Min.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Min', 'provides a Min')
  t.equal(x.valueOf(), Infinity, 'wraps an Infinity')

  t.end()
})
