const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')

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

  t.throws(Sum, TypeError, 'throws with nothing')
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

test('Sum @@implements', t => {
  const f = Sum['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')

  t.end()
})

test('Sum inspect', t => {
  const m = Sum(90)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
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
  t.ok(isFunction(Sum(0).type), 'is a function')

  t.equal(Sum(0).type, Sum.type, 'static and instance versions are the same')
  t.equal(Sum(0).type(), 'Sum', 'reports Sum')

  t.end()
})

test('Sum concat properties (Semigroup)', t => {
  const a = Sum(45)
  const b = Sum(20)
  const c = Sum(35)

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Sum(0).concat), 'is a function')

  t.equal(left.valueOf(), right.valueOf(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns Semigroup of the same type')

  t.end()
})

test('Sum concat functionality', t => {
  const x = 5
  const y = 23

  const a = Sum(x)
  const b = Sum(y)

  const notSum = { type: constant('Sum...Not') }

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
  t.throws(cat(notSum), TypeError, 'throws with non-Sum')

  t.equals(a.concat(b).valueOf(), (x + y), 'sums wrapped values as expected')

  t.end()
})

test('Sum empty properties (Monoid)', t => {
  const m = Sum(32)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(right.valueOf(), m.valueOf(), 'right identity')
  t.equal(left.valueOf(), m.valueOf(), 'left identity')

  t.equal(m.empty().type(), m.type(), 'returns a Monoid of the same type')

  t.end()
})

test('Sum empty functionality', t => {
  const x = Sum(85).empty()

  t.equal(Sum(0).empty, Sum.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Sum', 'provides a Sum')
  t.equal(x.valueOf(), 0, 'wraps a 0')

  t.end()
})
