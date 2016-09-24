const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const constant = require('../combinators/constant')

const sequence = require('./sequence')

test('sequence pointfree', t => {
  const seq = bindFunc(sequence)

  const x = 'super cool'
  const m = { sequence: sinon.spy(constant(x)) }

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

  const f = sinon.spy()
  const res = sequence(f, m)

  t.ok(m.sequence.calledWith(f), 'calls sequence on Traversable, passing the function')
  t.equal(res, x, 'returns the result of sequence on Traversable')

  t.end()
})
