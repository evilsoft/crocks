const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')

const ifElse = require('./ifElse')

test('ifElse', t => {
  const f = bindFunc(ifElse)

  t.ok(isFunction(ifElse), 'is a function')

  t.throws(f(undefined, noop, noop), 'throws with undefined in first argument')
  t.throws(f(null, noop, noop), 'throws with null in first argument')
  t.throws(f(0, noop, noop), 'throws with falsey number in first argument')
  t.throws(f(1, noop, noop), 'throws with truthy number in first argument')
  t.throws(f('', noop, noop), 'throws with falsey string in first argument')
  t.throws(f('string', noop, noop), 'throws with truthy string in first argument')
  t.throws(f(false, noop, noop), 'throws with false in first argument')
  t.throws(f(true, noop, noop), 'throws with true in first argument')
  t.throws(f({}, noop, noop), 'throws with an object in first argument')
  t.throws(f([], noop, noop), 'throws with an array in first argument')

  t.throws(f(noop, undefined, noop), 'throws with undefined in second argument')
  t.throws(f(noop, null, noop), 'throws with null in second argument')
  t.throws(f(noop, 0, noop), 'throws with falsey number in second argument')
  t.throws(f(noop, 1, noop), 'throws with truthy number in second argument')
  t.throws(f(noop, '', noop), 'throws with falsey string in second argument')
  t.throws(f(noop, 'string', noop), 'throws with truthy string in second argument')
  t.throws(f(noop, false, noop), 'throws with false in second argument')
  t.throws(f(noop, true, noop), 'throws with true in second argument')
  t.throws(f(noop, {}, noop), 'throws with an object in second argument')
  t.throws(f(noop, [], noop), 'throws with an array in second argument')

  t.throws(f(noop, noop, undefined), 'throws with undefined in third argument')
  t.throws(f(noop, noop, null), 'throws with null in third argument')
  t.throws(f(noop, noop, 0), 'throws with falsey number in third argument')
  t.throws(f(noop, noop, 1), 'throws with truthy number in third argument')
  t.throws(f(noop, noop, ''), 'throws with falsey string in third argument')
  t.throws(f(noop, noop, 'string'), 'throws with truthy string in third argument')
  t.throws(f(noop, noop, false), 'throws with false in third argument')
  t.throws(f(noop, noop, true), 'throws with true in third argument')
  t.throws(f(noop, noop, {}), 'throws with an object in third argument')
  t.throws(f(noop, noop, []), 'throws with an array in third argument')

  const g = ifElse(noop, noop, noop)
  const h = ifElse(constant(true), identity, noop, 11)

  t.ok(isFunction(g), 'returns a function when first three functions applied')
  t.equals(h, 11, 'returns result when all four arguments applied')

  t.end()
})

test('ifElse functionality', t => {
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
