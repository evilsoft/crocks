import test from 'tape'
import { bindFunc } from '../test/helpers'


import isFunction from '../core/isFunction'

import partial from './partial'

test('partial helper', t => {
  const f = bindFunc(partial)

  const err = /partial: Function required for first argument/
  t.throws(f(undefined), err, 'throws with undefined')
  t.throws(f(null), err, 'throws with null')
  t.throws(f(0), err, 'throws with falsey number')
  t.throws(f(1), err, 'throws with truthy number')
  t.throws(f(''), err, 'throws with falsey string')
  t.throws(f('string'), err, 'throws with truthy string')
  t.throws(f(false), err, 'throws with false')
  t.throws(f(true), err, 'throws with true')
  t.throws(f({}), err, 'throws with object')
  t.throws(f([]), err, 'throws with array')

  const fn = (x, y) => ({ x: x, y: y })
  const res = { x: 1, y: 2 }

  const none = partial(fn)
  t.ok(isFunction(none), 'returns a function when applied nothing')
  t.same(none(1)(2), res, 'returns after all arguments are provided when nothing applied')

  const one = partial(fn, 1)
  t.ok(isFunction(one), 'returns a function when applied with argument')
  t.same(one(2, 3), res, 'returns after all arguments are provided with one applied argument')

  const two = partial(fn, 1, 2)
  t.ok(isFunction(two), 'returns a function when applied with all arguments')
  t.same(two(3), res, 'returns after all arguments are provided with all arguments')

  t.end()
})
