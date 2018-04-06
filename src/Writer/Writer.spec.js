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
const isString = require('../core/isString')
const unit = require('../core/_unit')

const fl = require('../core/flNames')

const identity = x => x

const applyTo =
  x => fn => fn(x)

const _Writer = require('.')
const Writer = _Writer(Last)

test('Writer construction', t => {
  const w = bindFunc(_Writer)

  const err = /Writer: Monoid required for construction/
  t.throws(w(undefined), err, 'throws with undefined')
  t.throws(w(null), err, 'throws with null')
  t.throws(w(0), err, 'throws with falsey number')
  t.throws(w(1), err, 'throws with truthy number')
  t.throws(w(''), err, 'throws with falsey string')
  t.throws(w('string'), err, 'throws with truthy string')
  t.throws(w(false), err, 'throws with false')
  t.throws(w(true), err, 'throws with true')
  t.throws(w([]), err, 'throws with an array')
  t.throws(w({}), err, 'throws with an object')
  t.throws(w(unit), err, 'throws with a function')

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
  t.ok(isString(Writer['@@type']), 'provides a @@type string')

  const err = /Writer: Log entry and a value required/
  t.throws(f(), err, 'throws with no parameters')
  t.throws(f(0), err, 'throws with one parameter')

  t.end()
})

test('Writer fantasy-land api', t => {
  const m = Writer(0, 0)

  t.ok(isFunction(Writer[fl.of]), 'provides of function on constructor')

  t.ok(isFunction(m[fl.of]), 'provides of method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.map]), 'provides map method on instance')
  t.ok(isFunction(m[fl.chain]), 'provides chain method on instance')

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
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Writer( Last 0 0 )', 'returns inspect string')

  t.end()
})

test('Writer type', t => {
  const m = Writer(0, 0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(Writer.type, m.type, 'static and instance versions are the same')
  t.equal(m.type(), 'Writer( Last )', 'returns Writer with Monoid Type')

  t.end()
})

test('Writer @@type', t => {
  const m = Writer(0, 0)

  t.equal(Writer['@@type'], m['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/Writer@2( crocks/Last@1 )', 'returns crocks/Writer@2 with Monoid Type')

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

  const err = /Writer.map: Function required/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws with an object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Writer map fantasy-land errors', t => {
  const map = bindFunc(Writer(0, 0)[fl.map])

  const err = /Writer.fantasy-land\/map: Function required/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws with an object')

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

  const ap =
    bindFunc(Writer(0, unit).ap)

  const wrapAp = bindFunc(
    x => Writer(0, x).ap(Writer(0, 0))
  )

  const noFunc = /Writer.ap: Wrapped value must be a function/
  t.throws(wrapAp(undefined), noFunc, 'throws when wrapped value is undefined')
  t.throws(wrapAp(null), noFunc, 'throws when wrapped value is null')
  t.throws(wrapAp(0), noFunc, 'throws when wrapped value is a falsey number')
  t.throws(wrapAp(1), noFunc, 'throws when wrapped value is a truthy number')
  t.throws(wrapAp(''), noFunc, 'throws when wrapped value is a falsey string')
  t.throws(wrapAp('string'), noFunc, 'throws when wrapped value is a truthy string')
  t.throws(wrapAp(false), noFunc, 'throws when wrapped value is false')
  t.throws(wrapAp(true), noFunc, 'throws when wrapped value is true')
  t.throws(wrapAp([]), noFunc, 'throws when wrapped value is an array')
  t.throws(wrapAp({}), noFunc, 'throws when wrapped value is an object')

  const err = /Writer.ap: Writer required/
  t.throws(ap(undefined), err, 'throws with undefined')
  t.throws(ap(null), err, 'throws with null')
  t.throws(ap(0), err, 'throws with falsey number')
  t.throws(ap(1), err, 'throws with truthy number')
  t.throws(ap(''), err, 'throws with falsey string')
  t.throws(ap('string'), err, 'throws with truthy string')
  t.throws(ap(false), err, 'throws with false')
  t.throws(ap(true), err, 'throws with true')
  t.throws(ap([]), err, 'throws with an array')
  t.throws(ap({}), err, 'throws with an object')
  t.throws(ap(m), err, 'throws with Non-Writer')

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
  const b = x => Writer.of(applyTo(x)).ap(m)

  t.equal(a(3).valueOf(), b(3).valueOf(), 'interchange')

  t.end()
})

test('Writer chain errors', t => {
  const m = Writer(0, 0)
  const chain = bindFunc(m.chain)
  const fn = x => Writer(0, x)

  const err = /Writer.chain: Function required/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws with null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  const noWriter = /Writer.chain: Function must return a Writer/
  t.throws(chain(unit), noWriter, 'throws with non-Writer returning function')

  t.doesNotThrow(chain(fn), 'allows a Writer returning function')

  t.end()
})

test('Writer chain fantasy-land errors', t => {
  const m = Writer(0, 0)
  const chain = bindFunc(m[fl.chain])
  const fn = x => Writer(0, x)

  const err = /Writer.fantasy-land\/chain: Function required/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws with null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  const noWriter = /Writer.fantasy-land\/chain: Function must return a Writer/
  t.throws(chain(unit), noWriter, 'throws with non-Writer returning function')

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
