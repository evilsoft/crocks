const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isObject = require('../internal/isObject')
const isFunction = require('../internal/isFunction')

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')

const Pair = require('./Pair')
const State = require('./State')

test('State', t => {
  const m = State(noop)
  const s = bindFunc(State)

  t.ok(isFunction(State), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(State.of), 'provides an of function')
  t.ok(isFunction(State.type), 'provides a type function')

  t.throws(s(), TypeError, 'throws with no parameters')

  t.throws(s(undefined), TypeError, 'throws with undefined')
  t.throws(s(null), TypeError, 'throws with null')
  t.throws(s(0), TypeError, 'throws with falsey number')
  t.throws(s(1), TypeError, 'throws with truthy number')
  t.throws(s(''), TypeError, 'throws with falsey string')
  t.throws(s('string'), TypeError, 'throws with truthy string')
  t.throws(s(false), TypeError, 'throws with false')
  t.throws(s(true), TypeError, 'throws with true')
  t.throws(s([]), TypeError, 'throws with array')
  t.throws(s({}), TypeError, 'throws with object')

  t.doesNotThrow(s(noop), 'allows a function')

  t.end()
})

test('State inspect', t => {
  const m = State(noop)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'State Function', 'returns inspect string')

  t.end()
})

test('State type', t => {
  t.equal(State(noop).type(), 'State', 'type returns State')
  t.end()
})

test('State map errors', t => {
  const map = bindFunc(State(noop).map)

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

  t.doesNotThrow(map(noop), 'allows a function')

  const m = bindFunc(State(identity).map(x => x + 1).runWith)
  const n = bindFunc(State(x => Pair(x, x)).map(x => x + 1).runWith)

  t.throws(m(3), 'throws when wrapped function is not (s -> (a, s))')
  t.doesNotThrow(n(3), 'throws when wrapped function is not (s -> (a, s))')

  t.end()
})

test('State map functionality', t => {
  const fn = sinon.spy(x => x + 10)
  const m = State(s => Pair(s, s)).map(fn)

  t.equals(m.type(), 'State', 'returns a State')
  t.notOk(fn.called, 'does not call mapping function initially')

  const result = m.runWith(5)

  t.ok(fn.called, 'calls mapping function when ran')
  t.equal(result.snd(), 5, 'provides state unchanged')
  t.ok(fn.returned(result.fst()), 'applied map to value')

  t.end()
})

test('State map properties (Functor)', t => {
  t.end()
})
