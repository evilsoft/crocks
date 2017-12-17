const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const constant = x => () => x
const identity = x => x

const reverseApply =
  x => fn => fn(x)

const Reader = require('.')

test('Reader', t => {
  const m = Reader(unit)
  const r = bindFunc(Reader)

  t.ok(isFunction(Reader), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Reader.of), 'provides an of function')
  t.ok(isFunction(Reader.type), 'provides a type function')
  t.ok(isFunction(Reader.ask), 'provides an ask function')


  const err = /Reader: Must wrap a function/
  t.throws(r(), err, 'throws with no parameters')
  t.throws(r(undefined), err, 'throws with undefined')
  t.throws(r(null), err, 'throws with null')
  t.throws(r(0), err, 'throws with falsey number')
  t.throws(r(1), err, 'throws with truthy number')
  t.throws(r(''), err, 'throws with falsey string')
  t.throws(r('string'), err, 'throws with truthy string')
  t.throws(r(false), err, 'throws with false')
  t.throws(r(true), err, 'throws with true')
  t.throws(r([]), err, 'throws with array')
  t.throws(r({}), err, 'throws with object')

  t.doesNotThrow(r(unit), 'allows a function')

  t.end()
})

test('Reader @@implements', t => {
  const f = Reader['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')

  t.end()
})

test('Reader inspect', t => {
  const m = Reader(unit)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Reader Function', 'returns inspect string')

  t.end()
})

test('Reader type', t => {
  t.equal(Reader(unit).type(), 'Reader', 'type returns Reader')
  t.end()
})

test('Reader runWith', t => {
  const add2 = x => x + 2
  const fn = sinon.spy(add2)
  const m = Reader(fn)
  const e = 94

  const result = m.runWith(e)

  t.ok(fn.called, 'calls the wrapped function')
  t.equal(result, fn(e), 'passes in env to the function, returning result')

  t.end()
})

test('Reader ask errors', t => {
  const ask = bindFunc(Reader.ask)

  const err = /Reader.ask: No argument or function required/
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

test('Reader ask with function', t => {
  const f = sinon.spy(identity)
  const x = Reader.ask(f)

  x.runWith(3)

  t.ok(isSameType(Reader, x), 'returns a Reader')
  t.ok(f.calledWith(3), 'returned Reader wraps the passed function')
  t.end()
})

test('Reader ask without function', t => {
  const x = Reader.ask()
  const data = 3

  const result = x.runWith(data)

  t.ok(isSameType(Reader, x), 'returns a Reader')
  t.equal(result,  data, 'returns identity of passed value')
  t.end()
})

test('Reader map errors', t => {
  const map = bindFunc(Reader(unit).map)

  const err = /Reader.map: Function required/
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

test('Reader map functionality', t => {
  const e = 99
  const add7 = x => x + 7
  const spy = sinon.spy(add7)

  const m = Reader(identity).map(spy)

  t.ok(isSameType(Reader, m), 'returns a Reader')
  t.notOk(spy.called, 'does not call mapping function initially')

  m.runWith()

  t.ok(spy.called, 'calls mapping function when ran')
  t.equal(m.runWith(e), add7(e), 'returns the wrapped result of the map')

  t.end()
})

test('Reader map properties (Functor)', t => {
  const m = Reader(identity)
  const e = 22

  const f = x => x + 12
  const g = x => x * 10

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).runWith(e), m.runWith(e), 'identity')
  t.equal(m.map(compose(f, g)).runWith(e), m.map(g).map(f).runWith(e), 'composition')

  t.end()
})

test('Reader ap errors', t => {
  const ap = bindFunc(Reader(unit).ap)
  const m = { type: () => 'Reader...Not' }

  const noReader = /Reader.ap: Reader required/
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
  t.throws(ap(m), noReader, 'throws when Non-Reader')

  t.doesNotThrow(ap(Reader(unit)), 'allows a function')

  const fn = bindFunc(Reader(identity).ap(Reader(unit)).runWith)

  const noFunc = /Reader.ap: Wrapped function must return a function/
  t.throws(fn(undefined), noFunc, 'throws with undefined returned')
  t.throws(fn(null), noFunc, 'throws with null returned')
  t.throws(fn(0), noFunc, 'throws with falsey number returned')
  t.throws(fn(1), noFunc, 'throws with truthy number returned')
  t.throws(fn(''), noFunc, 'throws with falsey string returned')
  t.throws(fn('string'), noFunc, 'throws with truthy string returned')
  t.throws(fn(false), noFunc, 'throws with false returned')
  t.throws(fn(true), noFunc, 'throws with true returned')
  t.throws(fn([]), noFunc, 'throws with an array returned')
  t.throws(fn({}), noFunc, 'throws with an object returned')

  t.doesNotThrow(fn(identity), 'allows a function to be returned')

  t.end()
})

test('Reader ap properties (Apply)', t => {
  const m = Reader(constant(identity))
  const e = 92

  const add3 = x => x + 3

  const a = m.map(compose).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(Reader(unit).map), 'implements the Functor spec')
  t.ok(isFunction(Reader(unit).ap), 'provides an ap function')

  t.equal(a.ap(Reader(add3)).runWith(e), b.ap(Reader(add3)).runWith(e), 'composition')

  t.end()
})

test('Reader of', t => {
  t.equal(Reader.of, Reader(unit).of, 'of is the same as the instance version')
  t.ok(isSameType(Reader, Reader.of(0)), 'returns a Reader')
  t.equal(Reader.of(0).runWith(22), 0, 'wraps the value passed in a Reader')

  t.end()
})

test('Reader of properties (Applicative)', t => {
  const m = Reader(constant(identity))
  const e = 38

  const add27 = x => x + 27

  t.ok(isFunction(Reader(unit).of), 'provides an of function')
  t.ok(isFunction(Reader(unit).ap), 'implements the Apply spec')

  t.equal(m.ap(Reader(add27)).runWith(e), add27(e), 'identity')
  t.equal(m.ap(Reader.of(3)).runWith(e), Reader.of(identity(3)).runWith(e), 'homomorphism')

  const a = x => m.ap(Reader.of(x))
  const b = x => Reader.of(reverseApply(x)).ap(m)

  t.equal(a(3).runWith(e), b(3).runWith(e), 'interchange')

  t.end()
})

test('Reader chain errors', t => {
  const chain = bindFunc(Reader(unit).chain)

  const noFunc = /Reader.chain: Function required/
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
    bindFunc(Reader(identity).chain(identity).runWith)

  const noReader = /Reader.chain: Function must return a Reader/
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

test('Reader chain properties (Chain)', t => {
  t.ok(isFunction(Reader(unit).chain), 'provides a chain function')
  t.ok(isFunction(Reader(unit).ap), 'implements the Apply spec')

  const e = 8

  const f = x => Reader(y => x + y + 2)
  const g = x => Reader(y => x + y + 10)

  const a = x => Reader(constant(x)).chain(f).chain(g)
  const b = x => Reader(constant(x)).chain(y => f(y).chain(g))

  t.equal(a(10).runWith(e), b(10).runWith(e), 'assosiativity')

  t.end()
})

test('Reader chain properties (Monad)', t => {
  t.ok(isFunction(Reader(unit).chain), 'implements the Chain spec')
  t.ok(Reader(unit).of, 'implements the Applicative spec')

  const f = x => Reader(constant(x))

  t.equal(Reader.of(3).chain(f).runWith(0), f(3).runWith(0), 'left identity')
  t.equal(f(6).chain(Reader.of).runWith(0), f(6).runWith(0), 'right identity')

  t.end()
})
