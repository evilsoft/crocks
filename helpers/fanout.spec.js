const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Arrow = require('../crocks/Arrow')
const MockCrock = require('../test/MockCrock')
const Pair = require('../crocks/Pair')
const Star = require('../crocks/Star')

const identity = require('../combinators/identity')

const fanout = require('./fanout')

test('fanout function', t => {
  t.ok(isFunction(fanout), 'is a function')

  const f = bindFunc(fanout)

  t.throws(f(undefined, noop), TypeError, 'throws when first arg is undefined')
  t.throws(f(null, noop), TypeError, 'throws when first arg is null')
  t.throws(f(0, noop), TypeError, 'throws when first arg is falsey number')
  t.throws(f(1, noop), TypeError, 'throws when first arg is truthy number')
  t.throws(f('', noop), TypeError, 'throws when first arg is falsey string')
  t.throws(f('string', noop), TypeError, 'throws when first arg is truthy string')
  t.throws(f(false, noop), TypeError, 'throws when first arg is false')
  t.throws(f(true, noop), TypeError, 'throws when first arg is true')
  t.throws(f({}, noop), TypeError, 'throws when first arg is an object')
  t.throws(f([], noop), TypeError, 'throws when first arg is an array')

  t.throws(f(noop, undefined), TypeError, 'throws when second arg is undefined')
  t.throws(f(noop, null), TypeError, 'throws when second arg is null')
  t.throws(f(noop, 0), TypeError, 'throws when second arg is falsey number')
  t.throws(f(noop, 1), TypeError, 'throws when second arg is truthy number')
  t.throws(f(noop, ''), TypeError, 'throws when second arg is falsey string')
  t.throws(f(noop, 'string'), TypeError, 'throws when second arg is truthy string')
  t.throws(f(noop, false), TypeError, 'throws when second arg is false')
  t.throws(f(noop, true), TypeError, 'throws when second arg is true')
  t.throws(f(noop, {}), TypeError, 'throws when second arg is an object')
  t.throws(f(noop, []), TypeError, 'throws when second arg is an array')

  const s = Star(MockCrock.of)
  const a = Arrow(identity)

  t.throws(f(noop, s), TypeError, 'throws when Function and Star passed')
  t.throws(f(a, noop), TypeError, 'throws when Arrow and Function passed')
  t.throws(f(s, a), TypeError, 'throws when Arrow and Star passed')

  t.end()
})

test('fanout with functions', t => {
  const f = x => x + 10
  const g = x => x * 10
  const x = 30

  const fanned = fanout(f, g)
  const result = fanned(x)

  t.ok(isFunction(fanned), 'returns a function')

  t.ok(isSameType(Pair, result), 'fanned function returns a Pair')
  t.equal(result.fst(), f(x), 'applys first function to fst of Pair')
  t.equal(result.snd(), g(x), 'applys second function to snd of Pair')

  t.end()
})

test('fanout with Arrows', t => {
  const f = x => x + 10
  const g = x => x * 10
  const x = 30

  const fanned = fanout(Arrow(f), Arrow(g))

  t.ok(isSameType(Arrow, fanned), 'returns an Arrow')

  const result = fanned.runWith(x)

  t.ok(isSameType(Pair, result), 'fanned function returns a Pair')
  t.equal(result.fst(), f(x), 'applys first function to fst of Pair')
  t.equal(result.snd(), g(x), 'applys second function to snd of Pair')

  t.end()
})

test('fanout with Stars', t => {
  const f = x => MockCrock(x + 10)
  const g = x => MockCrock(x * 10)
  const x = 30

  const fanned = fanout(Star(f), Star(g))

  t.ok(isSameType(Star, fanned), 'returns a Star')

  const result = fanned.runWith(x).value()

  t.ok(isSameType(Pair, result), 'fanned function returns a Pair')
  t.equal(result.fst(), f(x).value(), 'applys first function to fst of Pair')
  t.equal(result.snd(), g(x).value(), 'applys second function to snd of Pair')

  t.end()
})
