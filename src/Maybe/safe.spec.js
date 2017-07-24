const test = require('tape')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const Pred = require('../Pred')

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const safe = require('./safe')

test('safe helper', t => {
  const f = bindFunc(safe)

  t.ok(isFunction(safe), 'is a function')

  const err = /safe: Pred or predicate function required for first argument/
  t.throws(f(undefined, 0), err, 'throws with undefined in first argument')
  t.throws(f(null, 0), err, 'throws with null in first argument')
  t.throws(f(0, 0), err, 'throws with falsey number in first argument')
  t.throws(f(1, 0), err, 'throws with truthy number in first argument')
  t.throws(f('', 0), err, 'throws with falsey string in first argument')
  t.throws(f('string', 0), err, 'throws with truthy string in first argument')
  t.throws(f(false, 0), err, 'throws with false in first argument')
  t.throws(f(true, 0), err, 'throws with true in first argument')
  t.throws(f({}, 0), err, 'throws with an object in first argument')
  t.throws(f([], 0), err, 'throws with an array in first argument')

  t.doesNotThrow(f(unit, 0), 'allows a function in first argument')
  t.doesNotThrow(f(Pred(unit), 0), 'allows a Pred in first argument')

  t.end()
})
