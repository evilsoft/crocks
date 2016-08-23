const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const isObject    = require('../internal/isObject')
const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const identity      = require('../combinators/identity')
const composeB      = require('../combinators/composeB')
const reverseApply  = require('../combinators/composeB')

const MockCrock = require('../test/MockCrock')

const Null = require('./Null')

test('Null', t => {
  const m = Null(0)

  t.ok(isFunction(Null), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Null.type), 'provides a type function')
  t.ok(isFunction(Null.empty), 'provides an empty function')

  t.doesNotThrow(Null, 'allows no parameters')

  t.end()
})

test('Null inspect', t => {
  const m = Null(0)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect(), 'Null', 'returns inspect string')

  t.end()
})

test('Null type', t => {
  const m = Null(0)

  t.ok(isFunction(m.type), 'provides a type function')
  t.equal(m.type(), 'Null', 'type returns Null')

  t.end()
})

test('Null value', t => {
  const x = 'some value'
  const m = Null(x)

  t.ok(isFunction(m.value), 'is a function')
  t.equal(m.value(), null,'value always returns null' )

  t.end()
})

test('Null equals functionality', t => {
  const a = Null(0)
  const b = Null(0)
  const c = Null(1)

  const value = 0
  const nonNull = MockCrock(value)

  t.equal(a.equals(c), true, 'returns true when 2 Nulls initial values are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Nulls initial values are equal')
  t.equal(a.equals(value), false, 'returns false when passed a simple value')
  t.equal(a.equals(nonNull), false, 'returns false when passed a non-Null')

  t.end()
})

test('Null equals properties (Setoid)', t => {
  const a = Null(0)
  const b = Null(0)
  const c = Null(1)
  const d = Null(0)

  t.ok(isFunction(Null(0).equals), 'provides an equals function')
  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Null concat properties (Semigoup)', t => {
  const a = Null(0)
  const b = Null(true)
  const c = Null('')

  const left  = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns a Null')

  t.end()
})

test('Null concat functionality', t => {
  const a = Null(23)
  const b = Null(null)

  const notNull = MockCrock()

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
  t.throws(cat(notNull), TypeError, 'throws when passed non-Null')

  t.equal(a.concat(b).value(), null, 'reports null for 23')
  t.equal(b.concat(a).value(), null, 'null for true')

  t.end()
})

test('Null empty properties (Monoid)', t => {
  const m = Null(3)

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left  = m.empty().concat(m)

  t.equal(right.value(), m.value(), 'right identity')
  t.equal(left.value(), m.value(), 'left identity')

  t.end()
})

test('Null empty functionality', t => {
  const x = Null(0).empty()

  t.equal(x.type(), 'Null', 'provides a Null')
  t.equal(x.value(), null, 'wraps a null value')

  t.end()
})

test('Null map errors', t => {
  const map = bindFunc(Null(0).map)

  t.throws(map(undefined), TypeError, 'throws when passed undefined')
  t.throws(map(null), TypeError, 'throws when passed null')
  t.throws(map(0), TypeError, 'throws when passed falsey number')
  t.throws(map(1), TypeError, 'throws when passed truthy number')
  t.throws(map(''), TypeError, 'throws when passed falsey string')
  t.throws(map('string'), TypeError, 'throws when passed truthy string')
  t.throws(map(false), TypeError, 'throws when passed false')
  t.throws(map(true), TypeError, 'throws when passed true')
  t.throws(map([]), TypeError, 'throws when passed an array')
  t.throws(map({}), TypeError, 'throws when passed an object')
  t.doesNotThrow(map(noop))

  t.end()
})

test('Null map functionality', t => {
  const spy = sinon.spy(x => x + 2)
  const x   = 42

  const m = Null(x).map(spy)

  t.equal(m.type(), 'Null', 'returns a Null')
  t.notOk(spy.called, 'does not call mapping function')
  t.equal(m.value(), null, 'returns null')

  t.end()
})

test('Null map properties (Functor)', t => {
  const m = Null(10)

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).value(), m.value(), 'identity')
  t.equal(m.map(composeB(f, g)).value(), m.map(g).map(f).value(), 'composition')

  t.end()
})

test('Null ap errors', t => {
  const m  = MockCrock('joy')
  const ap = bindFunc(Null(32).ap)

  t.throws(ap(undefined), TypeError, 'throws when passed undefined')
  t.throws(ap(null), TypeError, 'throws when passed null')
  t.throws(ap(0), TypeError, 'throws when passed a falsey number')
  t.throws(ap(1), TypeError, 'throws when passed a truthy number')
  t.throws(ap(''), TypeError, 'throws when passed a falsey string')
  t.throws(ap('string'), TypeError, 'throws when passed a truthy string')
  t.throws(ap(false), TypeError, 'throws when passed false')
  t.throws(ap(true), TypeError, 'throws when passed true')
  t.throws(ap([]), TypeError, 'throws when passed an array')
  t.throws(ap({}), TypeError, 'throws when passed an object')

  t.throws(ap(m), TypeError, 'throws when container types differ')

  t.end()
})

test('Null ap properties (Apply)', t => {
  const m = Null({ some: 'thing' })

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(Null(0).map), 'implements the Functor spec')
  t.ok(isFunction(Null(0).ap), 'provides an ap function')

  t.same(a.ap(Null(3)).value(), b.ap(Null(3)).value(), 'composition')

  t.end()
})

test('Null of', t => {
  t.equal(Null.of, Null(0).of, 'Null.of is the same as the instance version')
  t.equal(Null.of(0).type(), 'Null', 'returns a Null')
  t.equal(Null.of(0).value(), null, 'returns the default null value')

  t.end()
})

test('Null of properties (Applicative)', t => {
  const m = Null(identity)

  t.ok(isFunction(Null(0).of), 'provides an of function')
  t.ok(isFunction(Null(0).ap), 'implements the Apply spec')

  t.equal(m.ap(Null(3)).value(), null, 'identity')
  t.equal(m.ap(Null.of(3)).value(), Null.of(identity(3)).value(), 'homomorphism')

  const a = x => m.ap(Null.of(x))
  const b = x => Null.of(reverseApply(x)).ap(m)

  t.equal(a(3).value(), b(3).value(), 'interchange')

  t.end()
})

test('Null chain errors', t => {
  const chain = bindFunc(Null(0).chain)

  t.throws(chain(undefined), TypeError, 'throws with undefined')
  t.throws(chain(null), TypeError, 'throws with null')
  t.throws(chain(0), TypeError, 'throws with falsey number')
  t.throws(chain(1), TypeError, 'throws with truthy number')
  t.throws(chain(''), TypeError, 'throws with falsey string')
  t.throws(chain('string'), TypeError, 'throws with truthy string')
  t.throws(chain(false), TypeError, 'throws with false')
  t.throws(chain(true), TypeError, 'throws with true')
  t.throws(chain([]), TypeError, 'throws with an array')
  t.throws(chain({}), TypeError, 'throws with an object')

  t.doesNotThrow(chain(noop), 'allows any function')

  t.end()
})

test('Null chain properties (Chain)', t => {
  t.ok(isFunction(Null(0).chain), 'provides a chain function')
  t.ok(isFunction(Null(0).ap), 'implements the Apply spec')

  const f = x => Null(x + 2)
  const g = x => Null(x + 10)

  const a = x => Null(x).chain(f).chain(g)
  const b = x => Null(x).chain(y => f(y).chain(g))

  t.equal(a(10).value(), b(10).value(), 'assosiativity')

  t.end()
})

test('Identity chain properties (Monad)', t => {
  t.ok(isFunction(Null(0).chain), 'implements the Chain spec')
  t.ok(isFunction(Null(0).of), 'implements the Applicative spec')

  const f = x => Null(x)

  t.equal(Null.of(56).chain(f).value(), f(56).value(), 'left identity')

  t.equal(f(3).chain(Null.of).value(), f(3).value(), 'right identity')

  t.end()
})
