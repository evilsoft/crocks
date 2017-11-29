const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')
const MockCrock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

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

  t.throws(seq(unit, undefined), 'throws if second arg is undefined')
  t.throws(seq(unit, null), 'throws if second arg is null')
  t.throws(seq(unit, 0), 'throws if second arg is a falsey number')
  t.throws(seq(unit, 1), 'throws if second arg is a truthy number')
  t.throws(seq(unit, ''), 'throws if second arg is a falsey string')
  t.throws(seq(unit, 'string'), 'throws if second arg is a truthy string')
  t.throws(seq(unit, false), 'throws if second arg is false')
  t.throws(seq(unit, true), 'throws if second arg is true')
  t.throws(seq(unit, {}), 'throws if second arg is an object')

  t.throws(seq(unit, [ undefined ]), 'throws if second arg wraps an undefined')
  t.throws(seq(unit, [ null ]), 'throws if second arg wraps a null')
  t.throws(seq(unit, [ 0 ]), 'throws if second arg wraps a falsey number')
  t.throws(seq(unit, [ 1 ]), 'throws if second arg wraps a truthy number')
  t.throws(seq(unit, [ '' ]), 'throws if second arg wraps a falsey string')
  t.throws(seq(unit, [ 'string' ]), 'throws if second arg wraps a truthy string')
  t.throws(seq(unit, [ false ]), 'throws if second arg wraps false')
  t.throws(seq(unit, [ true ]), 'throws if second arg wraps true')
  t.throws(seq(unit, [ {} ]), 'throws if second arg wraps an object')

  t.doesNotThrow(seq(unit, m), 'allows a function and Traverable')
  t.doesNotThrow(seq(unit, []), 'allows a function and an Array')

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
  const inner = outer.valueOf()

  t.equal(outer.type(), 'MockCrock', 'outer container is a MockCrock')
  t.ok(isArray(inner), 'inner container is an Array')
  t.equal((inner.length), 2, 'inner array maintains structure')

  t.end()
})
