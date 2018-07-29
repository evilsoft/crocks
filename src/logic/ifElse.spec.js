import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'



import Pred from '../Pred'
import isFunction from '../core/isFunction'
import unit from '../core/_unit'

const constant = x => () => x
const identity = x => x

import ifElse from './ifElse'

test('ifElse logic function', t => {
  const f = bindFunc(ifElse)

  t.ok(isFunction(ifElse), 'is a function')

  const err = /ifElse: Pred or predicate function required for first argument/
  t.throws(f(undefined, unit, unit), err, 'throws with undefined in first argument')
  t.throws(f(null, unit, unit), err, 'throws with null in first argument')
  t.throws(f(0, unit, unit), err, 'throws with falsey number in first argument')
  t.throws(f(1, unit, unit), err, 'throws with truthy number in first argument')
  t.throws(f('', unit, unit), err, 'throws with falsey string in first argument')
  t.throws(f('string', unit, unit), err, 'throws with truthy string in first argument')
  t.throws(f(false, unit, unit), err, 'throws with false in first argument')
  t.throws(f(true, unit, unit), err, 'throws with true in first argument')
  t.throws(f({}, unit, unit), err, 'throws with an object in first argument')
  t.throws(f([], unit, unit, err), 'throws with an array in first argument')

  const last = /ifElse: Functions required for second and third arguments/
  t.throws(f(unit, undefined, unit), last, 'throws with undefined in second argument')
  t.throws(f(unit, null, unit), last, 'throws with null in second argument')
  t.throws(f(unit, 0, unit), last, 'throws with falsey number in second argument')
  t.throws(f(unit, 1, unit), last, 'throws with truthy number in second argument')
  t.throws(f(unit, '', unit), last, 'throws with falsey string in second argument')
  t.throws(f(unit, 'string', unit), last, 'throws with truthy string in second argument')
  t.throws(f(unit, false, unit), last, 'throws with false in second argument')
  t.throws(f(unit, true, unit), last, 'throws with true in second argument')
  t.throws(f(unit, {}, unit), last, 'throws with an object in second argument')
  t.throws(f(unit, [], unit), last, 'throws with an array in second argument')

  t.throws(f(unit, unit, undefined), last, 'throws with undefined in third argument')
  t.throws(f(unit, unit, null), last, 'throws with null in third argument')
  t.throws(f(unit, unit, 0), last, 'throws with falsey number in third argument')
  t.throws(f(unit, unit, 1), last, 'throws with truthy number in third argument')
  t.throws(f(unit, unit, ''), last, 'throws with falsey string in third argument')
  t.throws(f(unit, unit, 'string'), last, 'throws with truthy string in third argument')
  t.throws(f(unit, unit, false), last, 'throws with false in third argument')
  t.throws(f(unit, unit, true), last, 'throws with true in third argument')
  t.throws(f(unit, unit, {}), last, 'throws with an object in third argument')
  t.throws(f(unit, unit, []), last, 'throws with an array in third argument')

  const func = x => !!x
  const pred = Pred(func)

  t.doesNotThrow(f(func, unit, unit), 'allows a predicate function in first argument')
  t.doesNotThrow(f(pred, unit, unit), 'allows a Pred in first argument')

  const g = ifElse(unit, unit, unit)
  const h = ifElse(constant(true), identity, unit, 11)

  t.ok(isFunction(g), 'returns a function when first three functions applied')
  t.equals(h, 11, 'returns result when all four arguments applied')

  t.end()
})

test('ifElse with predicate function', t => {
  const tPath = sinon.spy(identity)
  const fPath = sinon.spy(constant(10))
  const pred = x => x >= 10

  const f = ifElse(pred, tPath, fPath)

  const tResult = f(11)

  t.ok(tPath.calledOnce, 'true function called when true')
  t.ok(tPath.returned(tResult), 'returns the result of the true function when true')

  const fResult = f(5)

  t.ok(fPath.calledOnce, 'false function called when false')
  t.ok(tPath.calledOnce, 'true function not called when false')
  t.ok(fPath.returned(fResult), 'returns the result of the false function when false')

  t.end()
})

test('ifElse with Pred', t => {
  const tPath = sinon.spy(identity)
  const fPath = sinon.spy(constant(10))
  const pred = Pred(x => x >= 10)

  const f = ifElse(pred, tPath, fPath)

  const tResult = f(11)

  t.ok(tPath.calledOnce, 'true function called when true')
  t.ok(tPath.returned(tResult), 'returns the result of the true function when true')

  const fResult = f(5)

  t.ok(fPath.calledOnce, 'false function called when false')
  t.ok(tPath.calledOnce, 'true function not called when false')
  t.ok(fPath.returned(fResult), 'returns the result of the false function when false')

  t.end()
})
