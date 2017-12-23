const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const compose = require('../core/compose')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')

const constant = x => () => x
const identity = x => x

const Endo = require('.')

test('Endo', t => {
  const a = bindFunc(Endo)

  t.ok(isFunction(Endo), 'is a function')
  t.ok(isObject(Endo(identity)), 'returns an object')

  t.equals(Endo(identity).constructor, Endo, 'provides TypeRep on constructor')

  t.ok(isFunction(Endo.empty), 'provides an empty function')
  t.ok(isFunction(Endo.type), 'provides a type function')

  const err = /Endo: Function value required/
  t.throws(Endo, err, 'throws with nothing')
  t.throws(a(undefined), err, 'throws with undefined')
  t.throws(a(null), err, 'throws with null')
  t.throws(a(0), err, 'throws with falsey number')
  t.throws(a(1), err, 'throws with truthy number')
  t.throws(a(''), err, 'throws with falsey string')
  t.throws(a('string'), err, 'throws with truthy string')
  t.throws(a(false), err, 'throws with false')
  t.throws(a(true), err, 'throws with true')
  t.throws(a([]), err, 'throws with an array')
  t.throws(a({}), err, 'throws with an object')

  t.end()
})

test('Endo @@implements', t => {
  const f = Endo['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')

  t.end()
})

test('Endo inspect', t => {
  const m = Endo(identity)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Endo Function', 'returns inspect string')

  t.end()
})

test('Endo valueOf', t => {
  t.ok(isFunction(Endo(identity).valueOf), 'is a function')

  const x = 3
  const fn = sinon.spy(identity)

  const result = Endo(fn).valueOf()(x)

  t.equal(result, x, 'returns the expected value when result of `value` is called')
  t.ok(fn.calledWith(x), 'calls the internal function with the value passed to the result of `value`')

  t.end()
})

test('Endo runWith', t => {
  t.ok(isFunction(Endo(identity).runWith), 'is a function')

  const x = 23
  const fn = sinon.spy(identity)

  const result = Endo(fn).runWith(x)

  t.equal(result, x, 'returns the expected value when called')
  t.ok(fn.calledWith(x), 'calls the internal function, passing the value passed to it')

  t.end()
})

test('Endo type', t => {
  const m = Endo(identity)
  t.ok(isFunction(m.type), 'is a function')

  t.equal(m.type, Endo.type, 'static and instance versions are the same')
  t.equal(m.type(), 'Endo', 'reports Endo')

  t.end()
})

test('Endo concat properties (Semigroup)', t => {
  const concat = x => m => m.concat(x)

  const a = Endo(concat('a'))
  const b = Endo(concat('b'))
  const c = Endo(concat('c'))

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Endo(identity).concat), 'is a function')

  t.same(left.valueOf()(''), right.valueOf()(''), 'associativity')
  t.ok(isSameType(Endo, a.concat(b)), 'returns Semigroup of the same type')

  t.end()
})

test('Endo concat functionality', t => {
  const concat = x => m => m.concat(x)
  const f = concat('f')
  const g = concat('g')

  const result = compose(g, f)('')

  const a = Endo(f)
  const b = Endo(g)

  const notEndo = { type: constant('Endo...Not') }

  const cat = bindFunc(a.concat)

  const err = /Endo.concat: Endo required/
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
  t.throws(cat(notEndo), err, 'throws with non-Endo')

  t.same(a.concat(b).runWith(''), result, 'merges values as expected')

  t.end()
})

test('Endo empty properties (Monoid)', t => {
  const m = Endo(n => n + 10)
  const x = 23

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.same(right.runWith(x), m.runWith(x), 'right identity')
  t.same(left.runWith(x), m.runWith(x), 'left identity')

  t.ok(isSameType(Endo, m.empty()), 'returns a Monoid of the same type')

  t.end()
})

test('Endo empty functionality', t => {
  const m = Endo(identity).empty()
  const x = 34

  t.equal(m.empty, Endo.empty, 'static and instance versions are the same')

  t.same(m.runWith(x), x, 'provides identity for passed value')

  t.end()
})
