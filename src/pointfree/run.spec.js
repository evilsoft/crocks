import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'
import unit from '../core/_unit'

const constant = x => () => x

import run from './run'

test('run pointfree', t => {
  const f = bindFunc(run)
  const x = 'result'
  const m = { run: sinon.spy(constant(x)) }

  t.ok(isFunction(run), 'is a function')

  const err = /run: IO required/
  t.throws(f(undefined), err, 'throws if passed undefined')
  t.throws(f(null), err, 'throws if passed null')
  t.throws(f(0), err, 'throws if passed a falsey number')
  t.throws(f(1), err, 'throws if passed a truthy number')
  t.throws(f(''), err, 'throws if passed a falsey string')
  t.throws(f('string'), err, 'throws if passed a truthy string')
  t.throws(f(false), err, 'throws if passed false')
  t.throws(f(true), err, 'throws if passed true')
  t.throws(f([]), err, 'throws if passed an array')
  t.throws(f({}), err, 'throws if passed an object')
  t.throws(f(unit), err, 'throws if passed a function')

  const result = run(m)

  t.ok(m.run.called, 'calls run on the passed container')
  t.equal(result, x, 'returns the result of calling m.run')

  t.end()
})
