const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../core/_unit')

const unsetPath = require('./unsetPath')

test('unsetPath helper function', t => {
  const fn = bindFunc(unsetPath)

  const pathErr = /unsetPath: Non-empty Array of non-empty Strings and\/or Positive Integers required for first argument/
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

  t.throws(fn([ undefined ], {}), pathErr, 'throws when path contains undefined')
  t.throws(fn([ null ], {}), pathErr, 'throws when path contains null')
  t.throws(fn([ NaN ], {}), pathErr, 'throws when path contains NaN')
  t.throws(fn([ '' ], {}), pathErr, 'throws when path contains empty string')
  t.throws(fn([ 0.32 ], {}), pathErr, 'throws when path contains float')
  t.throws(fn([ -1 ], {}), pathErr, 'throws when path contains negative integer')
  t.throws(fn([ false ], {}), pathErr, 'throws when path contains false')
  t.throws(fn([ true ], {}), pathErr, 'throws when path contains true')
  t.throws(fn([ unit ], {}), pathErr, 'throws when path contains a function')
  t.throws(fn([ {} ], {}), pathErr, 'throws when path contains an object')
  t.throws(fn([ [] ], {}), pathErr, 'throws when path contains an array')

  t.end()
})

test('unsetPath with objects', t => {
  t.same(
    unsetPath([ 'a', 'b' ], { a: { b: 1, c: true } }),
    { a: { c: true } },
    'removes end of path when it exists'
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
    'does not modify when path end does not exist'
  )

  t.same(
    unsetPath([ 'a', 0 ], { a: { b: false } }),
    { a: { b: false } },
    'does not modify when path end is an object, but referenced with integer'
  )

  const f = a => unsetPath([ 'a', 'b' ], { a })

  const testNaN = x =>
    Object.keys(x).length === 1 && isNaN(x['a'])

  t.same(f(undefined), { a: undefined }, 'returns { a: undefined } with undefined in target path')
  t.same(f(null), { a: null }, 'returns { a: null } with null in target path')
  t.ok(testNaN(f(NaN)), 'returns { a: NaN } with NaN in tartget path')
  t.same(f(0), { a: 0 }, 'returns { a: 0 } with falsey number in target path')
  t.same(f(1), { a: 1 }, 'returns { a: 1  }with truthy number in target path')
  t.same(f(''), { a: '' }, 'returns { a: \'\' } with falsey string in target path')
  t.same(f('string'), { a: 'string' }, 'returns { a: \'string\' } with truthy string in target path')
  t.same(f(false), { a: false }, 'returns { a: false } with false in target path')
  t.same(f(true), { a: true }, 'returns { a: true } with true in target path')

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

  t.same(
    unsetPath([ 0, '1' ], [ [ 1, 2 ], 3 ]),
    [ [ 1, 2 ], 3 ],
    'does not modify when path end is an array, but referenced with string'
  )

  const f = x => unsetPath([ 0, 'a' ], [ x ])

  const testNaN = x =>
    x.length === 1 && isNaN(x[0])

  t.same(f(undefined), [ undefined ], 'returns [ undefined ] with undefined in target path')
  t.same(f(null), [ null ], 'returns [ null ] with null in target path')
  t.ok(testNaN(f(NaN)), 'returns [ NaN ] with NaN in target path')
  t.same(f(0), [ 0 ], 'returns [ 0 ] with falsey number in target path')
  t.same(f(1), [ 1 ], 'returns [ 1 ] with truthy number in target path')
  t.same(f(''), [ '' ], 'returns [ \'\' ] with falsey string in target path')
  t.same(f('string'), [ 'string' ], 'returns [ \'string\' ] with truthy string in target path')
  t.same(f(false), [ false ], 'returns [ false ] with false in target path')
  t.same(f(true), [ true ], 'returns [ true ] with true in target path')

  t.end()
})

test('unsetPath without arrays or objects at head', t => {
  const f = x => unsetPath([ 1, 0 ], x)

  t.equal(f(undefined), undefined, 'returns undefined with undefined')
  t.equal(f(null), null, 'returns null with null')
  t.ok(isNaN(f(NaN)), 'returns NaN with NaN')
  t.equal(f(0), 0, 'returns falsey number with falsey number')
  t.equal(f(1), 1, 'returns truthy number with truthy number')
  t.equal(f(''), '', 'returns falsey string with string')
  t.equal(f('string'), 'string', 'returns truthy string with string')
  t.equal(f(false), false, 'returns false with false')
  t.equal(f(true), true, 'returns true with true')

  t.end()
})
