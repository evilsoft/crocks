const test = require('tape')
const helpers = require('../test/helpers')
const sinon = require('sinon')

const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')
const isObject = require('../internal/isObject')
const noop = helpers.noop

const identity = require('../combinators/identity')
const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')

const Arrow = require('./Arrow')

test('Arrow', t => {
  const a = bindFunc(Arrow)

  t.ok(isFunction(Arrow), 'is a function')

  t.ok(isFunction(Arrow.empty), 'provides an empty function')
  t.ok(isFunction(Arrow.type), 'provides a type function')

  t.ok(isFunction(Arrow.value), 'provides a value function')
  t.ok(isFunction(Arrow.concat), 'provides a concat function')
  t.ok(isFunction(Arrow.runWith), 'provides a runWith function')

  t.ok(isObject(Arrow(noop)), 'returns an object')

  t.throws(Arrow, TypeError, 'throws with nothing')
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

test('Arrow inspect', t => {
  const a = Arrow(noop)

  t.ok(isFunction(a.inspect), 'provides an inspect function')
  t.equal(a.inspect(), 'Arrow Function', 'returns inspect string')

  t.end()
})

test('Arrow type', t => {
  const a = Arrow(noop)
  t.ok(isFunction(a.type), 'is a function')

  t.equal(a.type, Arrow.type, 'static and instance versions are the same')
  t.equal(a.type(), 'Arrow', 'reports Arrow')

  t.end()
})

test('Arrow value', t => {
  const f = constant('dat function')
  const a = Arrow(f)

  t.ok(isFunction(a.value), 'is a function')
  t.equal(a.value()(), f(), 'provides the wrapped function')

  t.end()
})

test('Arrow runWith', t => {
  const f = sinon.spy(identity)
  const a = Arrow(f)

  t.ok(isFunction(a.runWith), 'is a function')

  const result = a.runWith('apple')

  t.ok(f.calledWith('apple'), 'calls the wrapped function passing provided argument')
  t.ok(f.returned(result), 'returns the result of the wrapped function')

  t.end()
})

test('Arrow concat properties (Semigroup)', t => {
  const a = Arrow(x => x + 1)
  const b = Arrow(x => x * 10)
  const c = Arrow(x => x - 5)

  t.ok(isFunction(Arrow(identity).concat), 'is a function')

  const left = a.concat(b).concat(c).runWith
  const right = a.concat(b.concat(c)).runWith
  const x = 20

  t.same(left(x), right(x), 'associativity')
  t.same(a.concat(b).type(), a.type(), 'returns Semigroup of same type')

  t.end()
})

test('Arrow concat functionality', t => {
  const f = x => x + 1
  const g = x => x * 0

  const x = 13
  const result = composeB(g, f)(x)

  const a = Arrow(f)
  const b = Arrow(g)

  const notArrow = { type: constant('Arrow...Not') }

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
  t.throws(cat(notArrow), TypeError, 'throws with non-Arrow')

  t.same(a.concat(b).runWith(x), result, 'builds composition as expected')

  t.end()
})

test('Arrow empty properties (Monoid)', t => {
  t.end()
})
