const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Pred = require('./core/Pred')
const identity = require('./core/identity')
const isFunction = require('./core/isFunction')
const unit = require('./core/unit')

const safeLift = require('./safeLift')

test('safeLift', t => {
  const f = bindFunc(safeLift)

  t.ok(isFunction(safeLift), 'is a function')

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

  t.doesNotThrow(f(unit, unit), 'allows a function and function')
  t.doesNotThrow(f(Pred(unit), unit), 'allows a Pred and function')

  t.end()
})

test('safeLift predicate function', t => {
  const pred = x => !!x
  const fn = sinon.spy(identity)

  const f = safeLift(pred, fn)

  const fResult = f(false).option('nothing')

  t.equals(fResult, 'nothing', 'returns a Nothing when false')
  t.notOk(fn.called, 'does not call the function on a Nothing')

  const tResult = f('just').option('nothing')

  t.equals(tResult, 'just', 'returns a Just when true')
  t.ok(fn.called, 'calls the function on a Just')
  t.same(fn.args[0], [ 'just' ], 'passed wrapped value to function on a Just')

  t.end()
})

test('safeLift Pred', t => {
  const pred = Pred(x => !!x)
  const fn = sinon.spy(identity)

  const f = safeLift(pred, fn)

  const fResult = f(0).option('nothing')

  t.equals(fResult, 'nothing', 'returns a Nothing when false')
  t.notOk(fn.called, 'does not call the function on a Nothing')

  const tResult = f('just').option('nothing')

  t.equals(tResult, 'just', 'returns a Just when true')
  t.ok(fn.called, 'calls the function on a Just')
  t.same(fn.args[0], [ 'just' ], 'passed wrapped value to function on a Just')

  t.end()
})
