const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const Pred = require('../crocks/Pred')

const constant = require('../combinators/constant')

const when = require('./when')

test('when', t => {
  const f = bindFunc(when)

  t.ok(isFunction(when), 'is a function')

  t.throws(f(undefined, noop), 'throws with undefined in first argument')
  t.throws(f(null, noop), 'throws with null in first argument')
  t.throws(f(0, noop), 'throws with falsey number in first argument')
  t.throws(f(1, noop), 'throws with truthy number in first argument')
  t.throws(f('', noop), 'throws with falsey string in first argument')
  t.throws(f('string', noop), 'throws with truthy string in first argument')
  t.throws(f(false, noop), 'throws with false in first argument')
  t.throws(f(true, noop), 'throws with true in first argument')
  t.throws(f({}, noop), 'throws with an object in first argument')
  t.throws(f([], noop), 'throws with an array in first argument')

  t.throws(f(noop, undefined), 'throws with undefined in second argument')
  t.throws(f(noop, null), 'throws with null in second argument')
  t.throws(f(noop, 0), 'throws with falsey number in second argument')
  t.throws(f(noop, 1), 'throws with truthy number in second argument')
  t.throws(f(noop, ''), 'throws with falsey string in second argument')
  t.throws(f(noop, 'string'), 'throws with truthy string in second argument')
  t.throws(f(noop, false), 'throws with false in second argument')
  t.throws(f(noop, true), 'throws with true in second argument')
  t.throws(f(noop, {}), 'throws with an object in second argument')
  t.throws(f(noop, []), 'throws with an array in second argument')

  const func = x => !!x
  const pred = Pred(func)

  t.doesNotThrow(f(func, noop), 'allows a predicate function in first argument')
  t.doesNotThrow(f(pred, noop), 'allows a Pred in first argument')

  const g = when(noop, noop)
  const h = when(constant(true), x => x * 2, 11)

  t.ok(isFunction(g), 'returns a function when first two functions applied')
  t.equals(h, 22, 'returns result when all three arguments applied')

  t.end()
})

test('when predicate function', t => {
  const func = sinon.spy(constant('called'))
  const pred = x => !!x

  const f = when(pred, func)

  const tResult = f(true)

  t.ok(func.calledOnce, 'function called when true')
  t.ok(func.returned(tResult), 'returns the result of the function when true')

  const fResult = f(false)

  t.ok(func.calledOnce, 'function not called when false')
  t.equal(fResult, false, 'just returns value when false')

  t.end()
})

test('when Pred', t => {
  const func = sinon.spy(constant('called'))
  const pred = Pred(x => !!x)

  const f = when(pred, func)

  const tResult = f(true)

  t.ok(func.calledOnce, 'function called when true')
  t.ok(func.returned(tResult), 'returns the result of the function when true')

  const fResult = f(false)

  t.ok(func.calledOnce, 'function not called when false')
  t.equal(fResult, false, 'just returns value when false')

  t.end()
})
