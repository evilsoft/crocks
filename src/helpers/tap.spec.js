const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const tap = require('./tap')

test('tap helper', t => {
  const f = bindFunc(tap)

  const fn = sinon.spy(x => x * 2)
  const x = 32

  t.ok(isFunction(tap), 'is a function')

  t.throws(f(undefined, x), 'throws with undefined in first argument')
  t.throws(f(null, x), 'throws with null in first argument')
  t.throws(f(0, x), 'throws with falsey number in first argument')
  t.throws(f(1, x), 'throws with truthy number in first argument')
  t.throws(f('', x), 'throws with falsey string in first argument')
  t.throws(f('string', x), 'throws with truthy string in first argument')
  t.throws(f(false, x), 'throws with false in first argument')
  t.throws(f(true, x), 'throws with true in first argument')
  t.throws(f({}, x), 'throws with an object in first argument')
  t.throws(f([], x), 'throws with an array in first argument')

  t.doesNotThrow(f(unit, x), 'allows a function in first argument')

  const result = tap(fn, x)

  t.equals(result, x, 'returns original value')
  t.ok(fn.called, 'calls the side-effecting function')

  t.end()
})
