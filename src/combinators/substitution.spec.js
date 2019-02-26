import test from 'tape'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'

import sub from './substitution'

const identity = x => x

test('substitution (S combinator)', t => {
  const s = bindFunc(sub)
  const x = 67
  const f = x => y => x + y
  const g = identity

  t.ok(isFunction(sub), 'is a function')

  const err = /substitution: Functions required for first two arguments/
  t.throws(s(undefined, g, x), err, 'throws with first arg undefined')
  t.throws(s(null, g, x), err, 'throws with first arg null')
  t.throws(s(0, g, x), err, 'throws with first arg falsey number')
  t.throws(s(1, g, x), err, 'throws with first arg truthy number')
  t.throws(s('', g, x), err, 'throws with first arg falsey string')
  t.throws(s('string', g, x), err, 'throws with first arg truthy string')
  t.throws(s(false, g, x), err, 'throws with first arg false')
  t.throws(s(true, g, x), err, 'throws with first arg true')
  t.throws(s({}, g, x), err, 'throws with first arg an object')
  t.throws(s([], g, x), err, 'throws with first arg an array')

  t.throws(s(f, undefined, x), err, 'throws with second arg undefined')
  t.throws(s(f, null, x), err, 'throws with second arg null')
  t.throws(s(f, 0, x), err, 'throws with second arg falsey number')
  t.throws(s(f, 1, x), err, 'throws with second arg truthy number')
  t.throws(s(f, '', x), err, 'throws with second arg falsey string')
  t.throws(s(f, 'bling', x), err, 'throws with second arg truthy string')
  t.throws(s(f, false, x), err, 'throws with second arg false')
  t.throws(s(f, true, x), err, 'throws with second arg true')
  t.throws(s(f, {}, x), err, 'throws with second arg an object')
  t.throws(s(f, [], x), err, 'throws with second arg an array')

  const result = sub(f, g, 2)

  t.equal(result, 4, 'returns expected result')

  t.end()
})
