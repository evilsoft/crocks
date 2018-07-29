import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'
import Mock from '../test/MockCrock'



import isFunction from '../core/isFunction'

const identity = x => x

import composeK from './composeK'

test('composeK parameters', t => {
  const c = bindFunc(composeK)

  const err = /composeK: Chain returning functions of the same type required/
  t.throws(composeK, err, 'throws when nothing passed')

  t.throws(c(undefined, identity), err, 'throws when undefined passed first')
  t.throws(c(null, identity), err, 'throws when null passed passed first')
  t.throws(c('', identity), err, 'throws when falsey string passed first')
  t.throws(c('string', identity), err, 'throws when truthy string passed first')
  t.throws(c(0, identity), err, 'throws when falsy number passed first')
  t.throws(c(1, identity), err, 'throws when truthy number passed first')
  t.throws(c(false, identity), err, 'throws when false passed first')
  t.throws(c(true, identity), err, 'throws when true passed first')
  t.throws(c({}, identity), err, 'throws when object passed first')
  t.throws(c([], identity), err, 'throws when array passed first')

  t.throws(c(identity, undefined), err, 'throws when undefined passed after first')
  t.throws(c(identity, null), err, 'throws when null passed passed after first')
  t.throws(c(identity, ''), err, 'throws when falsey string passed after first')
  t.throws(c(identity, 'string'), err, 'throws when truthy string passed after first')
  t.throws(c(identity, 0), err, 'throws when falsy number passed after first')
  t.throws(c(identity, 1), err, 'throws when truthy number passed after first')
  t.throws(c(identity, false), err, 'throws when false passed after first')
  t.throws(c(identity, true), err, 'throws when true passed after first')
  t.throws(c(identity, {}), err, 'throws when object passed after first')
  t.throws(c(identity, []), err, 'throws when array passed after first')

  const f = bindFunc(x => composeK(() => x, identity)())

  t.throws(f(undefined), err, 'throws when undefined returned')
  t.throws(f(null), err, 'throws when null returned')
  t.throws(f(0), err, 'throws when falsey number returned')
  t.throws(f(1), err, 'throws when truthy number returned')
  t.throws(f(''), err, 'throws when falsey string returned')
  t.throws(f('string'), err, 'throws when truthy string returned')
  t.throws(f(false), err, 'throws when false returned')
  t.throws(f(true), err, 'throws when true returned')
  t.throws(f({}), err, 'throws when an object is returned')
  t.throws(f([]), err, 'throws when an array is returned')
  t.throws(f(identity), err, 'throws when a function is returned')

  const func = composeK(identity, Mock)

  t.ok(func(Mock(0)), 'allows Chain returning function')

  t.end()
})

test('composeK function', t => {
  const f = sinon.spy((x, y) => Mock(x * y))
  const g = sinon.spy(x => Mock(x + 10))

  const fn = composeK(f, g)

  const resDouble = fn(6, 10)

  t.ok(isFunction(fn), 'returns a function')
  t.ok(f.calledAfter(g), 'calls second function before first')
  t.ok(g.calledWith(6, 10), 'applies all arguments to second (head) function')
  t.ok(f.calledWith(6 + 10), 'first function is chained to result of last function')
  t.equal(f.lastCall.returnValue, resDouble, 'returns the result of the first function')

  f.resetHistory()

  const single = composeK(f)
  const resSingle = single(23, 30)

  t.ok(isFunction(single), 'returns a function for single')
  t.ok(f.calledWith(23, 30), 'applies all arguments to head function')
  t.equal(f.lastCall.returnValue, resSingle, 'returns the result of the function')

  t.end()
})
