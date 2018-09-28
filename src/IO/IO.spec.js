const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')
const unit = require('../core/_unit')

const fl = require('../core/flNames')
const laws = require('../test/laws.js')

const constant = x => () => x
const identity = x => x

const applyTo =
  x => fn => fn(x)

const IO = require('.')

test('IO', t => {
  const m = IO(unit)
  const io = bindFunc(IO)

  t.ok(isFunction(IO), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.equals(IO(unit).constructor, IO, 'provides TypeRep on constructor')

  t.ok(isFunction(IO.of), 'provides an of function')
  t.ok(isFunction(IO.type), 'provides a type function')
  t.ok(isString(IO['@@type']), 'provides a @@type string')

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

  t.doesNotThrow(io(unit), 'allows a function')

  t.end()
})

test('IO fantasy-land api', t => {
  const m = IO(identity)

  t.ok(isFunction(IO[fl.of]), 'provides of function on constructor')

  t.ok(isFunction(m[fl.of]), 'provides of method on instance')
  t.ok(isFunction(m[fl.map]), 'provides map method on instance')
  t.ok(isFunction(m[fl.chain]), 'provides chain method on instance')

  t.end()
})

test('IO @@implements', t => {
  const f = IO['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')

  t.end()
})

test('IO inspect', t => {
  const m = IO(unit)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'IO Function', 'returns inspect string')

  t.end()
})

test('IO type', t => {
  const m = IO(unit)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(IO.type, m.type, 'static and instance versions are the same')
  t.equal(m.type(), 'IO', 'reports IO')

  t.end()
})

test('IO @@type', t => {
  const m = IO(unit)

  t.equal(IO['@@type'], m['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/IO@2', 'reports crocks/IO@2')

  t.end()
})

test('IO run', t => {
  const fn = sinon.spy(constant('result'))
  const m = IO(fn)

  const result = m.run()

  t.ok(fn.called, 'calls the wrapped function')
  t.equal(result, fn(),'returns result of the wrapped function' )

  t.end()
})

test('IO map errors', t => {
  const map = bindFunc(IO(unit).map)

  const err = /IO.map: Function required/
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

  t.doesNotThrow(map(unit), 'allows functions')

  t.end()
})

test('IO map fantasy-land errors', t => {
  const map = bindFunc(IO(unit)[fl.map])

  const err = /IO.fantasy-land\/map: Function required/
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

  t.doesNotThrow(map(unit), 'allows functions')

  t.end()
})

test('IO map functionality', t => {
  const x = 42
  const spy = sinon.spy(constant(x))

  const m = IO(unit).map(spy)

  t.equal(m.type(), 'IO', 'returns an IO')
  t.notOk(spy.called, 'does not call mapping function initially')

  m.run()

  t.ok(spy.called, 'calls mapping function when ran')
  t.equal(m.run(), x, 'returns the result of the map inside of new IO')

  t.end()
})

test('IO map properties (Functor)', t => {
  const m = IO(constant(49))

  const f = x => x + 12
  const g = x => x * 10

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).run(), m.run(), 'identity')
  t.equal(m.map(compose(f, g)).run(), m.map(g).map(f).run(), 'composition')

  t.end()
})

test('IO ap errors', t => {
  const m = { type: () => 'IO...Not' }

  const ap =
    bindFunc(x => IO(unit).ap(x))

  const err = /IO.ap: IO required/
  t.throws(ap(undefined), err, 'throws when passed undefined')
  t.throws(ap(null), err, 'throws when passed null')
  t.throws(ap(0), err, 'throws when passed a falsey number')
  t.throws(ap(1), err, 'throws when passed a truthy number')
  t.throws(ap(''), err, 'throws when passed a falsey string')
  t.throws(ap('string'), err, 'throws when passed a truthy string')
  t.throws(ap(false), err, 'throws when passed false')
  t.throws(ap(true), err, 'throws when passed true')
  t.throws(ap([]), err, 'throws when passed an array')
  t.throws(ap({}), err, 'throws when passed an object')
  t.throws(ap(identity), err, 'throws when passed a function')
  t.throws(ap(m), err, 'throws when container types differ')

  const wrap =
    bindFunc(x => IO(constant(x)).ap(IO(identity)).run())

  const noFunc = /IO.ap: Wrapped value must be a function/
  t.throws(wrap(undefined), noFunc, 'throws when wrapping undefined')
  t.throws(wrap(null), noFunc, 'throws when wrapping null')
  t.throws(wrap(0), noFunc, 'throws when wrapping a falsey number')
  t.throws(wrap(1), noFunc, 'throws when wrapping a truthy number')
  t.throws(wrap(''), noFunc, 'throws when wrapping a falsey string')
  t.throws(wrap('string'), noFunc, 'throws when wrapping a truthy string')
  t.throws(wrap(false), noFunc, 'throws when wrapping false')
  t.throws(wrap(true), noFunc, 'throws when wrapping true')
  t.throws(wrap([]), noFunc, 'throws when wrapping an array')
  t.throws(wrap({}), noFunc, 'throws when wrapping an object')
  t.throws(wrap(m), noFunc, 'throws when container types differ')

  t.end()
})

test('IO ap properties (Apply)', t => {
  const m = IO(constant(identity))

  const a = m.map(compose).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(IO(unit).map), 'implements the Functor spec')
  t.ok(isFunction(IO(unit).ap), 'provides an ap function')

  t.equal(a.ap(IO(constant(3))).run(), b.ap(IO(constant(3))).run(), 'composition')

  t.end()
})

test('IO of', t => {
  t.equal(IO.of, IO(unit).of, 'of is the same as the instance version')
  t.equal(IO.of(0).type(), 'IO', 'returns an IO')
  t.equal(IO.of(0).run(), 0, 'wraps the value passed into an IO')

  t.end()
})

test('IO of properties (Applicative)', t => {
  const m = IO(constant(identity))

  t.ok(isFunction(IO(unit).of), 'provides an of function')
  t.ok(isFunction(IO(unit).ap), 'implements the Apply spec')

  t.equal(m.ap(IO(constant(27))).run(), 27, 'identity')
  t.equal(m.ap(IO.of(3)).run(), IO.of(identity(3)).run(), 'homomorphism')

  const a = x => m.ap(IO.of(x))
  const b = x => IO.of(applyTo(x)).ap(m)

  t.equal(a(3).run(), b(3).run(), 'interchange')

  t.end()
})

test('IO chain errors', t => {
  const chain = bindFunc(IO(unit).chain)

  const err = /IO.chain: Function required/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  const badRtn =
    bindFunc(x => IO(identity).chain(constant(x)).run())

  const noFunc = /IO.chain: Function must return an IO/
  t.throws(badRtn(undefined), noFunc, 'throws when function returns undefined')
  t.throws(badRtn(null), noFunc, 'throws when function returns null')
  t.throws(badRtn(0), noFunc, 'throws when function returns a falsey number')
  t.throws(badRtn(1), noFunc, 'throws when function returns a truthy number')
  t.throws(badRtn(''), noFunc, 'throws when function returns a falsey string')
  t.throws(badRtn('string'), noFunc, 'throws when function returns a truthy string')
  t.throws(badRtn(false), noFunc, 'throws when function returns false')
  t.throws(badRtn(true), noFunc, 'throws when function returns true')
  t.throws(badRtn([]), noFunc, 'throws when function returns an array')
  t.throws(badRtn({}), noFunc, 'throws when function returns an object')
  t.throws(badRtn(unit), noFunc, 'throws when function returns a function')

  t.end()
})

test('IO chain fantasy-land errors', t => {
  const chain = bindFunc(IO(unit)[fl.chain])

  const err = /IO.fantasy-land\/chain: Function required/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  const badRtn =
    bindFunc(x => IO(identity)[fl.chain](constant(x)).run())

  const noIO = /IO.fantasy-land\/chain: Function must return an IO/
  t.throws(badRtn(undefined), noIO, 'throws when function returns undefined')
  t.throws(badRtn(null), noIO, 'throws when function returns null')
  t.throws(badRtn(0), noIO, 'throws when function returns a falsey number')
  t.throws(badRtn(1), noIO, 'throws when function returns a truthy number')
  t.throws(badRtn(''), noIO, 'throws when function returns a falsey string')
  t.throws(badRtn('string'), noIO, 'throws when function returns a truthy string')
  t.throws(badRtn(false), noIO, 'throws when function returns false')
  t.throws(badRtn(true), noIO, 'throws when function returns true')
  t.throws(badRtn([]), noIO, 'throws when function returns an array')
  t.throws(badRtn({}), noIO, 'throws when function returns an object')
  t.throws(badRtn(unit), noIO, 'throws when function returns a function')

  t.end()
})

test('IO chain properties (Chain)', t => {
  t.ok(isFunction(IO(unit).chain), 'provides a chain function')
  t.ok(isFunction(IO(unit).ap), 'implements the Apply spec')

  const f = x => IO(() => x + 2)
  const g = x => IO(() => x + 10)

  const a = x => IO(constant(x)).chain(f).chain(g)
  const b = x => IO(constant(x)).chain(y => f(y).chain(g))

  t.equal(a(10).run(), b(10).run(), 'assosiativity')

  t.end()
})

test('IO chain properties (Monad)', t => {
  t.ok(isFunction(IO(unit).chain), 'implements the Chain spec')
  t.ok(IO(unit).of, 'implements the Applicative spec')

  const f = x => IO(constant(x))

  t.equal(IO.of(3).chain(f).run(), f(3).run(), 'left identity')
  t.equal(f(6).chain(IO.of).run(), f(6).run(), 'right identity')

  t.end()
})

const ioEquals = (a, b) => a.run() === b.run()

test('IO applyTo properties (Apply)', t => {
  const apply = laws['fl/apply'](IO)

  t.ok(apply.composition(ioEquals, IO.of(x => x * 3), IO.of(x => x + 4), IO.of(5)), 'composition')

  t.end()
})

test('IO applyTo properties (Applicative)', t => {
  const applicative = laws['fl/applicative'](IO)

  t.ok(applicative.identity(ioEquals, 5), 'identity')
  t.ok(applicative.homomorphism(ioEquals, x => x * 3, 18), 'homomorphism')
  t.ok(applicative.interchange(ioEquals, IO.of(x => x +10), 23), 'interchange')

  t.end()
})
