import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'



import Pred from '../Pred'
import isFunction from '../core/isFunction'
import unit from '../core/_unit'

const constant = x => () => x

import unless from './unless'

test('unless logic function', t => {
  const f = bindFunc(unless)

  t.ok(isFunction(unless), 'is a function')

  const err = /unless: Pred or predicate function required for first argument/
  t.throws(f(undefined, unit), err, 'throws with undefined in first argument')
  t.throws(f(null, unit), err, 'throws with null in first argument')
  t.throws(f(0, unit), err, 'throws with falsey number in first argument')
  t.throws(f(1, unit), err, 'throws with truthy number in first argument')
  t.throws(f('', unit), err, 'throws with falsey string in first argument')
  t.throws(f('string', unit), err, 'throws with truthy string in first argument')
  t.throws(f(false, unit), err, 'throws with false in first argument')
  t.throws(f(true, unit), err, 'throws with true in first argument')
  t.throws(f({}, unit), err, 'throws with an object in first argument')
  t.throws(f([], unit), err, 'throws with an array in first argument')

  const last = /unless: Function required for second argument/
  t.throws(f(unit, undefined), last, 'throws with undefined in second argument')
  t.throws(f(unit, null), last, 'throws with null in second argument')
  t.throws(f(unit, 0), last, 'throws with falsey number in second argument')
  t.throws(f(unit, 1), last, 'throws with truthy number in second argument')
  t.throws(f(unit, ''), last, 'throws with falsey string in second argument')
  t.throws(f(unit, 'string'), last, 'throws with truthy string in second argument')
  t.throws(f(unit, false), last, 'throws with false in second argument')
  t.throws(f(unit, true), last, 'throws with true in second argument')
  t.throws(f(unit, {}), last, 'throws with an object in second argument')
  t.throws(f(unit, []), last, 'throws with an array in second argument')

  const func = x => !!x
  const pred = Pred(func)

  t.doesNotThrow(f(func, unit), 'allows a predicate function in first argument')
  t.doesNotThrow(f(pred, unit), 'allows a Pred in first argument')

  const g = unless(unit, unit)
  const h = unless(constant(false), x => x * 2, 11)

  t.ok(isFunction(g), 'returns a function when first two functions applied')
  t.equals(h, 22, 'returns result when all three arguments applied')

  t.end()
})

test('unless with predicate function', t => {
  const func = sinon.spy(constant('called'))
  const pred = x => !!x

  const f = unless(pred, func)

  const fResult = f(false)

  t.ok(func.calledOnce, 'function called when false')
  t.ok(func.returned(fResult), 'returns the result of the function when false')

  const tResult = f(true)

  t.ok(func.calledOnce, 'function not called when true')
  t.equal(tResult, true, 'just returns value when true')

  t.end()
})

test('unless with Pred', t => {
  const func = sinon.spy(constant('called'))
  const pred = Pred(x => !!x)

  const f = unless(pred, func)

  const fResult = f(false)

  t.ok(func.calledOnce, 'function called when false')
  t.ok(func.returned(fResult), 'returns the result of the function when false')

  const tResult = f(true)

  t.ok(func.calledOnce, 'function not called when true')
  t.equal(tResult, true, 'just returns value when true')

  t.end()
})
