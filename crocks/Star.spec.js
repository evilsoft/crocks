const test = require('tape')
const helpers = require('../test/helpers')
const sinon = require('sinon')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')
const isObject = require('../predicates/isObject')

const composeB = require('../combinators/composeB')
const identity = require('../combinators/identity')

const MockCrock = require('../test/MockCrock')

const Star = require('./Star')

test('Star', t => {
  const a = bindFunc(Star)

  t.ok(isFunction(Star), 'is a function')

  t.ok(isFunction(Star.type), 'provides a type function')

  t.ok(isObject(Star(noop)), 'returns an object')

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

  t.doesNotThrow(a(noop), 'allows a function')

  t.end()
})

test('Star inspect', t => {
  const a = Star(noop)

  t.ok(isFunction(a.inspect), 'provides an inspect function')
  t.equal(a.inspect(), 'Star Function', 'returns inspect string')

  t.end()
})

test('Star type', t => {
  const a = Star(noop)
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

test('Star map errors', t => {
  const map = bindFunc(Star(noop).map)

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
  const cmap = bindFunc(Star(noop).contramap)

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

  t.doesNotThrow(cmap(noop), 'allows functions')

  t.end()
})

test('Star contramap functionality', t => {
  const spy = sinon.spy(identity)
  const x = 7

  const m = Star(MockCrock).contramap(spy)

  t.equal(m.type(), 'Star', 'returns a Star')
  t.notOk(spy.called, 'does not call mapping function initially')

  const result = m.runWith(x)

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

  t.throws(promap(undefined, noop), TypeError, 'throws with undefined as first argument')
  t.throws(promap(null, noop), TypeError, 'throws with null as first argument')
  t.throws(promap(0, noop), TypeError, 'throws with falsey number as first argument')
  t.throws(promap(1, noop), TypeError, 'throws with truthy number as first argument')
  t.throws(promap('', noop), TypeError, 'throws with falsey string as first argument')
  t.throws(promap('string', noop), TypeError, 'throws with truthy string as first argument')
  t.throws(promap(false, noop), TypeError, 'throws with false as first argument')
  t.throws(promap(true, noop), TypeError, 'throws with true as first argument')
  t.throws(promap([], noop), TypeError, 'throws with an array as first argument')
  t.throws(promap({}, noop), TypeError, 'throws with an object as first argument')

  t.throws(promap(noop, undefined), TypeError, 'throws with undefined as second argument')
  t.throws(promap(noop, null), TypeError, 'throws with null as second argument')
  t.throws(promap(noop, 0), TypeError, 'throws with falsey number as second argument')
  t.throws(promap(noop, 1), TypeError, 'throws with truthy number as second argument')
  t.throws(promap(noop, ''), TypeError, 'throws with falsey string as second argument')
  t.throws(promap(noop, 'string'), TypeError, 'throws with truthy string as second argument')
  t.throws(promap(noop, false), TypeError, 'throws with false as second argument')
  t.throws(promap(noop, true), TypeError, 'throws with true as second argument')
  t.throws(promap(noop, []), TypeError, 'throws with an array as second argument')
  t.throws(promap(noop, {}), TypeError, 'throws with an object as second argument')

  t.doesNotThrow(promap(noop, noop), 'allows functions')

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

  const result = m.runWith(x)

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
