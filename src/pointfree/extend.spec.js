import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'
import fl from '../core/flNames'
import unit from '../core/_unit'

const constant = x => () => x

const mock = x => Object.assign({}, {
  extend: sinon.spy(),
  map: unit
}, x)

import extend from './extend'

test('extend pointfree', t => {
  const a = bindFunc(extend)
  const m = mock({ extend: unit })

  t.ok(isFunction(extend), 'is a function')

  const noFunc = /extend: Function required for first argument/
  t.throws(a(undefined, m), noFunc, 'throws if first arg is undefined')
  t.throws(a(null, m), noFunc, 'throws if first arg is null')
  t.throws(a(0, m), noFunc, 'throws if first arg is a falsey number')
  t.throws(a(1, m), noFunc, 'throws if first arg is a truthy number')
  t.throws(a('', m), noFunc, 'throws if first arg is a falsey string')
  t.throws(a('string', m), noFunc, 'throws if first arg is a truthy string')
  t.throws(a(false, m), noFunc, 'throws if first arg is false')
  t.throws(a(true, m), noFunc, 'throws if first arg is true')
  t.throws(a([], m), noFunc, 'throws if first arg is an array')
  t.throws(a({}, m), noFunc, 'throws if first arg is an object')

  const noExtend = /extend: Extend required for second argument/
  t.throws(a(unit, undefined), noExtend, 'throws if second arg is undefined')
  t.throws(a(unit, null), noExtend, 'throws if second arg is null')
  t.throws(a(unit, 0), noExtend, 'throws if second arg is a falsey number')
  t.throws(a(unit, 1), noExtend, 'throws if second arg is a truthy number')
  t.throws(a(unit, ''), noExtend, 'throws if second arg is a falsey string')
  t.throws(a(unit, 'string'), noExtend, 'throws if second arg is a truthy string')
  t.throws(a(unit, false), noExtend, 'throws if second arg is false')
  t.throws(a(unit, true), noExtend, 'throws if second arg is true')
  t.throws(a(unit, []), noExtend, 'throws if second arg is an array')
  t.throws(a(unit, {}), noExtend, 'throws if second arg is an object')

  t.end()
})

test('extend with Extend', t => {
  const x = 'result'

  const m = mock({
    extend: sinon.spy(constant(x))
  })

  const result = extend(unit, m)

  t.ok(m.extend.calledWith(unit), 'calls extend on the second passing the first')
  t.ok(m.extend.calledOn(m), 'binds extend to second argument')
  t.equal(result, x, 'returns the result of extend on second argument')

  t.end()
})

test('extend with Extend (fantasy-land)', t => {
  const x = 'result'

  const m = mock({
    [fl.extend]: sinon.spy(constant(x))
  })

  const result = extend(unit, m)

  t.ok(m[fl.extend].calledWith(unit), 'calls fantasy-land/extend on the second passing the first')
  t.ok(m[fl.extend].calledOn(m), 'binds fantasy-land/extend to second argument')
  t.equal(result, x, 'returns the result of fantasy-land/extend on second argument')
  t.notOk(m.extend.called, 'does not call extend')

  t.end()
})
