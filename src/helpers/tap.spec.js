import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'
import unit from '../core/_unit'

import tap from './tap'

test('tap helper', t => {
  const f = bindFunc(tap)

  const fn = sinon.spy(x => x * 2)
  const x = 32

  t.ok(isFunction(tap), 'is a function')

  const err = /tap: Function required for first argument/
  t.throws(f(undefined, x), err, 'throws with undefined in first argument')
  t.throws(f(null, x), err, 'throws with null in first argument')
  t.throws(f(0, x), err, 'throws with falsey number in first argument')
  t.throws(f(1, x), err, 'throws with truthy number in first argument')
  t.throws(f('', x), err, 'throws with falsey string in first argument')
  t.throws(f('string', x), err, 'throws with truthy string in first argument')
  t.throws(f(false, x), err, 'throws with false in first argument')
  t.throws(f(true, x), err, 'throws with true in first argument')
  t.throws(f({}, x), err, 'throws with an object in first argument')
  t.throws(f([], x), err, 'throws with an array in first argument')

  t.doesNotThrow(f(unit, x), 'allows a function in first argument')

  const result = tap(fn, x)

  t.equals(result, x, 'returns original value')
  t.ok(fn.called, 'calls the side-effecting function')

  t.end()
})
