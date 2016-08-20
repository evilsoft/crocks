const test    = require('tape')
const helpers = require('../test/helpers')

const isObject    = require('../internal/isObject')
const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const identity  = require('../combinators/identity')
const constant  = require('../combinators/constant')

const Compose = require('./Compose')


test('Compose', t => {
  const c = bindFunc(Compose)

  t.ok(isFunction(Compose), 'is a function')

  t.ok(isFunction(Compose.empty), 'provides an empty function')
  t.ok(isFunction(Compose.type), 'provides an type function')

  t.ok(isObject(Compose(noop)), 'returns an object')

  t.throws(Compose, TypeError, 'throws with nothing')
  t.throws(c(0), TypeError, 'throws with falsey number')
  t.throws(c(1), TypeError, 'throws with truthy number')
  t.throws(c(''), TypeError, 'throws with falsey string')
  t.throws(c('string'), TypeError, 'throws with truthy string')
  t.throws(c(false), TypeError, 'throws with false')
  t.throws(c(true), TypeError, 'throws with true')
  t.throws(c({}), 'throws with an object')
  t.throws(c([]), TypeError, 'throws with an array')

  t.doesNotThrow(c(undefined), 'allows undefined')
  t.doesNotThrow(c(null), 'allows null')
  t.doesNotThrow(c(noop), 'allows a function')

  t.end()
})

test('Compose inspect', t => {
  const m = Compose(noop)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Compose Function', 'returns inspect string')

  t.end()
})

test('Compose value', t => {
  const empty = Compose.empty().value()
  const x     = x => x + 1

  t.ok(isFunction(Compose(x).value), 'is a function')

  t.equal(Compose(undefined).value()(3), empty(3), 'provides an empty value for undefined')
  t.equal(Compose(null).value()(32), empty(32), 'provides an empty value for null ')

  t.equal(Compose(x).value()(13), x(13), 'provides the wrapped function')
  t.equal(Compose(x).value()(15), x(15), 'provides the wrapped function')

  t.end()
})

test('Compose type', t => {
  t.ok(isFunction(Compose(noop).type), 'is a function')

  t.equal(Compose(noop).type, Compose.type, 'static and instance versions are the same')
  t.equal(Compose(noop).type(), 'Compose', 'reports Compose')

  t.end()
})

test('Compose concat properties (Semigroup)', t => {
  const a = Compose(x => x + 32)
  const b = Compose(x => x - 12)
  const c = Compose(x => x * 2)

  const x = 56

  const left  = a.concat(b).concat(c).value()
  const right = a.concat(b.concat(c)).value()

  t.ok(isFunction(Compose(noop).concat), 'is a function')

  t.same(left(x), right(x), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns Semigroup of the same type')

  t.end()
})

test('Compose concat functionality', t => {
  const x = x => x + ' green'
  const y = x => 'blue ' + x

  const result = 'blue house green'

  const a = Compose(x)
  const b = Compose(y)

  const notCompose = { type: constant('Compose...Not') }

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
  t.throws(cat(notCompose), TypeError, 'throws with non-Compose')

  t.same(a.concat(b).value()('house'), result, 'builds composition as expected')

  t.end()
})

test('Compose empty properties (Monoid)', t => {
  const m = Compose(identity)
  const x = 'gone wrong'

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides a empty function')

  const right = m.concat(m.empty()).value()
  const left  = m.empty().concat(m).value()

  t.same(right(x), m.value()(x), 'right identity')
  t.same(left(x), m.value()(x), 'left identity')

  t.equal(m.empty().type(), m.type(), 'returns a Monoid of the same type')

  t.end()
})

test('Compose empty functionality', t => {
  const x = Compose(noop).empty()

  t.equal(Compose(noop).empty, Compose.empty, 'static and instance versions are the same')

  t.equal(x.type(), 'Compose', 'provides a Compose')
  t.same(x.value()(13), 13, 'wraps an identity function')

  t.end()
})
