const test  = require('tape')
const sinon = require('sinon')

const helpers = require('../test/helpers')

const noop      = helpers.noop
const bindFunc  = helpers.bindFunc

const t_comb    = require('../combinators/t_comb')
const composeB  = require('../combinators/composeB')
const i_comb    = require('../combinators/i_comb')

const Maybe = require('./Maybe')

test('Maybe', t => {
  const m = Maybe(0)

  t.equal(typeof Maybe, 'function', 'Maybe is a function')
  t.equal(typeof Maybe.of, 'function', 'Maybe provides an of function')

  t.equal(m.toString(), '[object Object]', 'Maybe returns an object')

  t.equal(typeof m.maybe, 'function', 'Maybe result provides a maybe function')
  t.equal(typeof m.type, 'function', 'Maybe result provides a type function')

  t.throws(Maybe, TypeError, 'Maybe throws when no parameters are passed')

  t.end()
})

test('Maybe type', t => {
  t.equal(Maybe(0).type(), 'Maybe', 'type returns Maybe')
  t.end()
})

test('Maybe maybe', t => {
  t.equal(Maybe(0).maybe(), 0, 'maybe returns 0 when 0 is wrapped')
  t.equal(Maybe(1).maybe(), 1, 'maybe returns 1 when 1 is wrapped')
  t.equal(Maybe('').maybe(), '', "maybe returns '' when '' is wrapped")
  t.equal(Maybe('string').maybe(), 'string', "maybe returns 'string' when 'string' is wrapped")
  t.equal(Maybe(false).maybe(), false, 'maybe returns false when false is wrapped')
  t.equal(Maybe(true).maybe(), true, 'maybe returns true when true is wrapped')

  t.equal(Maybe(null).maybe(), null, 'maybe returns null when null is wrapped')
  t.equal(Maybe(undefined).maybe(), null, 'maybe returns null when undefined is wrapped')
  t.end()
})

test('Maybe equals functionality', t => {
  const a = Maybe(0)
  const b = Maybe(0)
  const c = Maybe(1)

  const value = 0
  const nonMaybe = { type: 'Maybe...Not' }

  t.equals(a.equals(c), false, 'returns false when 2 Maybes are not equal')
  t.equals(a.equals(b), true, 'returns true when 2 Maybes are equal')
  t.equals(a.equals(value), false, 'returns false when passed a simple value')
  t.equals(a.equals(nonMaybe), false, 'returns false when passed a non-Maybe')

  t.end()
})

test('Maybe equals properties (Setoid)', t => {
  const a = Maybe(0)
  const b = Maybe(0)
  const c = Maybe(1)
  const d = Maybe(0)

  t.equal(typeof Maybe(0).equals, 'function', 'provides an equals function')

  t.equals(a.equals(a), true, 'reflexivity')
  t.equals(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equals(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equals(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Maybe map errors', t => {
  const map = bindFunc(Maybe(0).map)

  t.throws(map(0), TypeError, 'throws when passed a falsey number')
  t.throws(map(1), TypeError, 'throws when passed a truthy number')
  t.throws(map(''), TypeError, 'throws when passed a falsey string')
  t.throws(map('string'), TypeError, 'throws when passed a truthy string')
  t.throws(map(false), TypeError, 'throws when passed false')
  t.throws(map(true), TypeError, 'throws when passed true')
  t.throws(map(null), TypeError, 'throws when passed null')
  t.throws(map(undefined), TypeError, 'throws when passed undefined')
  t.throws(map([]), TypeError, 'throws when passed an array')
  t.throws(map({}), TypeError, 'throws when passed an object')
  t.doesNotThrow(map(noop), 'does not throw when passed a function')

  t.end()
})

test('Maybe map functionality', t => {
  const spy = sinon.spy(i_comb)

  t.equal(Maybe(0).map(i_comb).type(), 'Maybe', 'returns a Maybe')

  const undef = Maybe(undefined).map(spy)

  t.equal(undef.type(), 'Maybe', 'returns a Maybe when undefined')
  t.equal(undef.maybe(), null, 'returns a Maybe with a null value')
  t.equal(spy.called, false, 'mapped function is never called when undefined')

  const def = Maybe(0).map(spy)

  t.equal(def.type(), 'Maybe', 'returns a Maybe when not undefined')
  t.equal(def.maybe(), 0, 'returns a Maybe with the same value when mapped with identity')
  t.equal(spy.called, true, 'mapped function is called when not undefined')

  t.end()
})

test('Maybe map properties (Functor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  t.equal(typeof Maybe(0).map, 'function', 'provides a map function')

  t.equal(Maybe(0).map(i_comb).maybe(), 0, 'identity')
  t.equals(Maybe(10).map(x => f(g(x))).maybe(), Maybe(10).map(g).map(f).maybe(), 'composition')

  t.end()
})

test('Maybe ap errors', t => {
  const m   = { type: () => 'Maybe...Not' }

  t.throws(Maybe(0).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is a falsey number')
  t.throws(Maybe(1).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is a truthy number')
  t.throws(Maybe('').ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is a falsey string')
  t.throws(Maybe('string').ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is a truthy string')
  t.throws(Maybe(false).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is false')
  t.throws(Maybe(true).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is true')
  t.throws(Maybe([]).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is an array')
  t.throws(Maybe({}).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is an object')

  t.throws(Maybe(noop).ap.bind(null, 0), TypeError, 'throws when passed a falsey number')
  t.throws(Maybe(noop).ap.bind(null, 1), TypeError, 'throws when passed a truthy number')
  t.throws(Maybe(noop).ap.bind(null, ''), TypeError, 'throws when passed a falsey string')
  t.throws(Maybe(noop).ap.bind(null, 'string'), TypeError, 'throws when passed a truthy string')
  t.throws(Maybe(noop).ap.bind(null, false), TypeError, 'throws when passed false')
  t.throws(Maybe(noop).ap.bind(null, true), TypeError, 'throws when passed true')
  t.throws(Maybe(noop).ap.bind(null, []), TypeError, 'throws when passed an array')
  t.throws(Maybe(noop).ap.bind(null, {}), TypeError, 'throws when passed an object')

  t.throws(Maybe(noop).ap.bind(null, m), TypeError, 'throws when container types differ')

  t.end()
})

test('Maybe ap properties (Apply)', t => {
  const m = Maybe(i_comb)

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.equal(typeof Maybe(0).ap, 'function', 'provides an ap function')
  t.equal(typeof Maybe(0).map, 'function', 'implements the Functor spec')

  t.equal(a.ap(Maybe(3)).maybe(), b.ap(Maybe(3)).maybe(), 'composition Just')
  t.equal(a.ap(Maybe(undefined)).maybe(), b.ap(Maybe(undefined)).maybe(), 'composition Nothing')

  t.end()
})

test('Maybe of', t => {
  t.equal(Maybe.of, Maybe(0).of, 'Maybe.of is the same as the instance version')
  t.equal(Maybe.of(0).type(), 'Maybe', 'returns a Maybe')
  t.equal(Maybe.of(0).maybe(), 0, 'wraps the value passed into a Maybe')

  t.end()
})

test('Maybe of properties (Applicative)', t => {
  const m = Maybe(i_comb)

  t.equal(typeof Maybe(0).of, 'function', 'provides an of function')
  t.equal(typeof Maybe(0).ap, 'function', 'implements the Apply spec')

  t.equal(m.ap(Maybe(3)).maybe(), 3, 'identity Just')
  t.equal(m.ap(Maybe(undefined)).maybe(), null, 'identity Nothing')

  t.equal(m.ap(Maybe.of(3)).maybe(), Maybe.of(i_comb(3)).maybe(), 'homomorphism Just')
  t.equal(m.ap(Maybe.of(undefined)).maybe(), Maybe.of(i_comb(undefined)).maybe(), 'homomorphism Nothing')

  const a = x => m.ap(Maybe.of(x))
  const b = x => Maybe.of(t_comb(x)).ap(m)

  t.equal(a(3).maybe(), b(3).maybe(), 'interchange Just')
  t.equal(a(undefined).maybe(), b(undefined).maybe(), 'interchange Nothing')

  t.end()
})

test('Maybe chain errors', t => {
  const chain = bindFunc(Maybe(0).chain)

  t.throws(chain(0), TypeError, 'throws when passed a falsey number')
  t.throws(chain(1), TypeError, 'throws when passed a truthy number')
  t.throws(chain(''), TypeError, 'throws when passed a falsey string')
  t.throws(chain('string'), TypeError, 'throws when passed a truthy string')
  t.throws(chain(false), TypeError, 'throws when passed false')
  t.throws(chain(true), TypeError, 'throws when passed true')
  t.throws(chain(null), TypeError, 'throws when passed null')
  t.throws(chain(undefined), TypeError, 'throws when passed undefined')
  t.throws(chain([]), TypeError, 'throws when passed an array')
  t.throws(chain({}), TypeError, 'throws when passed an object')
  t.doesNotThrow(chain(noop), 'does not throw when passed a function')

  t.end()
})

test('Maybe chain properties (Chain)', t => {
  t.equal(typeof Maybe(0).chain, 'function', 'provides a chain function')
  t.equal(typeof Maybe(0).ap, 'function', 'implements the Apply spec')

  const f = x => Maybe(x + 2)
  const g = x => Maybe(x + 10)

  const a = x => Maybe(x).chain(f).chain(g)
  const b = x => Maybe(x).chain(y => f(y).chain(g))

  t.equal(a(10).maybe(), b(10).maybe(), 'assosiativity Just')
  t.equal(a(null).maybe(), b(null).maybe(), 'assosiativity Nothing')

  t.end()
})

test('Maybe chain properties (Monad)', t => {
  t.equal(typeof Maybe(0).chain, 'function', 'implements the Chain spec')
  t.equal(typeof Maybe(0).of, 'function', 'implements the Applicative spec')

  const f = x => Maybe(x)

  t.equal(Maybe.of(3).chain(f).maybe(), f(3).maybe(), 'left identity Just')
  t.equal(Maybe.of(null).chain(f).maybe(), f(null).maybe(), 'left identity Nothing')

  const m = x => Maybe(x)

  t.equal(m(3).chain(Maybe.of).maybe(), m(3).maybe(), 'right identity Just')
  t.equal(m(null).chain(Maybe.of).maybe(), m(null).maybe(), 'right identity Nothing')

  t.end()
})
