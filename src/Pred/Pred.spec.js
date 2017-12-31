const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const compose = require('../core/compose')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const unit = require('../core/_unit')

const constant = x => () => x
const identity = x => x

const Pred = require('.')

test('Pred', t => {
  const p = bindFunc(Pred)

  t.ok(isFunction(Pred), 'is a function')

  t.ok(isFunction(Pred.type), 'provides a type function')
  t.ok(isFunction(Pred.empty), 'provides an empty function')

  t.ok(isObject(Pred(unit)), 'returns an object')

  t.equals(Pred(unit).constructor, Pred, 'provides TypeRep on constructor')

  const err = /Pred: Predicate function required/
  t.throws(Pred, err, 'throws with nothing')
  t.throws(p(undefined), err, 'throws with undefined')
  t.throws(p(null), err, 'throws with undefined')
  t.throws(p(0), err, 'throws with falsey number')
  t.throws(p(1), err, 'throws with truthy number')
  t.throws(p(''), err, 'throws with falsey string')
  t.throws(p('string'), err, 'throws with truthy string')
  t.throws(p(false), err, 'throws with false')
  t.throws(p(true), err, 'throws with true')
  t.throws(p({}), err, 'throws with an object')
  t.throws(p([]), err, 'throws with an array')

  t.doesNotThrow(p(unit), 'allows a function')

  t.end()
})

test('Pred @@implements', t => {
  const f = Pred['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('contramap'), true, 'implements contramap func')
  t.equal(f('empty'), true, 'implements empty func')

  t.end()
})

test('Pred inspect', t => {
  const m = Pred(unit)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect(), 'Pred Function', 'returns inspect string')

  t.end()
})

test('Pred type', t => {
  t.equal(Pred(unit).type(), 'Pred', 'type returns Pred')
  t.equal(Pred(unit).type(), Pred.type(), 'constructor and instance return same value')

  t.end()
})

test('Pred valueOf', t => {
  const f = constant('')
  const p = Pred(f)

  t.ok(isFunction(p.valueOf), 'is a function')
  t.equals(p.valueOf()(), !!f(), 'returns a coerced to Boolean version of the function')

  t.end()
})

test('Pred runWith', t => {
  const fn = sinon.spy(constant('result'))
  const m = Pred(fn)

  const nonBoolPred =
    x => Pred(constant(x)).runWith()

  t.equals(nonBoolPred(undefined), false, 'returns false when wrapped function returns undefined')
  t.equals(nonBoolPred(null), false, 'returns false when wrapped function returns null')
  t.equals(nonBoolPred(0), false, 'returns false when wrapped function returns falsey number')
  t.equals(nonBoolPred(1), true, 'returns true when wrapped function returns truthy number')
  t.equals(nonBoolPred(''), false, 'returns false when wrapped function returns falsey string')
  t.equals(nonBoolPred('string'), true, 'returns true when wrapped function returns truthy string')
  t.equals(nonBoolPred(false), false, 'returns false when wrapped function returns false')
  t.equals(nonBoolPred(true), true, 'returns true when wrapped function returns true')
  t.equals(nonBoolPred({}), true, 'returns true when wrapped function returns an object')
  t.equals(nonBoolPred([]), true, 'returns true when wrapped function returns an array')
  t.equals(nonBoolPred(unit), true, 'returns true when wrapped function returns a function')

  const result = m.runWith(false)

  t.ok(fn.called, 'calls the wrapped function')
  t.equal(result, !!fn(),'returns Boolean equiv result of the wrapped function' )

  t.end()
})

test('Pred contramap errors', t => {
  const cmap = bindFunc(Pred(unit).contramap)

  const err = /Pred.contramap: Function required/
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

test('Pred contramap functionality', t => {
  const spy = sinon.spy(identity)
  const x = 23

  const m = Pred(identity).contramap(spy)

  t.equal(m.type(), 'Pred', 'returns a Pred')
  t.notOk(spy.called, 'does not call mapping function initially')

  m.runWith(x)

  t.ok(spy.called, 'calls mapping function when ran')
  t.equal(m.runWith(x), !!x, 'returns the Boolean equiv result of the resulting composition')

  t.end()
})

test('Pred contramap properties (Contra Functor)', t => {
  const m = Pred(identity)

  const f = x => x + 17
  const g = x => x * 3

  const x = 32

  t.ok(isFunction(m.contramap), 'provides a contramap function')

  t.equal(m.contramap(identity).runWith(x), m.runWith(x), 'identity')
  t.equal(m.contramap(compose(f, g)).runWith(x), m.contramap(f).contramap(g).runWith(x), 'composition')

  t.end()
})

test('Pred concat functionality', t => {
  const a = Pred(constant(true))
  const b = Pred(constant(false))

  const notPred = { type: constant('Pred...Not') }

  const cat = bindFunc(a.concat)

  const err = /Pred.concat: Pred required/
  t.throws(cat(undefined), err, 'throws with undefined')
  t.throws(cat(null), err, 'throws with null')
  t.throws(cat(0), err, 'throws with falsey number')
  t.throws(cat(1), err, 'throws with truthy number')
  t.throws(cat(''), err, 'throws with falsey string')
  t.throws(cat('string'), err, 'throws with truthy string')
  t.throws(cat(false), err, 'throws with false')
  t.throws(cat(true), err, 'throws with true')
  t.throws(cat([]), err, 'throws with an array')
  t.throws(cat({}), err, 'throws with an object')
  t.throws(cat(notPred), err, 'throws when passed non-Pred')

  t.equal(a.concat(a).runWith(), true, 'true to true reports true')
  t.equal(a.concat(b).runWith(), false, 'true to false reports false')
  t.equal(b.concat(b).runWith(), false, 'false to false reports false')

  t.end()
})

test('Pred concat properties (Semigroup)', t => {
  const a = Pred(constant(false))
  const b = Pred(constant(true))
  const c = Pred(constant(false))

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(left.runWith(), right.runWith(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns a Pred')

  t.end()
})

test('Pred empty functionality', t => {
  const p = Pred(identity).empty()

  t.equal(p.type(), 'Pred', 'provides a Pred')
  t.equal(p.runWith(), true, 'provides a true value')

  t.end()
})

test('Pred empty properties (Monoid)', t => {
  const m = Pred(constant(true))

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.equal(right.runWith(), m.runWith(), 'right identity')
  t.equal(left.runWith(), m.runWith(), 'left identity')

  t.end()
})
