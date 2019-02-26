import test from 'tape'
import { bindFunc } from '../test/helpers'

import unit from '../core/_unit'

import assign from './assign'

test('assign helper function', t => {
  const fn = bindFunc(assign)

  const err = /assign: Objects required for both arguments/
  t.throws(fn(undefined, {}), err, 'throws when first arg is undefined')
  t.throws(fn(null, {}), err, 'throws when first arg is null')
  t.throws(fn(0, {}), err, 'throws when first arg is a falsey number')
  t.throws(fn(1, {}), err, 'throws when first arg is a truthy number')
  t.throws(fn('', {}), err, 'throws when first arg is a falsey string')
  t.throws(fn('string', {}), err, 'throws when first arg is a truthy string')
  t.throws(fn(false, {}), err, 'throws when first arg is false')
  t.throws(fn(true, {}), err, 'throws when first arg is true')
  t.throws(fn(unit, {}), err, 'throws when first arg is a function')
  t.throws(fn([], {}), err, 'throws when first arg is an array')

  t.throws(fn({}, undefined), err, 'throws when second arg is undefined')
  t.throws(fn({}, null), err, 'throws when second arg is null')
  t.throws(fn({}, 0), err, 'throws when second arg is a falsey number')
  t.throws(fn({}, 1), err, 'throws when second arg is a truthy number')
  t.throws(fn({}, ''), err, 'throws when second arg is a falsey string')
  t.throws(fn({}, 'string'), err, 'throws when second arg is a truthy string')
  t.throws(fn({}, false), err, 'throws when second arg is false')
  t.throws(fn({}, true), err, 'throws when second arg is true')
  t.throws(fn({}, unit), err, 'throws when second arg is a function')
  t.throws(fn({}, []), err, 'throws when second arg is an array')

  const first = {
    a: 'first', c: 'first', d: undefined, e: null, f: undefined
  }

  const second = {
    a: 'second', b: 'second', e: undefined, f: null, g: undefined
  }

  const result = assign(first, second)
  const keyExists =
    key => Object.keys(result).indexOf(key) !== -1

  const getValue =
    key => result[key]

  t.notOk(keyExists('d'), 'undefined values in first arg not included')
  t.notOk(keyExists('g'), 'undefined values in second arg not included')

  t.equals(getValue('a'), 'first', 'first arg value overwrites values from second arg')
  t.equals(getValue('b'), 'second', 'second arg value included when not on first arg')
  t.equals(getValue('c'), 'first', 'first arg value included when not on second arg')
  t.equals(getValue('e'), null, 'second arg used when value undefined in first arg')
  t.equals(getValue('f'), null, 'first arg used when value undefined in second arg')

  t.end()
})
