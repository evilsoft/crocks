const test = require('tape')
const helpers = require('../test/helpers')
const sinon = require('sinon')

const bindFunc = helpers.bindFunc
const unit = require('../helpers/unit')

const isFunction = require('../predicates/isFunction')
const isObject = require('../predicates/isObject')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const MockCrock = require('../test/MockCrock')
const Pair = require('./Pair')

const Star = require('./Star')

test('Star', t => {
  const a = bindFunc(Star)

  t.ok(isFunction(Star), 'is a function')

  t.ok(isFunction(Star.type), 'provides a type function')

  t.ok(isObject(Star(unit)), 'returns an object')

  t.throws(Star, TypeError, 'throws with nothing')
  t.throws(a(undefined), TypeError, 'throws with undefined')
  t.throws(a(null), TypeError, 'throws with undefined')
  t.throws(a(0), TypeError, 'throws with falsey number')
  t.throws(a(1), TypeError, 'throws with truthy number')
  t.throws(a(''), TypeError, 'throws with falsey string')
  t.throws(a('string'), TypeError, 'throws with truthy string')
  t.throws(a(false), TypeError, 'throws with false')
  t.throws(a(true), TypeError, 'throws with true')
  t.throws(a({}), TypeError, 'throws with an object')
  t.throws(a([]), TypeError, 'throws with an array')

  t.doesNotThrow(a(unit), 'allows a function')

  t.end()
})

test('Star inspect', t => {
  const a = Star(unit)

  t.ok(isFunction(a.inspect), 'provides an inspect function')
  t.equal(a.inspect(), 'Star Function', 'returns inspect string')

  t.end()
})

test('Star type', t => {
  const a = Star(unit)
  t.ok(isFunction(a.type), 'is a function')

  t.equal(a.type, Star.type, 'static and instance versions are the same')
  t.equal(a.type(), 'Star', 'reports Star')

  t.end()
})

test('Star runWith', t => {
  const f = sinon.spy(MockCrock)
  const a = Star(f)

  t.ok(isFunction(a.runWith), 'is a function')

  const result = a.runWith('apple')

  t.ok(f.calledWith('apple'), 'calls the wrapped function passing provided argument')
  t.ok(f.returned(result), 'returns the result of the wrapped function')

  t.end()
})

test('Star concat functionality', t => {
  const f = x => MockCrock(x + 1)

  const a = Star(f)

  const notStar = { type: constant('Star...Not') }
  const notMock  = { type: constant('Mock...Not') }

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
  t.throws(cat(notStar), TypeError, 'throws with non-Star')

  const noMonadFst = bindFunc(Star(identity).concat(a).runWith)

  t.throws(noMonadFst(undefined), TypeError, 'throws when first computation returns undefined')
  t.throws(noMonadFst(null), TypeError, 'throws when first computation returns null')
  t.throws(noMonadFst(0), TypeError, 'throws when first computation returns falsey number')
  t.throws(noMonadFst(1), TypeError, 'throws when first computation returns truthy number')
  t.throws(noMonadFst(''), TypeError, 'throws when first computation returns falsey string')
  t.throws(noMonadFst('string'), TypeError, 'throws when first computation returns truthy string')
  t.throws(noMonadFst(false), TypeError, 'throws when first computation returns false')
  t.throws(noMonadFst(true), TypeError, 'throws when first computation returns true')
  t.throws(noMonadFst({}), TypeError, 'throws when first computation returns false')
  t.throws(noMonadFst([]), TypeError, 'throws when first computation returns true')

  const noMonadSnd = bindFunc(x => a.concat(Star(constant(x))).runWith(10))

  t.throws(noMonadSnd(undefined), TypeError, 'throws when second computation returns undefined')
  t.throws(noMonadSnd(null), TypeError, 'throws when second computation returns null')
  t.throws(noMonadSnd(0), TypeError, 'throws when second computation returns falsey number')
  t.throws(noMonadSnd(1), TypeError, 'throws when second computation returns truthy number')
  t.throws(noMonadSnd(''), TypeError, 'throws when second computation returns falsey string')
  t.throws(noMonadSnd('string'), TypeError, 'throws when second computation returns truthy string')
  t.throws(noMonadSnd(false), TypeError, 'throws when second computation returns false')
  t.throws(noMonadSnd(true), TypeError, 'throws when second computation returns true')
  t.throws(noMonadSnd({}), TypeError, 'throws when second computation returns false')
  t.throws(noMonadSnd([]), TypeError, 'throws when second computation returns true')
  t.throws(noMonadSnd(notMock), TypeError, 'throws when second computation returns non-MockCrock')

  const x = 13
  const g = x => MockCrock(x * 10)

  const chained = f(x).chain(g).value()
  const star = a.concat(Star(g)).runWith(x).value()

  t.equal(chained, star, 'builds composition as expected')

  t.end()
})

test('Star concat properties (Semigroup)', t => {
  const a = Star(x => MockCrock(x + 1))
  const b = Star(x => MockCrock(x * 10))
  const c = Star(x => MockCrock(x - 5))

  t.ok(isFunction(Star(identity).concat), 'is a function')

  const left = a.concat(b).concat(c).runWith
  const right = a.concat(b.concat(c)).runWith
  const x = 20

  t.same(left(x).value(), right(x).value(), 'associativity')
  t.same(a.concat(b).type(), a.type(), 'returns Semigroup of same type')

  t.end()
})

test('Star map errors', t => {
  const map = bindFunc(Star(unit).map)

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

  t.doesNotThrow(map(unit), 'allows functions')

  const runWith = bindFunc(Star(identity).map(identity).runWith)

  t.throws(runWith('silly'), TypeError, 'throws when inner function does not return a Functor')

  t.end()
})

test('Star map functionality', t => {
  const x = 42
  const spy = sinon.spy(identity)

  const m = Star(MockCrock).map(spy)

  t.equal(m.type(), 'Star', 'returns a Star')
  t.notOk(spy.called, 'does not call mapping function initially')

  const result = m.runWith(x)

  t.ok(spy.called, 'calls mapping function when ran')
  t.equal(result.type(), 'MockCrock', 'returns the resulting Functor')
  t.equal(result.value(), x, 'resulting Functor contains original value')

  t.end()
})

test('Star map properties (Functor)', t => {
  const m = Star(MockCrock)

  const f = x => x + 12
  const g = x => x * 10

  const x = 76

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).runWith(x).value(), m.runWith(x).value(), 'identity')
  t.equal(
    m.map(composeB(f, g)).runWith(x).value(),
    m.map(g).map(f).runWith(x).value(),
    'composition'
  )

  t.end()
})

test('Star contramap errors', t => {
  const cmap = bindFunc(Star(unit).contramap)

  t.throws(cmap(undefined), TypeError, 'throws with undefined')
  t.throws(cmap(null), TypeError, 'throws with null')
  t.throws(cmap(0), TypeError, 'throws with falsey number')
  t.throws(cmap(1), TypeError, 'throws with truthy number')
  t.throws(cmap(''), TypeError, 'throws with falsey string')
  t.throws(cmap('string'), TypeError, 'throws with truthy string')
  t.throws(cmap(false), TypeError, 'throws with false')
  t.throws(cmap(true), TypeError, 'throws with true')
  t.throws(cmap([]), TypeError, 'throws with an array')
  t.throws(cmap({}), TypeError, 'throws with an object')

  t.doesNotThrow(cmap(unit), 'allows functions')

  t.end()
})

test('Star contramap functionality', t => {
  const spy = sinon.spy(identity)
  const x = 7

  const m = Star(MockCrock).contramap(spy)

  t.equal(m.type(), 'Star', 'returns a Star')
  t.notOk(spy.called, 'does not call mapping function initially')

  m.runWith(x)

  t.ok(spy.called, 'calls mapping function when ran')
  t.equal(m.runWith(x).value(), x, 'returns the result of the resulting composition')

  t.end()
})

test('Star contramap properties (Contra Functor)', t => {
  const m = Star(MockCrock)

  const f = x => x + 12
  const g = x => x * 10

  const x = 76

  t.ok(isFunction(m.contramap), 'provides a contramap function')

  t.equal(m.contramap(identity).runWith(x).value(), m.runWith(x).value(), 'identity')
  t.equal(
    m.contramap(composeB(f, g)).runWith(x).value(),
    m.contramap(f).contramap(g).runWith(x).value(),
    'composition'
  )

  t.end()
})

test('Star promap errors', t => {
  const promap = bindFunc(Star(MockCrock).promap)

  t.throws(promap(undefined, unit), TypeError, 'throws with undefined as first argument')
  t.throws(promap(null, unit), TypeError, 'throws with null as first argument')
  t.throws(promap(0, unit), TypeError, 'throws with falsey number as first argument')
  t.throws(promap(1, unit), TypeError, 'throws with truthy number as first argument')
  t.throws(promap('', unit), TypeError, 'throws with falsey string as first argument')
  t.throws(promap('string', unit), TypeError, 'throws with truthy string as first argument')
  t.throws(promap(false, unit), TypeError, 'throws with false as first argument')
  t.throws(promap(true, unit), TypeError, 'throws with true as first argument')
  t.throws(promap([], unit), TypeError, 'throws with an array as first argument')
  t.throws(promap({}, unit), TypeError, 'throws with an object as first argument')

  t.throws(promap(unit, undefined), TypeError, 'throws with undefined as second argument')
  t.throws(promap(unit, null), TypeError, 'throws with null as second argument')
  t.throws(promap(unit, 0), TypeError, 'throws with falsey number as second argument')
  t.throws(promap(unit, 1), TypeError, 'throws with truthy number as second argument')
  t.throws(promap(unit, ''), TypeError, 'throws with falsey string as second argument')
  t.throws(promap(unit, 'string'), TypeError, 'throws with truthy string as second argument')
  t.throws(promap(unit, false), TypeError, 'throws with false as second argument')
  t.throws(promap(unit, true), TypeError, 'throws with true as second argument')
  t.throws(promap(unit, []), TypeError, 'throws with an array as second argument')
  t.throws(promap(unit, {}), TypeError, 'throws with an object as second argument')

  t.doesNotThrow(promap(unit, unit), 'allows functions')

  const runWith = bindFunc(Star(identity).promap(identity, identity).runWith)

  t.throws(runWith('silly'), TypeError, 'throws when inner function does not return a Functor')

  t.end()
})

test('Star promap functionality', t => {
  const x = 42
  const f = x => x * 20
  const g = x => x + 10

  const spyLeft = sinon.spy(f)
  const spyRight = sinon.spy(g)

  const comp = composeB(g, f)

  const m = Star(MockCrock).promap(spyLeft, spyRight)

  t.equal(m.type(), 'Star', 'returns a Star')
  t.notOk(spyLeft.called, 'does not call left mapping function initially')
  t.notOk(spyRight.called, 'does not call right mapping function initially')

  m.runWith(x)

  t.ok(spyLeft.called, 'calls left mapping function when ran')
  t.ok(spyRight.called, 'calls right mapping function when ran')
  t.equal(m.runWith(x).value(), comp(x), 'returns the result of the resulting composition')

  t.end()
})

test('Star promap properties (Functor)', t => {
  const m = Star(MockCrock)

  const f = x => x + 12
  const g = x => x * 10

  const h = x => x + 2
  const k = x => x * 2

  const x = 76

  t.ok(isFunction(m.map), 'provides a map function')
  t.ok(isFunction(m.contramap), 'provides a contramap function')
  t.ok(isFunction(m.promap), 'provides a promap function')

  t.equal(m.promap(identity, identity).runWith(x).value(), m.runWith(x).value(), 'identity')

  t.equal(
    m.promap(composeB(f, g), composeB(h, k)).runWith(x).value(),
    m.promap(f, k).promap(g, h).runWith(x).value(),
    'composition'
  )

  t.end()
})

test('Star first', t => {
  t.ok(isFunction(Star(unit).first), 'provides a first function')

  const m = Star(x => MockCrock(x + 1))

  const runWith = bindFunc(m.first().runWith)

  t.throws(runWith(undefined), TypeError, 'throws with undefined input')
  t.throws(runWith(null), TypeError, 'throws with null as input')
  t.throws(runWith(0), TypeError, 'throws with falsey number as input')
  t.throws(runWith(1), TypeError, 'throws with truthy number as input')
  t.throws(runWith(''), TypeError, 'throws with falsey string as input')
  t.throws(runWith('string'), TypeError, 'throws with truthy string as input')
  t.throws(runWith(false), TypeError, 'throws with false as input')
  t.throws(runWith(true), TypeError, 'throws with true as input')
  t.throws(runWith([]), TypeError, 'throws with an array as input')
  t.throws(runWith({}), TypeError, 'throws with an object as input')

  t.doesNotThrow(runWith(Pair(1, 2)), 'does not throw when inner value is a Pair')

  const notValid = bindFunc(x => Star(() => x).first().runWith(Pair(2, 3)))

  t.throws(notValid(undefined), TypeError, 'throws with undefined input')
  t.throws(notValid(null), TypeError, 'throws with null as input')
  t.throws(notValid(0), TypeError, 'throws with falsey number as input')
  t.throws(notValid(1), TypeError, 'throws with truthy number as input')
  t.throws(notValid(''), TypeError, 'throws with falsey string as input')
  t.throws(notValid('string'), TypeError, 'throws with truthy string as input')
  t.throws(notValid(false), TypeError, 'throws with false as input')
  t.throws(notValid(true), TypeError, 'throws with true as input')
  t.throws(notValid({}), TypeError, 'throws with an object as input')

  const result = m.first().runWith(Pair(10, 10)).value()

  t.equal(result.type(), 'Pair', 'returns a Pair')
  t.equal(result.fst(), 11, 'applies the function to the fst element of a pair')
  t.equal(result.snd(), 10, 'does not apply the function to the second element of a pair')

  t.end()
})

test('Star second', t => {
  t.ok(isFunction(Star(unit).second), 'provides a second function')

  const m = Star(x => MockCrock(x + 1))

  const runWith = bindFunc(m.second().runWith)

  t.throws(runWith(undefined), TypeError, 'throws with undefined as input')
  t.throws(runWith(null), TypeError, 'throws with null as input')
  t.throws(runWith(0), TypeError, 'throws with falsey number as input')
  t.throws(runWith(1), TypeError, 'throws with truthy number as input')
  t.throws(runWith(''), TypeError, 'throws with falsey string as input')
  t.throws(runWith('string'), TypeError, 'throws with truthy string as input')
  t.throws(runWith(false), TypeError, 'throws with false as input')
  t.throws(runWith(true), TypeError, 'throws with true as input')
  t.throws(runWith([]), TypeError, 'throws with an array as input')
  t.throws(runWith({}), TypeError, 'throws with an object as input')

  t.doesNotThrow(runWith(Pair(1, 2)), 'does not throw when inner value is a Pair')

  const notValid = bindFunc(x => Star(() => x).second().runWith(Pair(2, 3)))

  t.throws(notValid(undefined), TypeError, 'throws when computation returns undefined')
  t.throws(notValid(null), TypeError, 'throws when computation returns null')
  t.throws(notValid(0), TypeError, 'throws when computation returns falsey number')
  t.throws(notValid(1), TypeError, 'throws when computation returns truthy number')
  t.throws(notValid(''), TypeError, 'throws when computation returns falsey string')
  t.throws(notValid('string'), TypeError, 'throws when computation returns truthy string')
  t.throws(notValid(false), TypeError, 'throws when computation returns false')
  t.throws(notValid(true), TypeError, 'throws when computation returns true')
  t.throws(notValid({}), TypeError, 'throws an when computation returns object')

  t.doesNotThrow(notValid(MockCrock.of(2)), 'does not throw when computation returns a Functor')

  const result = m.second().runWith(Pair(10, 10)).value()

  t.equal(result.type(), 'Pair', 'returns a Pair')
  t.equal(result.snd(), 11, 'applies the function to the snd element of a pair')
  t.equal(result.fst(), 10, 'does not apply the function to the first element of a pair')

  t.end()
})

test('Star both', t => {
  t.ok(isFunction(Star(unit).both), 'provides a both function')

  const m = Star(x => MockCrock(x + 1))

  const runWith = bindFunc(m.both().runWith)

  t.throws(runWith(undefined), TypeError, 'throws with undefined as input')
  t.throws(runWith(null), TypeError, 'throws with null as input')
  t.throws(runWith(0), TypeError, 'throws with falsey number as input')
  t.throws(runWith(1), TypeError, 'throws with truthy number as input')
  t.throws(runWith(''), TypeError, 'throws with falsey string as input')
  t.throws(runWith('string'), TypeError, 'throws with truthy string as input')
  t.throws(runWith(false), TypeError, 'throws with false as input')
  t.throws(runWith(true), TypeError, 'throws with true as input')
  t.throws(runWith([]), TypeError, 'throws with an array as input')
  t.throws(runWith({}), TypeError, 'throws with an object as input')

  t.doesNotThrow(runWith(Pair(1, 2)), 'does not throw when inner value is a Pair')

  const notValid = bindFunc(x => Star(() => x).both().runWith(Pair(2, 3)))

  t.throws(notValid(undefined), TypeError, 'throws when computation returns undefined')
  t.throws(notValid(null), TypeError, 'throws when computation returns null')
  t.throws(notValid(0), TypeError, 'throws when computation returns falsey number')
  t.throws(notValid(1), TypeError, 'throws when computation returns truthy number')
  t.throws(notValid(''), TypeError, 'throws when computation returns falsey string')
  t.throws(notValid('string'), TypeError, 'throws when computation returns truthy string')
  t.throws(notValid(false), TypeError, 'throws when computation returns false')
  t.throws(notValid(true), TypeError, 'throws when computation returns true')
  t.throws(notValid({}), TypeError, 'throws an when computation returns object')

  t.doesNotThrow(notValid(MockCrock.of(2)), 'does not throw when computation returns a Functor')

  const result = m.both().runWith(Pair(10, 10)).value()

  t.equal(result.type(), 'Pair', 'returns a Pair')
  t.equal(result.fst(), 11, 'applies the function to the first element of a pair')
  t.equal(result.snd(), 11, 'applies the function to the snd element of a pair')

  t.end()
})
