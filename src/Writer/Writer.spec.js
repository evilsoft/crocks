const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')
const Last = require('../test/LastMonoid')

const bindFunc = helpers.bindFunc

const Pair = require('../core/Pair')
const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const identity = x => x

const reverseApply =
  x => fn => fn(x)

const _Writer = require('.')
const Writer = _Writer(Last)

test('Writer construction', t => {
  const w = bindFunc(_Writer)

  t.throws(w(undefined), TypeError, 'throws with undefined')
  t.throws(w(null), TypeError, 'throws with null')
  t.throws(w(0), TypeError, 'throws with falsey number')
  t.throws(w(1), TypeError, 'throws with truthy number')
  t.throws(w(''), TypeError, 'throws with falsey string')
  t.throws(w('string'), TypeError, 'throws with truthy string')
  t.throws(w(false), TypeError, 'throws with false')
  t.throws(w(true), TypeError, 'throws with true')
  t.throws(w([]), TypeError, 'throws with an array')
  t.throws(w({}), TypeError, 'throws with an object')
  t.throws(w(unit), TypeError, 'throws with a function')

  t.doesNotThrow(w(Last), 'allows a Monoid')
  t.end()
})

test('Writer', t => {
  const w = Writer(0, 0)
  const f = bindFunc(Writer)

  t.ok(isFunction(Writer), 'is a function')
  t.ok(isObject(w), 'returns an object')

  t.equals(Writer(0, 0).constructor, Writer, 'provides TypeRep on constructor')

  t.ok(isFunction(Writer.of), 'provides an of function')
  t.ok(isFunction(Writer.type), 'provides a type function')

  t.throws(f(), TypeError, 'throws with no parameters')
  t.throws(f(0), TypeError, 'throws with one parameter')

  t.end()
})

test('Writer @@implements', t => {
  const f = Writer['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')

  t.end()
})

test('Writer inspect', t => {
  const m = Writer(0, 0)


  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Writer( Last 0 0 )', 'returns inspect string')

  t.end()
})

test('Writer type', t => {
  const m = Writer(0, 0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(m.type(), 'Writer( Last )', 'returns Writer with Monoid Type')
  t.end()
})

test('Writer read', t => {
  const x = 'some value'
  const l = 'some log'
  const m = Writer(l, x)

  t.ok(isFunction(m.read), 'is a function')
  t.ok(isSameType(Pair, m.read()), 'returns a Pair')

  t.equal(m.read().snd(), x, 'returns the value on the value snd')
  t.same(m.read().fst().valueOf(), l, 'returns log Monoid')

  t.end()
})

test('Writer valueOf', t => {
  const x = 34
  const w = Writer(0, x)

  t.ok(isFunction(w.valueOf), 'is a function')
  t.equal(w.valueOf(), x, 'provides wrapped value')

  t.end()
})

test('Writer log', t => {
  const x = 'log entry'
  const w = Writer(x, 0)

  t.ok(isFunction(w.log), 'is a function')
  t.equal(w.log().type(), 'Last', 'returns a monoid')
  t.equal(w.log().valueOf(), x, 'monoid contains log value')

  t.end()
})

test('Writer equals functionality', t => {
  const a = Writer(23, 0)
  const b = Writer(15, 0)
  const c = Writer(23, 1)

  const value = 0
  const nonWriter = { type: 'Writer...Not' }

  t.equals(a.equals(c), false, 'returns false when 2 Writers values are not equal')
  t.equals(a.equals(b), true, 'returns true when 2 Writers values are equal')
  t.equals(a.equals(value), false, 'returns false when passed a simple value')
  t.equals(a.equals(nonWriter), false, 'returns false when passed a non-Writer')

  t.end()
})

test('Writer equals properties (Setoid)', t => {
  const a = Writer('seg', 0)
  const b = Writer(false, 0)
  const c = Writer(null, 1)
  const d = Writer(3, 0)

  t.ok(isFunction(a.equals), 'provides an equals function')
  t.equals(a.equals(a), true, 'reflexivity')
  t.equals(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equals(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equals(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Writer map errors', t => {
  const map = bindFunc(Writer(0, 0).map)

  t.throws(map(undefined), TypeError, 'throws with undefined')
  t.throws(map(null), TypeError, 'throws with null')
  t.throws(map(0), TypeError, 'throws with falsey number')
  t.throws(map(1), TypeError, 'throws with truthy number')
  t.throws(map(''), TypeError, 'throws with falsey string')
  t.throws(map('string'), TypeError, 'throws with truthy string')
  t.throws(map(false), TypeError, 'throws with false')
  t.throws(map(true), TypeError, 'throws with true')
  t.throws(map([]), TypeError, 'throws with an array')
  t.throws(map({}), TypeError, 'throws with an object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Writer map functionality', t => {
  const spy = sinon.spy(identity)
  const x = 42
  const l = 'log'

  const m = Writer(l, x).map(spy)

  t.equal(m.type(), 'Writer( Last )', 'returns a Writer')
  t.equal(spy.called, true, 'calls mapping function')
  t.equal(m.valueOf(), x, 'returns the result of the map inside of new Writer, on value key')
  t.same(m.log().valueOf(), l, 'returns the result of the map inside of new Writer, on log key')

  t.same(m.map(identity).log().valueOf(), l, 'does not add to the log on map')

  t.end()
})

test('Writer map properties (Functor)', t => {
  const m = Writer('blop', 49)

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).valueOf(), m.valueOf(), 'identity')
  t.equal(m.map(compose(f, g)).valueOf(), m.map(g).map(f).valueOf(), 'composition')

  t.end()
})

test('Writer ap errors', t => {
  const m = { type: () => 'Writer...Not' }
  const w = Writer(0, 0)
  const ap = bindFunc(Writer(0, unit).ap)

  t.throws(Writer(0, undefined).ap.bind(null, w), TypeError, 'throws when wrapped value is undefined')
  t.throws(Writer(0, null).ap.bind(null, w), TypeError, 'throws when wrapped value is null')
  t.throws(Writer(0, 0).ap.bind(null, w), TypeError, 'throws when wrapped value is a falsey number')
  t.throws(Writer(0, 1).ap.bind(null, w), TypeError, 'throws when wrapped value is a truthy number')
  t.throws(Writer(0, '').ap.bind(null, w), TypeError, 'throws when wrapped value is a falsey string')
  t.throws(Writer(0, 'string').ap.bind(null, w), TypeError, 'throws when wrapped value is a truthy string')
  t.throws(Writer(0, false).ap.bind(null, w), TypeError, 'throws when wrapped value is false')
  t.throws(Writer(0, true).ap.bind(null, w), TypeError, 'throws when wrapped value is true')
  t.throws(Writer(0, []).ap.bind(null, w), TypeError, 'throws when wrapped value is an array')
  t.throws(Writer(0, {}).ap.bind(null, w), TypeError, 'throws when wrapped value is an object')

  t.throws(ap(undefined), TypeError, 'throws with undefined')
  t.throws(ap(null), TypeError, 'throws with null')
  t.throws(ap(0), TypeError, 'throws with falsey number')
  t.throws(ap(1), TypeError, 'throws with truthy number')
  t.throws(ap(''), TypeError, 'throws with falsey string')
  t.throws(ap('string'), TypeError, 'throws with truthy string')
  t.throws(ap(false), TypeError, 'throws with false')
  t.throws(ap(true), TypeError, 'throws with true')
  t.throws(ap([]), TypeError, 'throws with an array')
  t.throws(ap({}), TypeError, 'throws with an object')
  t.throws(ap(m), TypeError, 'throws with Non-Writer')

  t.doesNotThrow(ap(Writer(0, 0)), 'allows a Writer')

  t.end()
})

test('Writer ap properties (Apply)', t => {
  const m = Writer(0, identity)

  const a = m.map(compose).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(m.map), 'implements the Functor spec')
  t.ok(isFunction(m.ap), 'provides an ap function')

  t.equal(a.ap(Writer(0, 3)).valueOf(), b.ap(Writer(0, 3)).valueOf(), 'composition')

  t.end()
})

test('Writer ap functionality', t => {
  const a = Writer(0, x => x + 2)
  const b = Writer(1, 27)

  t.same(a.ap(b).log().valueOf(), 1, 'concats applied Writers log to inital log')
  t.equal(a.ap(b).valueOf(), 29, 'applys applied value to function')

  t.end()
})

test('Writer of', t => {
  const w = Writer.of(0)

  t.equal(Writer.of, Writer(0, 0).of, 'Writer.of is the same as the instance version')

  t.equal(w.type(), 'Writer( Last )', 'returns an Writer')
  t.equal(w.valueOf(), 0, 'wraps the value passed into a Writer')
  t.same(w.log().valueOf(), Last.empty().valueOf(), 'provides an empty Monoid as the log')

  t.end()
})

test('Writer of properties (Applicative)', t => {
  const m = Writer(0, identity)

  t.ok(isFunction(m.of), 'provides an of function')
  t.ok(isFunction(m.ap), 'implements the Apply spec')

  t.equal(m.ap(Writer(0, 3)).valueOf(), 3, 'identity')
  t.equal(m.ap(Writer.of(3)).valueOf(), Writer.of(identity(3)).valueOf(), 'homomorphism')

  const a = x => m.ap(Writer.of(x))
  const b = x => Writer.of(reverseApply(x)).ap(m)

  t.equal(a(3).valueOf(), b(3).valueOf(), 'interchange')

  t.end()
})

test('Writer chain errors', t => {
  const m = Writer(0, 0)
  const chain = bindFunc(m.chain)
  const fn = x => Writer(0, x)

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
  t.throws(chain(unit), TypeError, 'throws with non-Writer returning function')

  t.doesNotThrow(chain(fn), 'allows a Writer returning function')

  t.end()
})

test('Writer chain functionality', t => {
  const m = Writer(0, 45)
  const fn = x => Writer(1, x + 2)

  t.same(m.chain(fn).log().valueOf(), 1, 'concats chained log to initial log')
  t.equal(m.chain(fn).valueOf(), 47, 'applys function to wrapped value')

  t.end()
})

test('Writer chain properties (Chain)', t => {
  t.ok(isFunction(Writer(0, 0).chain), 'provides a chain function')
  t.ok(isFunction(Writer(0, 0).ap), 'implements the Apply spec')

  const f = x => Writer(1, x + 2)
  const g = x => Writer(2, x + 10)

  const a = x => Writer(0, x).chain(f).chain(g)
  const b = x => Writer(0, x).chain(y => f(y).chain(g))

  t.equal(a(10).valueOf(), b(10).valueOf(), 'assosiativity')

  t.end()
})

test('Writer chain properties (Monad)', t => {
  t.ok(isFunction(Writer(1, 0).chain), 'implements the Chain spec')
  t.ok(isFunction(Writer(2, 0).of), 'implements the Applicative spec')

  const f = x => Writer(0, x)

  t.equal(Writer.of(3).chain(f).valueOf(), f(3).valueOf(), 'left identity')
  t.equal(f(3).chain(Writer.of).valueOf(), f(3).valueOf(), 'right identity')

  t.end()
})
