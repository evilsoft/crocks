const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')
const Mock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const reverseApply =
  x => fn => fn(x)

const identity = x => x

const _ReaderT = require('./ReaderT')
const ReaderMock = _ReaderT(Mock)

test('ReaderT construction', t => {
  const r = bindFunc(_ReaderT)

  const err = /ReaderT: Monad required for construction/
  t.throws(r(undefined), err, 'throws with undefined')
  t.throws(r(null), err, 'throws with null')
  t.throws(r(0), err, 'throws with falsey number')
  t.throws(r(1), err, 'throws with truthy number')
  t.throws(r(''), err, 'throws with falsey string')
  t.throws(r('string'), err, 'throws with truthy string')
  t.throws(r(false), err, 'throws with false')
  t.throws(r(true), err, 'throws with true')
  t.throws(r([]), err, 'throws with an array')
  t.throws(r({}), err, 'throws with an object')
  t.throws(r(unit), err, 'throws with a function')

  t.doesNotThrow(r(Mock), 'allows a Monad')
  t.end()
})

test('ReaderT', t => {
  const r = ReaderMock(identity)
  const f = bindFunc(ReaderMock)

  t.ok(isFunction(ReaderMock), 'is a function')
  t.ok(isObject(r), 'returns an object')

  t.ok(isFunction(ReaderMock.of), 'provides an of function')
  t.ok(isFunction(ReaderMock.type), 'provides a type function')
  t.ok(isFunction(ReaderMock.ask), 'provides an ask function')
  t.ok(isFunction(ReaderMock.lift), 'provides a lift function')
  t.ok(isFunction(ReaderMock.liftFn), 'provides a liftFn function')

  const err = /Reader\( MockCrock \): MockCrock returning function required/
  t.throws(f(), err, 'throws with no arguments')
  t.throws(f(undefined), err, 'throws with undefined')
  t.throws(f(null), err, 'throws with null')
  t.throws(f(0), err, 'throws with falsey number')
  t.throws(f(1), err, 'throws with truthy number')
  t.throws(f(''), err, 'throws with falsey string')
  t.throws(f('string'), err, 'throws with truthy string')
  t.throws(f(false), err, 'throws with false')
  t.throws(f(true), err, 'throws with true')
  t.throws(f([]), err, 'throws with an array')
  t.throws(f({}), err, 'throws with an object')

  t.end()
})

test('ReaderT @@implements', t => {
  const f = ReaderMock['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')

  t.end()
})

test('ReaderT inspect', t => {
  const m = ReaderMock(unit)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Reader( MockCrock ) Function', 'returns inspect string')

  t.end()
})

test('ReaderT type', t => {
  t.equal(ReaderMock(unit).type(), 'Reader( MockCrock )', 'type returns Reader( innerType )')

  t.end()
})

test('ReaderT runWith', t => {
  const f = bindFunc(x => ReaderMock(() => x).runWith())

  const err = /Reader\( MockCrock \): MockCrock must be returned by wrapped function/
  t.throws(f(undefined), err, 'throws when wrapped function returns undefined')
  t.throws(f(null), err, 'throws when wrapped function returns null')
  t.throws(f(0), err, 'throws when wrapped function returns falsey number')
  t.throws(f(1), err, 'throws when wrapped function returns truthy number')
  t.throws(f(''), err, 'throws when wrapped function returns falsey string')
  t.throws(f('string'), err, 'throws when wrapped function returns truthy string')
  t.throws(f({}), err, 'throws when wrapped function returns an object')
  t.throws(f([]), err, 'throws when wrapped function returns an array')
  t.throws(f(unit), err, 'throws when wrapped function returns a function')

  const add2 = x => Mock(x + 2)
  const fn = sinon.spy(add2)
  const m = ReaderMock(fn)
  const e = 94

  const result = m.runWith(e)

  t.ok(fn.called, 'calls the wrapped function')
  t.equals(result.value(), fn(e).value(), 'env to the function, returning result')

  t.end()
})

test('ReaderT ask errors', t => {
  const ask = bindFunc(ReaderMock.ask)

  const err = /Reader\( MockCrock \).ask: No argument or function required/
  t.throws(ask(undefined), err, 'throws with undefined')
  t.throws(ask(null), err, 'throws with null')
  t.throws(ask(0), err, 'throws with falsey number')
  t.throws(ask(1), err, 'throws with truthy number')
  t.throws(ask(''), err, 'throws with falsey string')
  t.throws(ask('string'), err, 'throws with truthy string')
  t.throws(ask(false), err, 'throws with false')
  t.throws(ask(true), err, 'throws with true')
  t.throws(ask([]), err, 'throws with an array')
  t.throws(ask({}), err, 'throws with an object')

  t.doesNotThrow(ask(unit), 'allows a function')
  t.doesNotThrow(ask(), 'allows nothing')

  t.end()
})

test('ReaderT ask with function', t => {
  const fn = x => x + 1
  const x = ReaderMock.ask(fn)
  const env = 3

  const result = x.runWith(env)

  t.ok(isSameType(ReaderMock, x), 'returns a ReaderT of the same type')
  t.ok(isSameType(Mock, result), 'returns the underlying type when ran')
  t.equal(result.value(), fn(env), 'inner Monad contains the result of passing the env through the function')

  t.end()
})

test('ReaderT ask without function', t => {
  const x = ReaderMock.ask()
  const env = 3

  const result = x.runWith(env)

  t.ok(isSameType(ReaderMock, x), 'returns a ReaderT')
  t.ok(isSameType(Mock, result), 'returns the underlying type when ran')
  t.equal(result.value(),  env, 'inner Monad contains the passed environment')

  t.end()
})

test('ReaderT lift function', t => {
  const fn = bindFunc(ReaderMock.lift)

  const err = /Reader\( MockCrock \).lift: MockCrock instance required/
  t.throws(fn(undefined), err, 'throws with undefined')
  t.throws(fn(null), err, 'throws with null')
  t.throws(fn(0), err, 'throws with falsey number')
  t.throws(fn(1), err, 'throws with truthy number')
  t.throws(fn(''), err, 'throws with falsey string')
  t.throws(fn('string'), err, 'throws with truthy string')
  t.throws(fn(false), err, 'throws with false')
  t.throws(fn(true), err, 'throws with true')
  t.throws(fn([]), err, 'throws with an array')
  t.throws(fn({}), err, 'throws with an object')
  t.throws(fn(unit), err, 'throws with a function')

  const m = Mock(33)
  const result = ReaderMock.lift(m).runWith(0)

  t.ok(isSameType(Mock, result), 'returns an instance of the inner Monad')
  t.equals(m.value(), result.value(), 'value of inner Monad is not changed')

  t.end()
})

test('ReaderT liftFn function', t => {
  const fn = bindFunc(ReaderMock.liftFn)

  const err = /Reader\( MockCrock \).liftFn: MockCrock returning function required/
  t.throws(fn(undefined, 0), err, 'throws with undefined')
  t.throws(fn(null, 0), err, 'throws with null')
  t.throws(fn(0, 0), err, 'throws with falsey number')
  t.throws(fn(1, 0), err, 'throws with truthy number')
  t.throws(fn('', 0), err, 'throws with falsey string')
  t.throws(fn('string', 0), err, 'throws with truthy string')
  t.throws(fn(false, 0), err, 'throws with false')
  t.throws(fn(true, 0), err, 'throws with true')
  t.throws(fn([], 0), err, 'throws with an array')
  t.throws(fn({}, 0), err, 'throws with an object')


  const f =
    x => ReaderMock.liftFn(identity, x).runWith(0)

  const g =
    bindFunc(f)

  t.throws(g(undefined), err, 'throws when function returns undefined')
  t.throws(g(null), err, 'throws when function returns null')
  t.throws(g(0), err, 'throws when function returns falsey number')
  t.throws(g(1), err, 'throws when function returns truthy number')
  t.throws(g(''), err, 'throws when function returns falsey string')
  t.throws(g('string'), err, 'throws when function returns truthy string')
  t.throws(g(false), err, 'throws when function returns false')
  t.throws(g(true), err, 'throws when function returns true')
  t.throws(g([]), err, 'throws when function returns an array')
  t.throws(g({}), err, 'throws when function returns an object')
  t.throws(g(unit), err, 'throws when function returns a function')

  const m = Mock('string')
  const result = f(m)

  t.ok(isSameType(Mock, result), 'returns an instance of the inner Monad as returned by the inner function')
  t.equals(m.value(), result.value(), 'returns the result of the lifted function')

  t.end()
})

test('ReaderT map errors', t => {
  const map = bindFunc(ReaderMock(unit).map)

  const err = /Reader\( MockCrock \).map: Function required/
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

test('ReaderT map functionality', t => {
  const e = 99
  const add7 = x => x + 7
  const spy = sinon.spy(add7)

  const m = ReaderMock(Mock).map(spy)

  t.ok(isSameType(ReaderMock, m), 'returns a ReaderT')
  t.notOk(spy.called, 'does not call mapping function initially')

  const x = m.runWith(e)

  t.ok(spy.called, 'calls mapping function when ran')
  t.ok(isSameType(Mock, x), 'returns an instance of the inner Monad')
  t.equal(x.value(), add7(e), 'returns the wrapped result of the map inside the inner Monad')

  t.end()
})

test('ReaderT map properties (Functor)', t => {
  const m = ReaderMock(Mock)
  const e = 22

  const f = x => x + 12
  const g = x => x * 10

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).runWith(e).value(), m.runWith(e).value(), 'identity')
  t.equal(
    m.map(compose(f, g)).runWith(e).value(),
    m.map(g).map(f).runWith(e).value(),
    'composition'
  )

  t.end()
})

test('ReaderT ap errors', t => {
  const ap = bindFunc(ReaderMock(unit).ap)
  const m = { type: () => 'ReaderMock...Not' }

  const noReader = /Reader\( MockCrock \).ap: Reader\( MockCrock \) required/
  t.throws(ap(undefined), noReader, 'throws with undefined')
  t.throws(ap(null), noReader, 'throws with null')
  t.throws(ap(0), noReader, 'throws with falsey number')
  t.throws(ap(1), noReader, 'throws with truthy number')
  t.throws(ap(''), noReader, 'throws with falsey string')
  t.throws(ap('string'), noReader, 'throws with truthy string')
  t.throws(ap(false), noReader, 'throws with false')
  t.throws(ap(true), noReader, 'throws with true')
  t.throws(ap([]), noReader, 'throws with an array')
  t.throws(ap({}), noReader, 'throws with an object')
  t.throws(ap(m), noReader, 'throws when Non-ReaderMock')

  t.end()
})

test('ReaderT ap properties (Apply)', t => {
  t.ok(isFunction(ReaderMock(unit).map), 'implements the Functor spec')
  t.ok(isFunction(ReaderMock(unit).ap), 'provides an ap function')

  const m = ReaderMock(() => Mock(identity))
  const e = 92

  const add3 =
    x => Mock(x + 3)

  const a = m.map(compose).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.equal(
    a.ap(ReaderMock(add3)).runWith(e).value(),
    b.ap(ReaderMock(add3)).runWith(e).value(),
    'composition'
  )

  t.end()
})

test('ReaderT of', t => {
  t.equal(ReaderMock.of, ReaderMock(unit).of, 'of is the same as the instance version')

  t.ok(isSameType(ReaderMock, ReaderMock.of(0)), 'returns a ReaderMock')
  t.equal(ReaderMock.of(0).runWith(22).value(), 0, 'wraps the value passed in a ReaderT')

  t.end()
})

test('ReaderT of properties (Applicative)', t => {
  t.ok(isFunction(ReaderMock(unit).ap), 'implements the Apply spec')
  t.ok(isFunction(ReaderMock(unit).of), 'provides an of function')

  const m = ReaderMock(() => Mock(identity))
  const e = 38

  const add27 =
    x => Mock(x + 27)

  t.equal(m.ap(ReaderMock(add27)).runWith(e).value(), add27(e).value(), 'identity')
  t.equal(
    m.ap(ReaderMock.of(3)).runWith(e).value(),
    ReaderMock.of(identity(3)).runWith(e).value(),
    'homomorphism'
  )

  const a = x => m.ap(ReaderMock.of(x))
  const b = x => ReaderMock.of(reverseApply(x)).ap(m)

  t.equal(a(3).runWith(e).value(), b(3).runWith(e).value(), 'interchange')

  t.end()
})

test('ReaderT chain errors', t => {
  const chain = bindFunc(ReaderMock(unit).chain)

  const noFunc = /Reader\( MockCrock \).chain: Reader\( MockCrock \) returning function required/
  t.throws(chain(undefined), noFunc, 'throws with undefined')
  t.throws(chain(null), noFunc, 'throws null')
  t.throws(chain(0), noFunc, 'throws with falsey number')
  t.throws(chain(1), noFunc, 'throws with truthy number')
  t.throws(chain(''), noFunc, 'throws with falsey string')
  t.throws(chain('string'), noFunc, 'throws with truthy string')
  t.throws(chain(false), noFunc, 'throws with false')
  t.throws(chain(true), noFunc, 'throws with true')
  t.throws(chain([]), noFunc, 'throws with an array')
  t.throws(chain({}), noFunc, 'throws with an object')

  const badRtn =
    bindFunc(ReaderMock(Mock).chain(Mock).runWith)

  const noReader = /Reader\( MockCrock \).chain: Function must return a Reader\( MockCrock \)/
  t.throws(badRtn(undefined), noReader, 'throws when function returns undefined')
  t.throws(badRtn(null), noReader, 'throws when function returns null')
  t.throws(badRtn(0), noReader, 'throws when function returns a falsey number')
  t.throws(badRtn(1), noReader, 'throws when function returns a truthy number')
  t.throws(badRtn(''), noReader, 'throws when function returns a falsey string')
  t.throws(badRtn('string'), noReader, 'throws when function returns a truthy string')
  t.throws(badRtn(false), noReader, 'throws when function returns false')
  t.throws(badRtn(true), noReader, 'throws when function returns true')
  t.throws(badRtn([]), noReader, 'throws when function returns an array')
  t.throws(badRtn({}), noReader, 'throws when function returns an object')
  t.throws(badRtn(unit), noReader, 'throws when function returns a function')

  t.end()
})

test('ReaderT chain properties (Chain)', t => {
  t.ok(isFunction(ReaderMock(unit).chain), 'provides a chain function')
  t.ok(isFunction(ReaderMock(unit).ap), 'implements the Apply spec')

  const e = 8

  const f = x => ReaderMock(e => Mock(x + e + 2))
  const g = x => ReaderMock(e => Mock(x + e + 10))

  const a = x => ReaderMock(() => Mock(x)).chain(f).chain(g)
  const b = x => ReaderMock(() => Mock(x)).chain(y => f(y).chain(g))

  t.equal(a(10).runWith(e).value(), b(10).runWith(e).value(), 'assosiativity')

  t.end()
})

test('ReaderT chain properties (Monad)', t => {
  t.ok(isFunction(ReaderMock(unit).chain), 'implements the Chain spec')
  t.ok(ReaderMock(unit).of, 'implements the Applicative spec')

  const f = x => ReaderMock(() => Mock(x))

  t.equal(ReaderMock.of(3).chain(f).runWith(0).value(), f(3).runWith(0).value(), 'left identity')
  t.equal(f(6).chain(ReaderMock.of).runWith(0).value(), f(6).runWith(0).value(), 'right identity')

  t.end()
})
