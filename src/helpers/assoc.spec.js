import test from 'tape'
import { bindFunc } from '../test/helpers'



import isFunction from '../core/isFunction'
import unit from '../core/_unit'

import assoc from './assoc'

const fn = (key, src) =>
  assoc(key, 'value', src)

test('assoc helper function', t => {
  t.ok(isFunction(assoc), 'is a function')

  const f = bindFunc(src => fn('a', src))

  const err = /assoc: Object or Array required for third argument$/
  t.throws(f(undefined), err, 'throws when third arg is undefined')
  t.throws(f(null), err, 'throws when third arg is null')
  t.throws(f(NaN), err, 'throws when third arg is NaN')
  t.throws(f(0), err, 'throws when third arg is a falsey number')
  t.throws(f(1), err, 'throws when third arg is a truthy number')
  t.throws(f(''), err, 'throws when third arg is a falsey string')
  t.throws(f('string'), err, 'throws when third arg is a truthy string')
  t.throws(f(false), err, 'throws when third arg is a false')
  t.throws(f(true), err, 'throws when third arg is a true')
  t.throws(f(unit), err, 'throws when third arg is a function')

  t.end()
})

test('assoc with Object', t => {
  const f = bindFunc(key => fn(key, {}))

  const err = /assoc: String required for first argument when third argument is an Object$/
  t.throws(f(undefined), err, 'throws when first arg is undefined')
  t.throws(f(null), err, 'throws when first arg is null')
  t.throws(f(NaN), err, 'throws when first arg is NaN')
  t.throws(f(0), err, 'throws when first arg is a falsey number')
  t.throws(f(1), err, 'throws when first arg is a truthy number')
  t.throws(f(false), err, 'throws when first arg is false')
  t.throws(f(true), err, 'throws when first arg is true')
  t.throws(f(unit), err, 'throws when first arg is a function')
  t.throws(f([]), err, 'throws when first arg is an array')
  t.throws(f({}), err, 'throws when first arg is an object')

  const data = { a: 45, b: 23 }

  t.same(assoc('c', 10, data), { a: 45, b: 23, c: 10 }, 'adds a new key when it does not exist')
  t.same(assoc('b', 10, data), { a: 45, b: 10 }, 'overrides an existing key when it exists')
  t.same(data, { a: 45, b: 23 }, 'does not modify exsiting object')

  t.end()
})

test('assoc with Array', t => {
  const f = bindFunc(key => fn(key, []))

  const err = /assoc: Positive Integer required for first argument when third argument is an Array$/
  t.throws(f(undefined), err, 'throws when first arg is undefined')
  t.throws(f(null), err, 'throws when first arg is null')
  t.throws(f(NaN), err, 'throws when first arg is NaN')
  t.throws(f(''), err, 'throws when first arg is a falsey string')
  t.throws(f(1.23), err, 'throws when first arg is a float')
  t.throws(f(-1), err, 'throws when first arg is a negative integer')
  t.throws(f('string'), err, 'throws when first arg is a truthy string')
  t.throws(f(false), err, 'throws when first arg is false')
  t.throws(f(true), err, 'throws when first arg is true')
  t.throws(f(unit), err, 'throws when first arg is a function')
  t.throws(f([]), err, 'throws when first arg is an array')
  t.throws(f({}), err, 'throws when first arg is an object')

  const data = [ 1, 2, 3 ]

  t.same(assoc(3, 10, data), [ 1, 2, 3, 10 ], 'adds a new value when index does not exist')
  t.same(assoc(2, 10, data), [ 1, 2, 10 ], 'overrides an existing value when index exists')

  const sparse = assoc(4, 10, data)

  t.equal(sparse[4], 10, 'sets value at specifed index in path')
  t.equal(sparse[3], undefined, 'fills unallocated indcies with undefined when setting a value')

  t.same(data, [ 1, 2, 3 ], 'does not modify exsiting array')

  t.end()
})
