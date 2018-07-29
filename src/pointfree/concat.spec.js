import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'

const constant = x => () => x
const identity = x => x

import isFunction  from '../core/isFunction'
import unit from '../core/_unit'
import fl from '../core/flNames'

const mock = x => Object.assign({}, {
  concat: sinon.spy(),
  type: constant('Semigroup')
}, x)

import concat from './concat'

test('concat pointfree', t => {
  const f = bindFunc(concat)

  t.ok(isFunction(concat), 'is a function')

  const err = /concat: Semigroups of the same type required for both arguments/
  t.throws(f('', undefined), err, 'throws if second arg is undefined')
  t.throws(f('', null), err, 'throws if second arg is null')
  t.throws(f('', 0), err, 'throws if second arg is falsey number')
  t.throws(f('', 1), err, 'throws if second arg is truthy number')
  t.throws(f('', false), err, 'throws if second arg is false')
  t.throws(f('', true), err, 'throws if second arg is true')
  t.throws(f('', {}), err, 'throws if second arg is true')
  t.throws(f('', unit), err, 'throws if second arg is function')

  t.throws(f([], ''), err, 'throws when semigroups differ')

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
  t.same(concat( [ 2 ], [ 1 ]), [ 1, 2 ], 'concats number on array')
  t.same(concat( [ '2' ], [ 1 ]), [ 1, '2' ], 'concats string on array')
  t.same(concat( [ false ], [ 1 ]), [ 1, false ], 'concats bool on array')
  t.same(concat( [ {} ], [ 1 ]), [ 1, {} ], 'concats object on array')
  t.same(concat([ 2, 3 ], [ 1 ]), [ 1, 2, 3 ], 'concats two arrays first onto second')

  t.end()
})

test('concat with Semigroup', t => {
  const x = 'result'
  const s = mock({ concat: sinon.spy(constant(x)) })
  const p = mock({ concat: identity })

  const result = concat(p, s)

  t.ok(s.concat.calledWith(p), 'calls concat on Semigroup, passing the first argument')
  t.ok(s.concat.calledOn(s), 'binds concat to second argument')
  t.equal(result, x, 'returns the result of concat on second argument')

  t.end()
})

test('concat with Semigroup (fantasy-land)', t => {
  const x = 'result'
  const s = mock({ [fl.concat]: sinon.spy(constant(x)) })
  const p = mock({ [fl.concat]: identity })

  const result = concat(p, s)

  t.ok(s[fl.concat].calledWith(p), 'calls fantasy-land/concat on Semigroup, passing the first argument')
  t.ok(s[fl.concat].calledOn(s), 'binds fantasy-land/concat to second argument')
  t.equal(result, x, 'returns the result of fantasy-land/concat on second argument')
  t.notOk(s.concat.called, 'does not call concat on second argument')

  t.end()
})
