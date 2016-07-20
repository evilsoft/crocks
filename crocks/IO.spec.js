const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const composeB      = require('../combinators/composeB')
const constant      = require('../combinators/constant')
const identity      = require('../combinators/identity')
const reverseApply  = require('../combinators/reverseApply')

const IO = require('./IO')

test('IO', t => {
  const m   = IO(noop)
  const io  = bindFunc(IO)

  t.equal(typeof IO, 'function', 'is a function')
  t.equal(m.toString(), '[object Object]', 'returns an object')

  t.equal(typeof IO.of, 'function', 'provides an of function')
  t.equal(typeof IO.type, 'function', 'provides a type function')
  t.equal(IO.type, IO(noop).type, 'static type function matches instance type function')

  t.equal(typeof m.run, 'function', 'provides a value function')
  t.equal(typeof m.type, 'function', 'provides a type function')

  t.throws(io(), TypeError, 'throws with no parameters')

  t.throws(io(undefined), TypeError, 'throws with undefined')
  t.throws(io(null), TypeError, 'throws with null')
  t.throws(io(0), TypeError, 'throws with falsey number')
  t.throws(io(1), TypeError, 'throws with truthy number')
  t.throws(io(''), TypeError, 'throws with falsey string')
  t.throws(io('string'), TypeError, 'throws with truthy string')
  t.throws(io(false), TypeError, 'throws with false')
  t.throws(io(true), TypeError, 'throws with true')
  t.throws(io([]), TypeError, 'throws with array')
  t.throws(io({}), TypeError, 'throws with object')

  t.end()
})

test('IO type', t => {
  t.equal(IO(noop).type(), 'IO', 'type returns IO')
  t.end()
})

test('IO run', t => {
  const fn  = sinon.spy(constant('result'))
  const m   = IO(fn)

  const result = m.run()

  t.ok(fn.called, 'calls the wrapped function')
  t.equal(result, fn(),'returns result of the wrapped function' )

  t.end()
})

test('IO map errors', t => {
  const map = bindFunc(IO(noop).map)

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
  t.doesNotThrow(map(noop), 'allows functions')

  t.end()
})

test('IO map functionality', t => {
  const x   = 42
  const spy = sinon.spy(constant(x))

  const m = IO(noop).map(spy)

  t.equal(m.type(), 'IO', 'returns an IO')
  t.notOk(spy.called, 'does not call mapping function initially')

  m.run()

  t.ok(spy.called, 'calls mapping function when ran')
  t.equal(m.run(), x, 'returns the result of the map inside of new Identity')

  t.end()
})

test('IO map properties (Functor)', t => {
  const m = IO(constant(49))

  const f = x => x + 12
  const g = x => x * 10

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).run(), m.run(), 'identity')
  t.equal(m.map(composeB(f, g)).run(), m.map(g).map(f).run(), 'composition')

  t.end()
})

test('IO ap errors', t => {
  const m  = { type: () => 'IO...Not' }

  t.throws(IO(noop).ap.bind(null, undefined), TypeError, 'throws when passed undefined')
  t.throws(IO(noop).ap.bind(null, null), TypeError, 'throws when passed null')
  t.throws(IO(noop).ap.bind(null, 0), TypeError, 'throws when passed a falsey number')
  t.throws(IO(noop).ap.bind(null, 1), TypeError, 'throws when passed a truthy number')
  t.throws(IO(noop).ap.bind(null, ''), TypeError, 'throws when passed a falsey string')
  t.throws(IO(noop).ap.bind(null, 'string'), TypeError, 'throws when passed a truthy string')
  t.throws(IO(noop).ap.bind(null, false), TypeError, 'throws when passed false')
  t.throws(IO(noop).ap.bind(null, true), TypeError, 'throws when passed true')
  t.throws(IO(noop).ap.bind(null, []), TypeError, 'throws when passed an array')
  t.throws(IO(noop).ap.bind(null, {}), TypeError, 'throws when passed an object')

  t.throws(IO(noop).ap.bind(null, m), TypeError, 'throws when container types differ')

  t.end()
})

test('IO ap properties (Apply)', t => {
  const m = IO(constant(identity))

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(IO(noop).map), 'implements the Functor spec')
  t.ok(isFunction(IO(noop).ap), 'provides an ap function')

  t.equal(a.ap(IO(constant(3))).run(), b.ap(IO(constant(3))).run(), 'composition')

  t.end()
})

test('IO of', t => {
  t.equal(IO.of, IO(noop).of, 'of is the same as the instance version')
  t.equal(IO.of(0).type(), 'IO', 'returns an IO')
  t.equal(IO.of(0).run(), 0, 'wraps the value passed into an IO')

  t.end()
})

test('IO of properties (Applicative)', t => {
  const m = IO(constant(identity))

  t.ok(isFunction(IO(noop).of), 'provides an of function')
  t.ok(isFunction(IO(noop).ap), 'implements the Apply spec')

  t.equal(m.ap(IO(constant(27))).run(), 27, 'identity')
  t.equal(m.ap(IO.of(3)).run(), IO.of(identity(3)).run(), 'homomorphism')

  const a = x => m.ap(IO.of(x))
  const b = x => IO.of(reverseApply(x)).ap(m)

  t.equal(a(3).run(), b(3).run(), 'interchange')

  t.end()
})

test('IO chain errors', t => {
  const chain = bindFunc(IO(noop).chain)

  t.throws(chain(undefined), TypeError, 'throws with undefined')
  t.throws(chain(null), TypeError, 'throws null')
  t.throws(chain(0), TypeError, 'throws with falsey number')
  t.throws(chain(1), TypeError, 'throws with truthy number')
  t.throws(chain(''), TypeError, 'throws with falsey string')
  t.throws(chain('string'), TypeError, 'throws with truthy string')
  t.throws(chain(false), TypeError, 'throws with false')
  t.throws(chain(true), TypeError, 'throws with true')
  t.throws(chain(null), TypeError, 'throws with null')
  t.throws(chain([]), TypeError, 'throws with an array')
  t.throws(chain({}), TypeError, 'throws with an object')

  t.doesNotThrow(chain(noop), 'does not throw when passed a function')

  t.end()
})

test('IO chain properties (Chain)', t => {
  t.ok(isFunction(IO(noop).chain), 'provides a chain function')
  t.ok(isFunction(IO(noop).ap), 'implements the Apply spec')

  const f = x => IO(_ => x + 2)
  const g = x => IO(_ => x + 10)

  const a = x => IO(constant(x)).chain(f).chain(g)
  const b = x => IO(constant(x)).chain(y => f(y).chain(g))

  t.equal(a(10).run(), b(10).run(), 'assosiativity')

  t.end()
})

test('IO chain properties (Monad)', t => {
  t.ok(isFunction(IO(noop).chain), 'implements the Chain spec')
  t.ok(IO(noop).of, 'implements the Applicative spec')

  const f = x => IO(constant(x))

  t.equal(IO.of(3).chain(f).run(), f(3).run(), 'left identity')
  t.equal(f(6).chain(IO.of).run(), f(6).run(), 'right identity')

  t.end()
})
