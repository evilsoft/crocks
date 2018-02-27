const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')

const constant = x => () => x
const identity = x => x

const Min = require('.')

test('Min', t => {
  const m = bindFunc(Min)

  t.ok(isFunction(Min), 'is a function')
  t.ok(isObject(Min(0)), 'returns an object')

  t.ok(isFunction(Min.empty), 'provides an empty function')
  t.ok(isFunction(Min.type), 'provides a type function')
  t.ok(isString(Min['@@type']), 'provides a @@type string')

  t.equals(Min(0).constructor, Min, 'provides TypeRep on constructor')

  const err = /Min: Numeric value required/
  t.throws(Min, err, 'throws with nothing')
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

test('Min fantasy-land api', t => {
  const m = Min(0)

  t.equals(Min['fantasy-land/empty'], Min.empty, 'is same function as public constructor empty')

  t.equals(m['fantasy-land/empty'], m.empty, 'is same function as public instance empty')
  t.equals(m['fantasy-land/concat'], m.concat, 'is same function as public instance concat')

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
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
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
  const m = Min(0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(m.type, Min.type, 'static and instance versions are the same')
  t.equal(m.type(), 'Min', 'reports Min')

  t.end()
})

test('Min @@type', t => {
  const m = Min(0)

  t.equal(m['@@type'], Min['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/Min@1', 'reports crocks/Min@1')

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

  const err = /Min.concat: Min required/
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
  t.throws(cat(notMin), err, 'throws with non-Min')

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
