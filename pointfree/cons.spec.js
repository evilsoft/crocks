const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction  = require('../internal/isFunction')

const identity = require('../combinators/identity')

const cons = require('./cons')

test('cons pointfree', t => {
  const f = bindFunc(cons)

  t.ok(isFunction(cons), 'is a function')

  t.throws(f(0, undefined), TypeError, 'throws when second arg is undefined')
  t.throws(f(0, null), TypeError, 'throws when second arg is null')
  t.throws(f(0, 0), TypeError, 'throws when second arg is falsey number')
  t.throws(f(0, 1), TypeError, 'throws when second arg is truthy number')
  t.throws(f(0, ''), TypeError, 'throws when second arg is falsey string')
  t.throws(f(0, 'string'), TypeError, 'throws when second arg is truthy string')
  t.throws(f(0, false), TypeError, 'throws when second arg is false')
  t.throws(f(0, true), TypeError, 'throws when second arg is true')
  t.throws(f(0, {}), TypeError, 'throws when second arg is true')
  t.throws(f(0, noop), TypeError, 'throws when second arg is function')

  t.end()
})

test('cons pointfree arrays', t => {
  t.same(cons( 2, [ 1 ]), [ 2, 1 ], 'cons number on array')
  t.same(cons( '2', [ 1 ]), [ '2', 1 ], 'cons string on array')
  t.same(cons( false, [ 1 ]), [ false, 1 ], 'cons bool on array')
  t.same(cons( {}, [ 1 ]), [ {}, 1 ], 'cons object on array')
  t.same(cons([ 2, 3 ], [ 1 ]), [ [ 2, 3 ], 1 ], 'cons arrays second onto first ')

  t.end()
})

test('cons pointfree List', t => {
  const m = { cons: sinon.spy(identity) }

  const result = cons(3, m)

  t.ok(m.cons.calledWith(3), 'calls cons on list passing first arg')
  t.equal(m.cons.returnValues[0], result, 'returns the result of the List cons')

  t.end()
})
