const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const isFunction  = require('../internal/isFunction')
const isObject    = require('../internal/isObject')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const identity      = require('../combinators/identity')
const composeB      = require('../combinators/composeB')
const reverseApply  = require('../combinators/reverseApply')

const Writer = require('./Writer.js')

test('Writer', t => {
  const w = Writer(0, 0)
  const f = bindFunc(Writer)

  t.ok(isFunction(Writer), 'is a function')
  t.ok(isObject(w), 'returns an object')

  t.ok(isFunction(Writer.of), 'provides an of function')
  t.ok(isFunction(Writer.type), 'provides a type function')
  t.equal(Writer.type, w.type, 'static type function matches instance type function')

  t.throws(f(), TypeError, 'throws when no parameters are passed')
  t.throws(f(0), TypeError, 'throws when one parameter is passed')

  t.end()
})

test('Writer type', t => {
  const m = Writer(0, 0)

  t.ok(isFunction(m.type), 'provides a type function')
  t.equal(m.type(), 'Writer', 'type returns Writer')
  t.end()
})

test('Writer read', t => {
  const x = 'some value'
  const l = 'some log'
  const m = Writer(l, x)

  t.ok(isFunction(m.read), 'is a function')
  t.ok(isObject(m.read()),'returns an object' )
  t.equal(m.read().value, x,'returns the wrapped value on the value key' )
  t.same(m.read().log, [ l ],'returns the wrapped log on the log key in an array' )

  t.end()
})

test('Writer value', t => {
  const x = 34
  const w = Writer(0, x)

  t.ok(isFunction(w.value), 'is a function')
  t.equal(w.value(), x, 'provides wrapped value')

  t.end()
})

test('Writer log', t => {
  const x = 'log entry'
  const w = Writer(x, 0)

  t.ok(isFunction(w.log), 'is a function')
  t.same(w.log(), [ x ], 'proivdes log entry wrapped in an array')

  t.end()
})

test('Writer equals functionality', t => {
  const a = Writer(23, 0)
  const b = Writer(15, 0)
  const c = Writer(23, 1)

  const value     = 0
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

test('Writer map functionality', t => {
  const spy = sinon.spy(identity)
  const x   = 42
  const l   = 'log'

  const m = Writer(l, x).map(spy)

  t.equal(m.type(), 'Writer', 'returns a Writer')
  t.equal(spy.called, true, 'calls mapping function')
  t.equal(m.value(), x, 'returns the result of the map inside of new Writer, on value key')
  t.same(m.log(), [ l ], 'returns the result of the map inside of new Writer, on log key')

  t.same(m.map(identity).log(), [ l ], 'does not add to the log on map')

  t.end()
})

test('Writer map properties (Functor)', t => {
  const m = Writer('blop', 49)

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).value(), m.value(), 'identity')
  t.equal(m.map(composeB(f, g)).value(), m.map(g).map(f).value(), 'composition')

  t.end()
})

test('Writer ap errors', t => {
  const m = { type: () => 'Writer...Not' }
  const w = Writer(0, 0)

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

  t.throws(Writer(0, noop).ap.bind(null, undefined), TypeError, 'throws when passed undefined')
  t.throws(Writer(0, noop).ap.bind(null, null), TypeError, 'throws when passed null')
  t.throws(Writer(0, noop).ap.bind(null, 0), TypeError, 'throws when passed a falsey number')
  t.throws(Writer(0, noop).ap.bind(null, 1), TypeError, 'throws when passed a truthy number')
  t.throws(Writer(0, noop).ap.bind(null, ''), TypeError, 'throws when passed a falsey string')
  t.throws(Writer(0, noop).ap.bind(null, 'string'), TypeError, 'throws when passed a truthy string')
  t.throws(Writer(0, noop).ap.bind(null, false), TypeError, 'throws when passed false')
  t.throws(Writer(0, noop).ap.bind(null, true), TypeError, 'throws when passed true')
  t.throws(Writer(0, noop).ap.bind(null, []), TypeError, 'throws when passed an array')
  t.throws(Writer(0, noop).ap.bind(null, {}), TypeError, 'throws when passed an object')

  t.throws(Writer(0, noop).ap.bind(null, m), TypeError, 'throws when container types differ')

  t.end()
})

test('Writer ap properties (Apply)', t => {
  const m = Writer(0, identity)

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(m.map), 'implements the Functor spec')
  t.ok(isFunction(m.ap), 'provides an ap function')

  t.equal(a.ap(Writer(0, 3)).value(), b.ap(Writer(0, 3)).value(), 'composition')

  t.end()
})

test('Writer ap functionality', t => {
  const a = Writer(0, x => x + 2)
  const b = Writer(1, 27)

  t.same(a.ap(b).log(), [ 0, 1 ], 'concats applied Writers log to inital log')
  t.equal(a.ap(b).value(), 29, 'applys applied value to function')

  t.end()
})

test('Writer of', t => {
  t.equal(Writer.of, Writer(0, 0).of, 'Writer.of is the same as the instance version')
  t.equal(Writer.of(0).type(), 'Writer', 'returns an Writer')
  t.equal(Writer.of(0).value(), 0, 'wraps the value passed into a Writer')
  t.same(Writer.of(0).log(), [], 'provides an empty array as the log')

  t.end()
})

test('Writer of properties (Applicative)', t => {
  const m = Writer(0, identity)

  t.ok(isFunction(m.of), 'provides an of function')
  t.ok(isFunction(m.ap), 'implements the Apply spec')

  t.equal(m.ap(Writer(0, 3)).value(), 3, 'identity')
  t.equal(m.ap(Writer.of(3)).value(), Writer.of(identity(3)).value(), 'homomorphism')

  const a = x => m.ap(Writer.of(x))
  const b = x => Writer.of(reverseApply(x)).ap(m)

  t.equal(a(3).value(), b(3).value(), 'interchange')

  t.end()
})

test('Writer chain errors', t => {
  const m     = Writer(0, 0)
  const chain = bindFunc(m.chain)
  const fn    = x => Writer(0, x)

  t.throws(chain(undefined), TypeError, 'throws when passed undefined')
  t.throws(chain(null), TypeError, 'throws when passed null')
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
  t.doesNotThrow(chain(fn), 'does not throw when passed a function')

  t.end()
})

test('Writer chain functionality', t => {
  const m   = Writer(0, 45)
  const fn  = x => Writer(1, x + 2)

  t.same(m.chain(fn).log(), [ 0, 1 ], 'concats chained log to initial log')
  t.equal(m.chain(fn).value(), 47, 'applys function to wrapped value')

  t.end()
})

test('Writer chain properties (Chain)', t => {
  t.ok(isFunction(Writer(0, 0).chain), 'provides a chain function')
  t.ok(isFunction(Writer(0, 0).ap), 'implements the Apply spec')

  const f = x => Writer(1, x + 2)
  const g = x => Writer(2, x + 10)

  const a = x => Writer(0, x).chain(f).chain(g)
  const b = x => Writer(0, x).chain(y => f(y).chain(g))

  t.equal(a(10).value(), b(10).value(), 'assosiativity')

  t.end()
})

test('Writer chain properties (Monad)', t => {
  t.ok(isFunction(Writer(1, 0).chain), 'implements the Chain spec')
  t.ok(isFunction(Writer(2, 0).of), 'implements the Applicative spec')

  const f = x => Writer(0, x)

  t.equal(Writer.of(3).chain(f).value(), f(3).value(), 'left identity')
  t.equal(f(3).chain(Writer.of).value(), f(3).value(), 'right identity')

  t.end()
})

test('Writer reduceLog errors', t => {
  const reduceLog = bindFunc(Writer(0, 0).reduceLog)

  t.throws(reduceLog(undefined), TypeError, 'throws when passed undefined')
  t.throws(reduceLog(null), TypeError, 'throws when passed null')
  t.throws(reduceLog(0), TypeError, 'throws when passed falsey number')
  t.throws(reduceLog(1), TypeError, 'throws when passed truthy number')
  t.throws(reduceLog(''), TypeError, 'throws when passed falsey string')
  t.throws(reduceLog('string'), TypeError, 'throws when passed truthy string')
  t.throws(reduceLog(false), TypeError, 'throws when passed false')
  t.throws(reduceLog(true), TypeError, 'throws when passed true')
  t.throws(reduceLog([]), TypeError, 'throws when passed an array')
  t.throws(reduceLog({}), TypeError, 'throws when passed an object')
  t.doesNotThrow(reduceLog(noop))

  t.end()
})

test('Writer reduceLog', t => {
  const w = Writer(0, 0)
  const f = _ => Writer(1, 0)
  const g = _ => Writer(2, 0)
  const r = (x, y) => x + y

  const result = w.chain(f).chain(g).reduceLog(r)

  t.ok(isFunction(w.reduceLog), 'is a function')
  t.same(result.log(), [ 3 ], 'reduces the log as expected')

  t.end()
})
