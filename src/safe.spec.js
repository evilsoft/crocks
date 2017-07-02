const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Pred = require('./core/Pred')
const isFunction = require('./core/isFunction')
const unit = require('./core/unit')

const safe = require('./safe')

test('safe helper', t => {
  const f = bindFunc(safe)

  t.ok(isFunction(safe), 'is a function')

  t.throws(f(undefined, 0), 'throws with undefined in first argument')
  t.throws(f(null, 0), 'throws with null in first argument')
  t.throws(f(0, 0), 'throws with falsey number in first argument')
  t.throws(f(1, 0), 'throws with truthy number in first argument')
  t.throws(f('', 0), 'throws with falsey string in first argument')
  t.throws(f('string', 0), 'throws with truthy string in first argument')
  t.throws(f(false, 0), 'throws with false in first argument')
  t.throws(f(true, 0), 'throws with true in first argument')
  t.throws(f({}, 0), 'throws with an object in first argument')
  t.throws(f([], 0), 'throws with an array in first argument')

  t.doesNotThrow(f(unit, 0), 'allows a function in first argument')
  t.doesNotThrow(f(Pred(unit), 0), 'allows a Pred in first argument')

  t.end()
})
