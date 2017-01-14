const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isArray = require('../predicates/isArray')
const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const MockCrock = require('../test/MockCrock')

const sequence = require('./sequence')

test('sequence pointfree', t => {
  const seq = bindFunc(sequence)

  const m = { sequence: constant(23) }

  t.ok(isFunction(seq), 'is a function')

  t.throws(seq(undefined, m), 'throws if first arg is undefined')
  t.throws(seq(null, m), 'throws if first arg is null')
  t.throws(seq(0, m), 'throws if first arg is a falsey number')
  t.throws(seq(1, m), 'throws if first arg is a truthy number')
  t.throws(seq('', m), 'throws if first arg is a falsey string')
  t.throws(seq('string', m), 'throws if first arg is a truthy string')
  t.throws(seq(false, m), 'throws if first arg is false')
  t.throws(seq(true, m), 'throws if first arg is true')
  t.throws(seq([], m), 'throws if first arg is an array')
  t.throws(seq({}, m), 'throws if first arg is an object')

  t.throws(seq(noop, undefined), 'throws if second arg is undefined')
  t.throws(seq(noop, null), 'throws if second arg is null')
  t.throws(seq(noop, 0), 'throws if second arg is a falsey number')
  t.throws(seq(noop, 1), 'throws if second arg is a truthy number')
  t.throws(seq(noop, ''), 'throws if second arg is a falsey string')
  t.throws(seq(noop, 'string'), 'throws if second arg is a truthy string')
  t.throws(seq(noop, false), 'throws if second arg is false')
  t.throws(seq(noop, true), 'throws if second arg is true')
  t.throws(seq(noop, {}), 'throws if second arg is an object')

  t.doesNotThrow(seq(noop, m), 'allows a function and Traverable')
  t.doesNotThrow(seq(noop, []), 'allows a function and an Array')

  t.end()
})

test('sequence with Traversable', t => {
  const x = 'gnarly dude'
  const m = { sequence: sinon.spy(constant(x)) }

  const f = sinon.spy()
  const res = sequence(f, m)

  t.ok(m.sequence.calledWith(f), 'calls sequence on Traversable, passing the function')
  t.equal(res, x, 'returns the result of sequence on Traversable')

  t.end()
})

test('sequence with Array', t => {
  const outer = sequence(MockCrock.of, [ MockCrock(12), MockCrock(23) ])
  const inner = outer.value()

  t.equal(outer.type(), 'MockCrock', 'outer container is a MockCrock')
  t.ok(isArray(inner), 'inner container is an Array')
  t.equal((inner.length), 2, 'inner array maintains structure')

  t.end()
})
