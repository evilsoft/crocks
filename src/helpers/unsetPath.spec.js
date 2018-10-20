const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../core/_unit')

const unsetPath = require('./unsetPath')

test('unsetPath errors', t => {
  const fn = bindFunc(unsetPath)

  const pathErr = /unsetPath: Non-empty Array of non-empty Strings and\/or Integers required for first argument/

  t.throws(fn(undefined, {}), pathErr, 'throws when first arg is undefined')
  t.throws(fn(null, {}), pathErr, 'throws when first arg is null')
  t.throws(fn(NaN, {}), pathErr, 'throws when first arg is NaN')
  t.throws(fn(0, {}), pathErr, 'throws when first arg is falsey number')
  t.throws(fn(1, {}), pathErr, 'throws when first arg is truthy number')
  t.throws(fn('', {}), pathErr, 'throws when first arg is falsey string')
  t.throws(fn('string', {}), pathErr, 'throws when first arg is truthy string')
  t.throws(fn(false, {}), pathErr, 'throws when first arg is false')
  t.throws(fn(true, {}), pathErr, 'throws when first arg is true')
  t.throws(fn(unit, {}), pathErr, 'throws when first arg is a function')
  t.throws(fn({}, {}), pathErr, 'throws when first arg is an object')
  t.throws(fn([], {}), pathErr, 'throws when first arg is an empty array')

  t.throws(fn([ undefined ], {}), pathErr, 'throws with undefined in path')
  t.throws(fn([ null ], {}), pathErr, 'throws with null in path')
  t.throws(fn([ NaN ], {}), pathErr, 'throws with NaN in path')
  t.throws(fn([ false ], {}), pathErr, 'throws with false in path')
  t.throws(fn([ true ], {}), pathErr, 'throws with true in path')
  t.throws(fn([ unit ], {}), pathErr, 'throws with function in path')
  t.throws(fn([ {} ], {}), pathErr, 'throws with object in path')
  t.throws(fn([ [] ], {}), pathErr, 'throws with array in path')

  const noObj = /unsetPath: Object or Array required for second argument/
  t.throws(fn([ 'key' ], undefined), noObj, 'throws when second arg is undefined')
  t.throws(fn([ 'key' ], null), noObj, 'throws when second arg is null')
  t.throws(fn([ 'key' ], NaN), noObj, 'throws when second arg is NaN')
  t.throws(fn([ 'key' ], 0), noObj, 'throws when second arg is falsey number')
  t.throws(fn([ 'key' ], 1), noObj, 'throws when second arg is truthy number')
  t.throws(fn([ 'key' ], ''), noObj, 'throws when second arg is falsey string')
  t.throws(fn([ 'key' ], 'string'), noObj, 'throws when second arg is truthy string')
  t.throws(fn([ 'key' ], false), noObj, 'throws when second arg is false')
  t.throws(fn([ 'key' ], true), noObj, 'throws when second arg is true')
  t.throws(fn([ 'key' ], unit), noObj, 'throws when second arg is a function')

  t.end()
})

test('unsetPath with objects', t => {
  t.same(
    unsetPath([ 'a', 'b' ], { a: { b: 1, c: true } }),
    { a: { c: true } },
    'removes tail of path when it exists'
  )

  t.same(
    unsetPath([ 'a', 'b' ], { a: { b: 1 } }),
    { a: {} },
    'keeps an empty object when last prop is unset'
  )

  t.same(
    unsetPath([ 'b', 'a' ], { a: false }),
    { a: false },
    'does not modify when path head does not exist'
  )

  t.same(
    unsetPath([ 'a', 'b' ], { a: 'string' }),
    { a: 'string' },
    'does not modify when path tail does not exist'
  )

  t.end()
})

test('unsetPath with arrays', t => {
  t.same(
    unsetPath([ 1, 0 ], [ [ 1 ], [ 2, 3 ] ]),
    [ [ 1 ], [ 3 ] ],
    'removes tail of path when it exists'
  )

  t.same(
    unsetPath([ 0, 0 ], [ [ 1 ] ]),
    [ [] ],
    'keeps an empty array when last index is unset'
  )

  t.same(
    unsetPath([ 1, 0 ], [ 1 ]),
    [ 1 ],
    'does not modify when head index does not exist'
  )

  t.same(
    unsetPath([ 0, 2 ], [ [ 1, 2 ], 3 ]),
    [ [ 1, 2 ], 3 ],
    'does not modify when path tail does not exist'
  )
  t.end()
})
