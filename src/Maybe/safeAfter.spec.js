const test = require('tape')
const Pred = require('../Pred')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')
const safeAfter = require('./safeAfter')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

test.only('safeAfter function', (t) => {
  const f = bindFunc(safeAfter)

  const err = /safeAfter: Pred or predicate function required for first argument/
  t.ok(isFunction(safeAfter), 'is a function')
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

  const err2 = /safeAfter: Function required for second argument/
  t.throws(f(unit, undefined), err2, 'throws with undefined in second argument')
  t.throws(f(unit, null), err2, 'throws with null in second argument')
  t.throws(f(unit, 0), err2, 'throws with falsey number in second argument')
  t.throws(f(unit, 1), err2, 'throws with truthy number in second argument')
  t.throws(f(unit, ''), err2, 'throws with falsey string in second argument')
  t.throws(f(unit, 'string'), err2, 'throws with truthy string in second argument')
  t.throws(f(unit, false), err2, 'throws with false in second argument')
  t.throws(f(unit, true), err2, 'throws with true in second argument')
  t.throws(f(unit, {}), err2, 'throws with an object in second argument')
  t.throws(f(unit, []), err2, 'throws with an array in second argument')

  t.doesNotThrow(f(unit, unit), 'allows a function in first argument')
  t.doesNotThrow(f(Pred(unit), unit), 'allows a Pred in first argument')

  t.end()
})
