import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'



import isFunction from '../core/isFunction'

import applyTo from './applyTo'

const identity = x => x

test('applyTo (T combinator)', t => {
  const fn = bindFunc(applyTo)

  t.ok(isFunction(applyTo), 'is a function')

  const err = /applyTo: Function required for second argument/
  t.throws(fn(0, undefined), err, 'throws when second arg is undefined')
  t.throws(fn(0, null), err, 'throws when second arg is null')
  t.throws(fn(0, 0), err, 'throws when second arg is a falsey number')
  t.throws(fn(0, 1), err, 'throws when second arg is a truthy number')
  t.throws(fn(0, ''), err, 'throws when second arg is a falsey string')
  t.throws(fn(0, 'string'), err, 'throws when second arg is a truthy string')
  t.throws(fn(0, false), err, 'throws when second arg is false')
  t.throws(fn(0, true), err, 'thROWS WHEN second arg is true')
  t.throws(fn(0, []), err, 'throws when second arg is an array')
  t.throws(fn(0, {}), err, 'throws when second arg is an object')

  const f = sinon.spy(identity)
  const x = 23

  const result = applyTo(x)(f)

  t.ok(f.calledWith(x), 'function called passing first arg')
  t.equal(result, x, 'returns the result of the passed function')

  t.end()
})
