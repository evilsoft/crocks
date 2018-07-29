import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'
import fl from '../core/flNames'
import unit from '../core/_unit'

const constant = x => () => x

const mock = x => Object.assign({}, {
  reduce: constant('Chain')
}, x)

import reduce from './reduce'

test('reduce pointfree', t => {
  const r = bindFunc(reduce)

  t.ok(isFunction(reduce), 'is a function')

  const err = /reduce: Function required for first argument/
  t.throws(r(undefined, 0, []), err, 'throws if first arg is undefined')
  t.throws(r(null, 0, []), err, 'throws if first arg is null')
  t.throws(r(0, 0, []), err, 'throws if first arg is a falsey number')
  t.throws(r(1, 0, []), err, 'throws if first arg is a truthy number')
  t.throws(r('', 0, []), err, 'throws if first arg is a falsey string')
  t.throws(r('string', 0, []), err, 'throws if first arg is a truthy string')
  t.throws(r(false, 0, []), err, 'throws if first arg is false')
  t.throws(r(true, 0, []), err, 'throws if first arg is true')
  t.throws(r([], 0, []), err, 'throws if first arg is an array')
  t.throws(r({}, 0, []), err, 'throws if first arg is an object')

  const second = /reduce: Foldable required for third argument/
  t.throws(r(unit, 0, undefined), second, 'throws if second arg is undefined')
  t.throws(r(unit, 0, null), second, 'throws if second arg is null')
  t.throws(r(unit, 0, 0), second, 'throws if second arg is a falsey number')
  t.throws(r(unit, 0, 1), second, 'throws if second arg is a truthy number')
  t.throws(r(unit, 0, ''), second, 'throws if second arg is a falsey string')
  t.throws(r(unit, 0, 'string'), second, 'throws if second arg is a truthy string')
  t.throws(r(unit, 0, false), second, 'throws if second arg is false')
  t.throws(r(unit, 0, true), second, 'throws if second arg is true')
  t.throws(r(unit, 0, {}), second, 'throws if second arg is an object')

  t.end()
})

test('reduce with Array', t => {
  const f = sinon.spy()
  const x = 'result'
  const base = [ null ]

  const target = (base.reduce = sinon.spy(constant(x)), base)
  const result = reduce(f, 0, target)

  t.ok(target.reduce.calledWith(f, 0), 'calls reduce on array, passing function and init')
  t.ok(target.reduce.calledOn(target), 'binds reduce to third argument')
  t.equal(result, x, 'returns the result of reduce')
  t.end()
})

test('reduce with Foldable', t => {
  const f = sinon.spy()
  const x = 'result'

  const m = mock({
    reduce: sinon.spy(constant(x))
  })

  const result = reduce(f, 0, m)

  t.ok(m.reduce.calledWith(f, 0), 'calls reduce on Foldable, passing function and init')
  t.ok(m.reduce.calledOn(m), 'binds reduce to third argument')
  t.equal(result, x, 'returns the result of reduce')

  t.end()
})

test('reduce with Foldable (fantasy-land)', t => {
  const f = sinon.spy()
  const x = 'result'

  const m = mock({
    [fl.reduce]: sinon.spy(constant(x))
  })

  const result = reduce(f, 0, m)

  t.ok(m[fl.reduce].calledWith(f, 0), 'calls fantasy-land/reduce on Foldable, passing function and init')
  t.ok(m[fl.reduce].calledOn(m), 'binds fantasy-land/reduce to third argument')
  t.equal(result, x, 'returns the result of fantasy-land/reduce')
  t.notOk(m.reduce.called, 'does not call reduce on third argument')

  t.end()
})
