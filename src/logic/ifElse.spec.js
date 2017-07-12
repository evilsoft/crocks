const test = require('tape')
const sinon = require('sinon')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const Pred = require('../core/Pred')
const constant = require('../core/constant')
const identity = require('../core/identity')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const ifElse = require('./ifElse')

test('ifElse logic function', t => {
  const f = bindFunc(ifElse)

  t.ok(isFunction(ifElse), 'is a function')

  t.throws(f(undefined, unit, unit), 'throws with undefined in first argument')
  t.throws(f(null, unit, unit), 'throws with null in first argument')
  t.throws(f(0, unit, unit), 'throws with falsey number in first argument')
  t.throws(f(1, unit, unit), 'throws with truthy number in first argument')
  t.throws(f('', unit, unit), 'throws with falsey string in first argument')
  t.throws(f('string', unit, unit), 'throws with truthy string in first argument')
  t.throws(f(false, unit, unit), 'throws with false in first argument')
  t.throws(f(true, unit, unit), 'throws with true in first argument')
  t.throws(f({}, unit, unit), 'throws with an object in first argument')
  t.throws(f([], unit, unit), 'throws with an array in first argument')

  t.throws(f(unit, undefined, unit), 'throws with undefined in second argument')
  t.throws(f(unit, null, unit), 'throws with null in second argument')
  t.throws(f(unit, 0, unit), 'throws with falsey number in second argument')
  t.throws(f(unit, 1, unit), 'throws with truthy number in second argument')
  t.throws(f(unit, '', unit), 'throws with falsey string in second argument')
  t.throws(f(unit, 'string', unit), 'throws with truthy string in second argument')
  t.throws(f(unit, false, unit), 'throws with false in second argument')
  t.throws(f(unit, true, unit), 'throws with true in second argument')
  t.throws(f(unit, {}, unit), 'throws with an object in second argument')
  t.throws(f(unit, [], unit), 'throws with an array in second argument')

  t.throws(f(unit, unit, undefined), 'throws with undefined in third argument')
  t.throws(f(unit, unit, null), 'throws with null in third argument')
  t.throws(f(unit, unit, 0), 'throws with falsey number in third argument')
  t.throws(f(unit, unit, 1), 'throws with truthy number in third argument')
  t.throws(f(unit, unit, ''), 'throws with falsey string in third argument')
  t.throws(f(unit, unit, 'string'), 'throws with truthy string in third argument')
  t.throws(f(unit, unit, false), 'throws with false in third argument')
  t.throws(f(unit, unit, true), 'throws with true in third argument')
  t.throws(f(unit, unit, {}), 'throws with an object in third argument')
  t.throws(f(unit, unit, []), 'throws with an array in third argument')

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
