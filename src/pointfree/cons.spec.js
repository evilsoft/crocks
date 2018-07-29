import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'

import isFunction  from '../core/isFunction'
import unit from '../core/_unit'

const identity = x => x

import cons from './cons'

test('cons pointfree', t => {
  const f = bindFunc(cons)

  t.ok(isFunction(cons), 'is a function')

  const err = /cons: List or Array required for second argument/
  t.throws(f(0, undefined), err, 'throws when second arg is undefined')
  t.throws(f(0, null), err, 'throws when second arg is null')
  t.throws(f(0, 0), err, 'throws when second arg is falsey number')
  t.throws(f(0, 1), err, 'throws when second arg is truthy number')
  t.throws(f(0, ''), err, 'throws when second arg is falsey string')
  t.throws(f(0, 'string'), err, 'throws when second arg is truthy string')
  t.throws(f(0, false), err, 'throws when second arg is false')
  t.throws(f(0, true), err, 'throws when second arg is true')
  t.throws(f(0, {}), err, 'throws when second arg is true')
  t.throws(f(0, unit), err, 'throws when second arg is function')

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
