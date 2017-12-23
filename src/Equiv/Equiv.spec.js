const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const compose = require('../core/compose')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const unit = require('../core/_unit')

const constant = x => () => x
const identity = x => x

const isSame =
  (x, y) => x === y

const Equiv = require('.')

test('Equiv', t => {
  const e = bindFunc(Equiv)

  t.ok(isFunction(Equiv), 'is a function')

  t.ok(isFunction(Equiv.type), 'provides a type function')
  t.ok(isFunction(Equiv.empty), 'provides an empty function')

  t.ok(isObject(Equiv(isSame)), 'returns an object')

  t.equals(Equiv(isSame).constructor, Equiv, 'provides TypeRep on constructor')

  const err = /Equiv: Comparison function required/
  t.throws(Equiv, err, 'throws with nothing')
  t.throws(e(undefined), err, 'throws with undefined')
  t.throws(e(null), err, 'throws with undefined')
  t.throws(e(0), err, 'throws with falsey number')
  t.throws(e(1), err, 'throws with truthy number')
  t.throws(e(''), err, 'throws with falsey string')
  t.throws(e('string'), err, 'throws with truthy string')
  t.throws(e(false), err, 'throws with false')
  t.throws(e(true), err, 'throws with true')
  t.throws(e({}), err, 'throws with an object')
  t.throws(e([]), err, 'throws with an array')

  t.doesNotThrow(e(unit), 'allows a function')

  t.end()
})

test('Equiv @@implements', t => {
  const f = Equiv['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('contramap'), true, 'implements contramap func')
  t.equal(f('empty'), true, 'implements empty func')

  t.end()
})

test('Equiv inspect', t => {
  const m = Equiv(isSame)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect(), 'Equiv Function', 'returns inspect string')

  t.end()
})

test('Equiv type', t => {
  t.equal(Equiv(isSame).type(), 'Equiv', 'type returns Equiv')
  t.equal(Equiv(isSame).type(), Equiv.type(), 'constructor and instance return same value')

  t.end()
})

test('Equiv compareWith', t => {
  const fn = sinon.spy(isSame)
  const m = Equiv(fn)

  const nonBoolEquiv =
    x => Equiv(constant(x)).compareWith(1, 1)

  t.equals(nonBoolEquiv(undefined), false, 'returns false when wrapped function returns undefined')
  t.equals(nonBoolEquiv(null), false, 'returns false when wrapped function returns null')
  t.equals(nonBoolEquiv(0), false, 'returns false when wrapped function returns falsey number')
  t.equals(nonBoolEquiv(1), true, 'returns true when wrapped function returns truthy number')
  t.equals(nonBoolEquiv(''), false, 'returns false when wrapped function returns falsey string')
  t.equals(nonBoolEquiv('string'), true, 'returns true when wrapped function returns truthy string')
  t.equals(nonBoolEquiv(false), false, 'returns false when wrapped function returns false')
  t.equals(nonBoolEquiv(true), true, 'returns true when wrapped function returns true')
  t.equals(nonBoolEquiv({}), true, 'returns true when wrapped function returns an object')
  t.equals(nonBoolEquiv([]), true, 'returns true when wrapped function returns an array')
  t.equals(nonBoolEquiv(unit), true, 'returns true when wrapped function returns a function')

  const result = m.compareWith(false, false)

  t.ok(fn.called, 'calls the wrapped function')
  t.equal(result, !!fn(false, false),'returns Boolean equiv result of the wrapped function' )

  t.end()
})

test('Equiv valueOf', t => {
  const e = Equiv(isSame)

  t.ok(isFunction(e.valueOf), 'is a function')
  t.equals(e.valueOf()(4, 5), !!isSame(4, 5), 'returns a coerced to Boolean version of the function')

  t.end()
})

test('Equiv contramap errors', t => {
  const cmap = bindFunc(Equiv(isSame).contramap)

  const err = /Equiv.contramap: Function required/
  t.throws(cmap(undefined), err, 'throws with undefined')
  t.throws(cmap(null), err, 'throws with null')
  t.throws(cmap(0), err, 'throws with falsey number')
  t.throws(cmap(1), err, 'throws with truthy number')
  t.throws(cmap(''), err, 'throws with falsey string')
  t.throws(cmap('string'), err, 'throws with truthy string')
  t.throws(cmap(false), err, 'throws with false')
  t.throws(cmap(true), err, 'throws with true')
  t.throws(cmap([]), err, 'throws with an array')
  t.throws(cmap({}), err, 'throws with an object')

  t.doesNotThrow(cmap(unit), 'allows functions')

  t.end()
})

test('Equiv contramap functionality', t => {
  const spy = sinon.spy(identity)

  const x = 23
  const y = 100

  const m = Equiv(isSame).contramap(spy)

  t.equal(m.type(), 'Equiv', 'returns an Equiv')
  t.notOk(spy.called, 'does not call mapping function initially')

  m.compareWith(x, y)

  t.ok(spy.called, 'calls mapping function when ran')

  t.equal(
    m.compareWith(x, y),
    isSame(x, y),
    'returns the Boolean equiv result of the resulting composition'
  )

  t.end()
})

test('Equiv contramap properties (Contra Functor)', t => {
  const m = Equiv(isSame)

  const f = x => x + 17
  const g = x => x * 3

  const x = 32
  const y = 23

  t.ok(isFunction(m.contramap), 'provides a contramap function')

  t.equal(
    m.contramap(identity).compareWith(x, y),
    m.compareWith(x, y),
    'identity'
  )

  t.equal(
    m.contramap(compose(f, g)).compareWith(x, y),
    m.contramap(f).contramap(g).compareWith(x, y),
    'composition'
  )

  t.end()
})

test('Equiv concat functionality', t => {
  const a = Equiv(constant(true))
  const b = Equiv(constant(false))

  const notEquiv = { type: constant('Equiv...Not') }

  const cat = bindFunc(a.concat)

  const err = /Equiv.concat: Equiv required/
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
  t.throws(cat(notEquiv), err, 'throws when passed non-Equiv')

  t.equal(a.concat(a).compareWith(1, 1), true, 'true to true reports true')
  t.equal(a.concat(b).compareWith(1, 1), false, 'true to false reports false')
  t.equal(b.concat(b).compareWith(1, 1), false, 'false to false reports false')

  t.end()
})

test('Equiv concat properties (Semigroup)', t => {
  const a = Equiv(constant(false))
  const b = Equiv(constant(true))
  const c = Equiv(constant(false))

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(left.compareWith('', ''), right.compareWith('', ''), 'associativity')

  t.equal(a.concat(b).type(), a.type(), 'returns an Equiv')

  t.end()
})

test('Equiv empty functionality', t => {
  const e = Equiv(identity).empty()

  t.equal(e.type(), 'Equiv', 'provides an Equiv')
  t.equal(e.compareWith('a', 'A'), true, 'provides a true value')

  t.end()
})

test('Equiv empty properties (Monoid)', t => {
  const m = Equiv(isSame)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(
    right.compareWith(34, 45),
    m.compareWith(34, 45),
    'right identity'
  )

  t.equal(
    left.compareWith(10, 10),
    m.compareWith(10, 10),
    'left identity'
  )

  t.end()
})
