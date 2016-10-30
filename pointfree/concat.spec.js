const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction  = require('../internal/isFunction')

const identity = require('../combinators/identity')

const concat = require('./concat')

test('concat pointfree', t => {
  const f = bindFunc(concat)

  t.ok(isFunction(concat), 'is a function')

  t.throws(f(0, undefined), TypeError, 'throws if second arg is undefined')
  t.throws(f(0, null), TypeError, 'throws if second arg is null')
  t.throws(f(0, 0), TypeError, 'throws if second arg is falsey number')
  t.throws(f(0, 1), TypeError, 'throws if second arg is truthy number')
  t.throws(f(0, false), TypeError, 'throws if second arg is false')
  t.throws(f(0, true), TypeError, 'throws if second arg is true')
  t.throws(f(0, {}), TypeError, 'throws if second arg is true')
  t.throws(f(0, noop), TypeError, 'throws if second arg is function')

  t.end()
})

test('concat pointfree strings', t => {
  const a = 'one'
  const b = 'two'
  const ab = a + b

  t.equal(concat(b, a), ab, 'concats the first string to the second')

  t.end()
})

test('concat pointfree arrays', t => {
  t.same(concat( 2, [ 1 ]), [ 1, 2 ], 'concats number on array')
  t.same(concat( '2', [ 1 ]), [ 1, '2' ], 'concats string on array')
  t.same(concat( false, [ 1 ]), [ 1, false ], 'concats bool on array')
  t.same(concat( {}, [ 1 ]), [ 1, {} ], 'concats object on array')
  t.same(concat([ 2, 3 ], [ 1 ]), [ 1, 2, 3 ], 'concats two arrays first onto second')

  t.end()
})

test('concat pointfree semigroup', t => {
  const m = { concat: sinon.spy(identity) }

  const result = concat(3, m)

  t.ok(m.concat.calledWith(3), 'calls concat on semi-group passing first arg')
  t.equal(m.concat.returnValues[0], result, 'returns the result of the semi-group concat')

  t.end()
})
