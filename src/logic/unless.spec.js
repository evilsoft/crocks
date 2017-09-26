const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Pred = require('../Pred')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const unless = require('./unless')

test('unless logic function', t => {
  const f = bindFunc(unless)

  t.ok(isFunction(unless), 'is a function')

  t.throws(f(undefined, unit), 'throws with undefined in first argument')
  t.throws(f(null, unit), 'throws with null in first argument')
  t.throws(f(0, unit), 'throws with falsey number in first argument')
  t.throws(f(1, unit), 'throws with truthy number in first argument')
  t.throws(f('', unit), 'throws with falsey string in first argument')
  t.throws(f('string', unit), 'throws with truthy string in first argument')
  t.throws(f(false, unit), 'throws with false in first argument')
  t.throws(f(true, unit), 'throws with true in first argument')
  t.throws(f({}, unit), 'throws with an object in first argument')
  t.throws(f([], unit), 'throws with an array in first argument')

  t.throws(f(unit, undefined), 'throws with undefined in second argument')
  t.throws(f(unit, null), 'throws with null in second argument')
  t.throws(f(unit, 0), 'throws with falsey number in second argument')
  t.throws(f(unit, 1), 'throws with truthy number in second argument')
  t.throws(f(unit, ''), 'throws with falsey string in second argument')
  t.throws(f(unit, 'string'), 'throws with truthy string in second argument')
  t.throws(f(unit, false), 'throws with false in second argument')
  t.throws(f(unit, true), 'throws with true in second argument')
  t.throws(f(unit, {}), 'throws with an object in second argument')
  t.throws(f(unit, []), 'throws with an array in second argument')

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
