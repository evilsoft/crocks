const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')
const MockCrock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const _compose = require('../core/compose')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const Pair = require('../core/Pair')

const constant = x => () => x
const identity = x => x

const _Star = require('.')

const Star = _Star(MockCrock)

test('Star', t => {
  const a = bindFunc(_Star)

  t.ok(isFunction(_Star), 'is a function')

  t.ok(isFunction(Star.type), 'provides a type function')

  t.equals(Star(unit).constructor, Star, 'provides TypeRep on constructor')

  t.ok(isObject(Star(unit)), 'returns an object')

  const err = /Star: Monad required for construction/
  t.throws(a(), err, 'throws with nothing')
  t.throws(a(undefined), err, 'throws with undefined')
  t.throws(a(null), err, 'throws with undefined')
  t.throws(a(0), err, 'throws with falsey number')
  t.throws(a(1), err, 'throws with truthy number')
  t.throws(a(''), err, 'throws with falsey string')
  t.throws(a('string'), err, 'throws with truthy string')
  t.throws(a(false), err, 'throws with false')
  t.throws(a(true), err, 'throws with true')
  t.throws(a({}), err, 'throws with an object')
  t.throws(a([]), err, 'throws with an array')
  t.throws(a(unit), err, 'throws with a function')

  t.doesNotThrow(a(MockCrock), 'allows a Monad')

  t.end()
})

test('Star construction', t => {
  const a = bindFunc(Star)

  t.ok(isFunction(Star), 'Constructor returns a function')

  t.ok(isFunction(Star.type), 'provides a type function')
  t.ok(isFunction(Star.id), 'provides an id function')

  t.ok(isObject(Star(unit)), 'returns an object')

  const err = /Star\( MockCrock \): Function in the form \(a -> m b\) required/
  t.throws(Star, err, 'throws with nothing')
  t.throws(a(undefined), err, 'throws with undefined')
  t.throws(a(null), err, 'throws with undefined')
  t.throws(a(0), err, 'throws with falsey number')
  t.throws(a(1), err, 'throws with truthy number')
  t.throws(a(''), err, 'throws with falsey string')
  t.throws(a('string'), err, 'throws with truthy string')
  t.throws(a(false), err, 'throws with false')
  t.throws(a(true), err, 'throws with true')
  t.throws(a({}), err, 'throws with an object')
  t.throws(a([]), err, 'throws with an array')

  t.doesNotThrow(a(unit), 'allows a function')

  t.end()
})

test('Star @@implements', t => {
  const f = Star['@@implements']

  t.equal(f('compose'), true, 'implements compose func')
  t.equal(f('contramap'), true, 'implements contramap func')
  t.equal(f('id'), true, 'implements id  func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('promap'), true, 'implements promap func')

  t.end()
})

test('Star inspect', t => {
  const a = Star(unit)

  t.ok(isFunction(a.inspect), 'provides an inspect function')
  t.equal(a.inspect(), 'Star( MockCrock ) Function', 'returns inspect string')

  t.end()
})

test('Star type', t => {
  const a = Star(unit)
  t.ok(isFunction(a.type), 'is a function')

  t.equal(a.type, Star.type, 'static and instance versions are the same')
  t.equal(a.type(), 'Star( MockCrock )', 'reports Star with embeded type')

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

test('Star compose functionality', t => {
  const f = x => MockCrock(x + 1)

  const a = Star(f)

  const notStar = { type: constant('Star...Not') }
  const notMock  = { type: constant('Mock...Not') }

  const cat = bindFunc(a.compose)

  const noStar = /Star\( MockCrock \).compose: Star\( MockCrock \) required/
  t.throws(cat(undefined), noStar, 'throws with undefined')
  t.throws(cat(null), noStar, 'throws with null')
  t.throws(cat(0), noStar, 'throws with falsey number')
  t.throws(cat(1), noStar, 'throws with truthy number')
  t.throws(cat(''), noStar, 'throws with falsey string')
  t.throws(cat('string'), noStar, 'throws with truthy string')
  t.throws(cat(false), noStar, 'throws with false')
  t.throws(cat(true), noStar, 'throws with true')
  t.throws(cat([]), noStar, 'throws with an array')
  t.throws(cat({}), noStar, 'throws with an object')
  t.throws(cat(notStar), noStar, 'throws with non-Star')

  const noMonadFst = bindFunc(Star(identity).compose(a).runWith)

  const noFst = /Star\( MockCrock \).compose: Computations must return a type of MockCrock/
  t.throws(noMonadFst(undefined), noFst, 'throws when first computation returns undefined')
  t.throws(noMonadFst(null), noFst, 'throws when first computation returns null')
  t.throws(noMonadFst(0), noFst, 'throws when first computation returns falsey number')
  t.throws(noMonadFst(1), noFst, 'throws when first computation returns truthy number')
  t.throws(noMonadFst(''), noFst, 'throws when first computation returns falsey string')
  t.throws(noMonadFst('string'), noFst, 'throws when first computation returns truthy string')
  t.throws(noMonadFst(false), noFst, 'throws when first computation returns false')
  t.throws(noMonadFst(true), noFst, 'throws when first computation returns true')
  t.throws(noMonadFst({}), noFst, 'throws when first computation returns false')
  t.throws(noMonadFst([]), noFst, 'throws when first computation returns true')

  const noMonadSnd = bindFunc(x => a.compose(Star(constant(x))).runWith(10))

  const noSnd = /Star\( MockCrock \).compose: Both computations must return a type of MockCrock/
  t.throws(noMonadSnd(undefined), noSnd, 'throws when second computation returns undefined')
  t.throws(noMonadSnd(null), noSnd, 'throws when second computation returns null')
  t.throws(noMonadSnd(0), noSnd, 'throws when second computation returns falsey number')
  t.throws(noMonadSnd(1), noSnd, 'throws when second computation returns truthy number')
  t.throws(noMonadSnd(''), noSnd, 'throws when second computation returns falsey string')
  t.throws(noMonadSnd('string'), noSnd, 'throws when second computation returns truthy string')
  t.throws(noMonadSnd(false), noSnd, 'throws when second computation returns false')
  t.throws(noMonadSnd(true), noSnd, 'throws when second computation returns true')
  t.throws(noMonadSnd({}), noSnd, 'throws when second computation returns false')
  t.throws(noMonadSnd([]), noSnd, 'throws when second computation returns true')
  t.throws(noMonadSnd(notMock), noSnd, 'throws when second computation returns non-MockCrock')

  const x = 13
  const g = x => MockCrock(x * 10)

  const chained = f(x).chain(g).valueOf()
  const star = a.compose(Star(g)).runWith(x).valueOf()

  t.equal(chained, star, 'builds composition as expected')

  t.end()
})

test('Star compose properties (Semigroupoid)', t => {
  const a = Star(x => MockCrock(x + 1))
  const b = Star(x => MockCrock(x * 10))
  const c = Star(x => MockCrock(x - 5))

  t.ok(isFunction(Star(identity).compose), 'is a function')

  const left = a.compose(b).compose(c).runWith
  const right = a.compose(b.compose(c)).runWith
  const x = 20

  t.same(left(x).valueOf(), right(x).valueOf(), 'associativity')
  t.same(a.compose(b).type(), a.type(), 'returns Semigroupoid of same type')

  t.end()
})

test('Star id functionality', t => {
  const m = Star.id()
  const value = 13
  const result = m.runWith(value)

  t.equal(m.id, Star.id, 'static and instance versions are the same')

  t.ok(isSameType(Star, m), 'provides an Arrow')
  t.ok(isSameType(MockCrock, result), 'returns an instance of the wraped monad')
  t.equals(result.valueOf(), value, 'resulting instance wraps idenity of input')

  t.end()
})

test('Star id properties (Category)', t => {
  const m = Star(x => MockCrock(x + 45))
  const x = 32

  t.ok(isFunction(m.compose), 'provides a compose function')
  t.ok(isFunction(m.id), 'provides an id function')

  const right = m.compose(m.id()).runWith
  const left = m.id().compose(m).runWith

  t.same(right(x).valueOf(), m.runWith(x).valueOf(), 'right identity')
  t.same(left(x).valueOf(), m.runWith(x).valueOf(), 'left identity')

  t.end()
})

test('Star map errors', t => {
  const map = bindFunc(Star(unit).map)

  const err = /Star\( MockCrock \).map: Function required/
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

  const runWith = bindFunc(Star(identity).map(identity).runWith)

  const noMonad = /Star\( MockCrock \).map: Computations must return a type of MockCrock/
  t.throws(runWith('silly'), noMonad, 'throws when inner function does not return a Functor')

  t.end()
})

test('Star map functionality', t => {
  const x = 42
  const spy = sinon.spy(identity)

  const m = Star(MockCrock).map(spy)

  t.ok(isSameType(Star, m), 'returns a Star')
  t.notOk(spy.called, 'does not call mapping function initially')

  const result = m.runWith(x)

  t.ok(spy.called, 'calls mapping function when ran')
  t.equal(result.type(), 'MockCrock', 'returns the resulting Functor')
  t.equal(result.valueOf(), x, 'resulting Functor contains original value')

  t.end()
})

test('Star map properties (Functor)', t => {
  const m = Star(MockCrock)

  const f = x => x + 12
  const g = x => x * 10

  const x = 76

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).runWith(x).valueOf(), m.runWith(x).valueOf(), 'identity')
  t.equal(
    m.map(_compose(f, g)).runWith(x).valueOf(),
    m.map(g).map(f).runWith(x).valueOf(),
    'composition'
  )

  t.end()
})

test('Star contramap errors', t => {
  const cmap = bindFunc(Star(unit).contramap)

  const err = /Star\( MockCrock \).contramap: Function required/
  t.throws(cmap(undefined), err, 'throws with undefined')
  t.throws(cmap(null), err, 'throws with null')
  t.throws(cmap(0), err, 'throws with falsey number')
  t.throws(cmap(1), err, 'throws with truthy number')
  t.throws(cmap(''), err, 'throws with falsey string')
  t.throws(cmap('string'), err, 'throws with truthy string')
  t.throws(cmap(false), err, 'throws with false')
  t.throws(cmap(true), err, 'throws with true')
  t.throws(cmap([]), err, 'throws with an array')
  t.throws(cmap({}), err, 'throws with an object')

  t.doesNotThrow(cmap(unit), 'allows functions')

  t.end()
})

test('Star contramap functionality', t => {
  const spy = sinon.spy(identity)
  const x = 7

  const m = Star(MockCrock).contramap(spy)

  t.ok(isSameType(Star, m), 'returns a Star')
  t.notOk(spy.called, 'does not call mapping function initially')

  m.runWith(x)

  t.ok(spy.called, 'calls mapping function when ran')
  t.equal(m.runWith(x).valueOf(), x, 'returns the result of the resulting composition')

  t.end()
})

test('Star contramap properties (Contra Functor)', t => {
  const m = Star(MockCrock)

  const f = x => x + 12
  const g = x => x * 10

  const x = 76

  t.ok(isFunction(m.contramap), 'provides a contramap function')

  t.equal(m.contramap(identity).runWith(x).valueOf(), m.runWith(x).valueOf(), 'identity')
  t.equal(
    m.contramap(_compose(f, g)).runWith(x).valueOf(),
    m.contramap(f).contramap(g).runWith(x).valueOf(),
    'composition'
  )

  t.end()
})

test('Star promap errors', t => {
  const promap = bindFunc(Star(MockCrock).promap)

  const noFuncs = /Star\( MockCrock \).promap: Functions required for both arguments/
  t.throws(promap(undefined, unit), noFuncs, 'throws with undefined as first argument')
  t.throws(promap(null, unit), noFuncs, 'throws with null as first argument')
  t.throws(promap(0, unit), noFuncs, 'throws with falsey number as first argument')
  t.throws(promap(1, unit), noFuncs, 'throws with truthy number as first argument')
  t.throws(promap('', unit), noFuncs, 'throws with falsey string as first argument')
  t.throws(promap('string', unit), noFuncs, 'throws with truthy string as first argument')
  t.throws(promap(false, unit), noFuncs, 'throws with false as first argument')
  t.throws(promap(true, unit), noFuncs, 'throws with true as first argument')
  t.throws(promap([], unit), noFuncs, 'throws with an array as first argument')
  t.throws(promap({}, unit), noFuncs, 'throws with an object as first argument')

  t.throws(promap(unit, undefined), noFuncs, 'throws with undefined as second argument')
  t.throws(promap(unit, null), noFuncs, 'throws with null as second argument')
  t.throws(promap(unit, 0), noFuncs, 'throws with falsey number as second argument')
  t.throws(promap(unit, 1), noFuncs, 'throws with truthy number as second argument')
  t.throws(promap(unit, ''), noFuncs, 'throws with falsey string as second argument')
  t.throws(promap(unit, 'string'), noFuncs, 'throws with truthy string as second argument')
  t.throws(promap(unit, false), noFuncs, 'throws with false as second argument')
  t.throws(promap(unit, true), noFuncs, 'throws with true as second argument')
  t.throws(promap(unit, []), noFuncs, 'throws with an array as second argument')
  t.throws(promap(unit, {}), noFuncs, 'throws with an object as second argument')

  t.doesNotThrow(promap(unit, unit), 'allows functions')

  const runWith = bindFunc(Star(identity).promap(identity, identity).runWith)

  const err = /Star\( MockCrock \).promap: Computation must return a type of MockCrock/
  t.throws(runWith('silly'), err, 'throws when inner function does not return a Monad')

  t.end()
})

test('Star promap functionality', t => {
  const x = 42
  const f = x => x * 20
  const g = x => x + 10

  const spyLeft = sinon.spy(f)
  const spyRight = sinon.spy(g)

  const comp = _compose(g, f)

  const m = Star(MockCrock).promap(spyLeft, spyRight)

  t.ok(isSameType(Star, m), 'returns a Star')
  t.notOk(spyLeft.called, 'does not call left mapping function initially')
  t.notOk(spyRight.called, 'does not call right mapping function initially')

  m.runWith(x)

  t.ok(spyLeft.called, 'calls left mapping function when ran')
  t.ok(spyRight.called, 'calls right mapping function when ran')
  t.equal(m.runWith(x).valueOf(), comp(x), 'returns the result of the resulting composition')

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

  t.equal(m.promap(identity, identity).runWith(x).valueOf(), m.runWith(x).valueOf(), 'identity')

  t.equal(
    m.promap(_compose(f, g), _compose(h, k)).runWith(x).valueOf(),
    m.promap(f, k).promap(g, h).runWith(x).valueOf(),
    'composition'
  )

  t.end()
})

test('Star first', t => {
  t.ok(isFunction(Star(unit).first), 'provides a first function')

  const m = Star(x => MockCrock(x + 1))

  const runWith = bindFunc(m.first().runWith)

  const noPair = /Star\( MockCrock \).first: Pair required for computation input/
  t.throws(runWith(undefined), noPair, 'throws with undefined input')
  t.throws(runWith(null), noPair, 'throws with null as input')
  t.throws(runWith(0), noPair, 'throws with falsey number as input')
  t.throws(runWith(1), noPair, 'throws with truthy number as input')
  t.throws(runWith(''), noPair, 'throws with falsey string as input')
  t.throws(runWith('string'), noPair, 'throws with truthy string as input')
  t.throws(runWith(false), noPair, 'throws with false as input')
  t.throws(runWith(true), noPair, 'throws with true as input')
  t.throws(runWith([]), noPair, 'throws with an array as input')
  t.throws(runWith({}), noPair, 'throws with an object as input')

  t.doesNotThrow(runWith(Pair(1, 2)), 'does not throw when inner value is a Pair')

  const notValid = bindFunc(x => Star(() => x).first().runWith(Pair(2, 3)))

  const err = /Star\( MockCrock \).first: Computation must return a type of MockCrock/
  t.throws(notValid(undefined), err, 'throws with undefined input')
  t.throws(notValid(null), err, 'throws with null as input')
  t.throws(notValid(0), err, 'throws with falsey number as input')
  t.throws(notValid(1), err, 'throws with truthy number as input')
  t.throws(notValid(''), err, 'throws with falsey string as input')
  t.throws(notValid('string'), err, 'throws with truthy string as input')
  t.throws(notValid(false), err, 'throws with false as input')
  t.throws(notValid(true), err, 'throws with true as input')
  t.throws(notValid({}), err, 'throws with an object as input')

  const result = m.first().runWith(Pair(10, 10)).valueOf()

  t.ok(isSameType(Pair, result), 'returns a Pair')
  t.equal(result.fst(), 11, 'applies the function to the fst element of a pair')
  t.equal(result.snd(), 10, 'does not apply the function to the second element of a pair')

  t.end()
})

test('Star second', t => {
  t.ok(isFunction(Star(unit).second), 'provides a second function')

  const m = Star(x => MockCrock(x + 1))

  const runWith = bindFunc(m.second().runWith)

  const noPair = /Star\( MockCrock \).second: Pair required for computation input/
  t.throws(runWith(undefined), noPair, 'throws with undefined as input')
  t.throws(runWith(null), noPair, 'throws with null as input')
  t.throws(runWith(0), noPair, 'throws with falsey number as input')
  t.throws(runWith(1), noPair, 'throws with truthy number as input')
  t.throws(runWith(''), noPair, 'throws with falsey string as input')
  t.throws(runWith('string'), noPair, 'throws with truthy string as input')
  t.throws(runWith(false), noPair, 'throws with false as input')
  t.throws(runWith(true), noPair, 'throws with true as input')
  t.throws(runWith([]), noPair, 'throws with an array as input')
  t.throws(runWith({}), noPair, 'throws with an object as input')

  t.doesNotThrow(runWith(Pair(1, 2)), 'does not throw when inner value is a Pair')

  const notValid = bindFunc(x => Star(() => x).second().runWith(Pair(2, 3)))

  const err = /Star\( MockCrock \).second: Computation must return a type of MockCrock/
  t.throws(notValid(undefined), err, 'throws when computation returns undefined')
  t.throws(notValid(null), err, 'throws when computation returns null')
  t.throws(notValid(0), err, 'throws when computation returns falsey number')
  t.throws(notValid(1), err, 'throws when computation returns truthy number')
  t.throws(notValid(''), err, 'throws when computation returns falsey string')
  t.throws(notValid('string'), err, 'throws when computation returns truthy string')
  t.throws(notValid(false), err, 'throws when computation returns false')
  t.throws(notValid(true), err, 'throws when computation returns true')
  t.throws(notValid({}), err, 'throws an when computation returns object')

  t.doesNotThrow(notValid(MockCrock.of(2)), 'does not throw when computation returns a Functor')

  const result = m.second().runWith(Pair(10, 10)).valueOf()

  t.ok(isSameType(Pair, result), 'returns a Pair')
  t.equal(result.snd(), 11, 'applies the function to the snd element of a pair')
  t.equal(result.fst(), 10, 'does not apply the function to the first element of a pair')

  t.end()
})

test('Star both', t => {
  t.ok(isFunction(Star(unit).both), 'provides a both function')

  const m = Star(x => MockCrock(x + 1))

  const runWith = bindFunc(m.both().runWith)

  const noPair = /Star\( MockCrock \).both: Pair required for computation input/
  t.throws(runWith(undefined), noPair, 'throws with undefined as input')
  t.throws(runWith(null), noPair, 'throws with null as input')
  t.throws(runWith(0), noPair, 'throws with falsey number as input')
  t.throws(runWith(1), noPair, 'throws with truthy number as input')
  t.throws(runWith(''), noPair, 'throws with falsey string as input')
  t.throws(runWith('string'), noPair, 'throws with truthy string as input')
  t.throws(runWith(false), noPair, 'throws with false as input')
  t.throws(runWith(true), noPair, 'throws with true as input')
  t.throws(runWith([]), noPair, 'throws with an array as input')
  t.throws(runWith({}), noPair, 'throws with an object as input')

  t.doesNotThrow(runWith(Pair(1, 2)), 'does not throw when inner value is a Pair')

  const notValid = bindFunc(x => Star(() => x).both().runWith(Pair(2, 3)))

  const err = /Star\( MockCrock \).both: Computation must return a type of MockCrock/
  t.throws(notValid(undefined), err, 'throws when computation returns undefined')
  t.throws(notValid(null), err, 'throws when computation returns null')
  t.throws(notValid(0), err, 'throws when computation returns falsey number')
  t.throws(notValid(1), err, 'throws when computation returns truthy number')
  t.throws(notValid(''), err, 'throws when computation returns falsey string')
  t.throws(notValid('string'), err, 'throws when computation returns truthy string')
  t.throws(notValid(false), err, 'throws when computation returns false')
  t.throws(notValid(true), err, 'throws when computation returns true')
  t.throws(notValid({}), err, 'throws an when computation returns object')

  t.doesNotThrow(notValid(MockCrock.of(2)), 'does not throw when computation returns a Functor')

  const result = m.both().runWith(Pair(10, 10)).valueOf()

  t.ok(isSameType(Pair, result), 'returns a Pair')
  t.equal(result.fst(), 11, 'applies the function to the first element of a pair')
  t.equal(result.snd(), 11, 'applies the function to the snd element of a pair')

  t.end()
})
