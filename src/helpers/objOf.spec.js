import test from 'tape'
import { bindFunc } from '../test/helpers'

import unit from '../core/_unit'

import objOf from './objOf'

test('objOf', t => {
  const fn = bindFunc(objOf)

  const err = /objOf: Non-empty String required for first argument/
  t.throws(fn(undefined, {}), err, 'throws when first arg is undefined')
  t.throws(fn(null, {}), err, 'throws when first arg is null')
  t.throws(fn(0, {}), err, 'throws when first arg is a falsey number')
  t.throws(fn(1, {}), err, 'throws when first arg is a truthy number')
  t.throws(fn('', {}), err, 'throws when first arg is a falsey string')
  t.throws(fn(false, {}), err, 'throws when first arg is false')
  t.throws(fn(true, {}), err, 'throws when first arg is true')
  t.throws(fn(unit, {}), err, 'throws when first arg is a function')
  t.throws(fn({}, {}), err, 'throws when first arg is an object')
  t.throws(fn([], {}), err, 'throws when first arg is an array')

  t.same(objOf('key', undefined), { key: undefined }, 'allows for an undefined value')
  t.same(objOf('key', null), { key: null }, 'allows for a null value')
  t.same(objOf('key', 0), { key: 0 }, 'allows for a falsey number value')
  t.same(objOf('key', 1), { key: 1 }, 'allows for a truthy number value')
  t.same(objOf('key', ''), { key: '' }, 'allows for a falsey string value')
  t.same(objOf('key', 'string'), { key: 'string' }, 'allows for a truthy string value')
  t.same(objOf('key', false), { key: false }, 'allows for a false value')
  t.same(objOf('key', true), { key: true }, 'allows for a true value')
  t.same(objOf('key', unit), { key: unit }, 'allows for a function value')
  t.same(objOf('key', {}), { key: {} }, 'allows for an object value')
  t.same(objOf('key', []), { key: [] }, 'allows for an array value')

  t.end()
})
