const test = require('tape')
const helpers = require('../test/helpers')
const MockCrock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const liftN = require('./liftN')

test('liftN errors', t => {
  const fn = bindFunc(liftN)
  const m1 = MockCrock(4)

  const add =
    x => y => x + y

  const noInt = /liftN: Integer required for first argument/
  t.throws(fn(undefined, add), noInt, 'throws when first arg is undefined')
  t.throws(fn(null, add), noInt, 'throws when first arg is null')
  t.throws(fn('', add), noInt, 'throws when first arg is falsey string')
  t.throws(fn('string', add), noInt, 'throws when first arg is truthy string')
  t.throws(fn(false, add), noInt, 'throws when first arg is false')
  t.throws(fn(true, add), noInt, 'throws when first arg is true')
  t.throws(fn({}, add), noInt, 'throws when first arg is an object')
  t.throws(fn([], add), noInt, 'throws when first arg is an array')
  t.throws(fn(add, add), noInt, 'throws when first arg is a function')

  const noFunc = /liftN: Function required for second argument/
  t.throws(fn(2, undefined), noFunc, 'throws when second arg is undefined')
  t.throws(fn(2, null), noFunc, 'throws when second arg is null')
  t.throws(fn(2, 0), noFunc, 'throws when second arg is falsey number')
  t.throws(fn(2, 1), noFunc, 'throws when second arg is truthy number')
  t.throws(fn(2, ''), noFunc, 'throws when second arg is falsey string')
  t.throws(fn(2, 'string'), noFunc, 'throws when second arg is truthy string')
  t.throws(fn(2, false), noFunc, 'throws when second arg is false')
  t.throws(fn(2, true), noFunc, 'throws when second arg is true')
  t.throws(fn(2, {}), noFunc, 'throws when second arg is an object')
  t.throws(fn(2, []), noFunc, 'throws when second arg is an array')

  const noAp = /liftN: Applys of same type are required/
  t.throws(fn(2, add, undefined, m1), noAp, 'throws when first applicative is undefined')
  t.throws(fn(2, add, null, m1), noAp, 'throws when first applicative is null')
  t.throws(fn(2, add, 0, m1), noAp, 'throws when first applicative is falsey number')
  t.throws(fn(2, add, 1, m1), noAp, 'throws when first applicative is truthy number')
  t.throws(fn(2, add, '', m1), noAp, 'throws when first applicative is falsey string')
  t.throws(fn(2, add, 'string', m1), noAp, 'throws when first applicative is truthy string')
  t.throws(fn(2, add, false, m1), noAp, 'throws when first applicative is false')
  t.throws(fn(2, add, true, m1), noAp, 'throws when first applicative is true')
  t.throws(fn(2, add, {}, m1), noAp, 'throws when first applicative is an object')

  t.throws(fn(2, add, m1, undefined), noAp, 'throws when subsequent applicatives are undefined')
  t.throws(fn(2, add, m1, null), noAp, 'throws when subsequent applicatives are null')
  t.throws(fn(2, add, m1, 0), noAp, 'throws when subsequent applicatives are falsey number')
  t.throws(fn(2, add, m1, 1), noAp, 'throws when subsequent applicatives are truthy number')
  t.throws(fn(2, add, m1, ''), noAp, 'throws when subsequent applicatives are falsey string')
  t.throws(fn(2, add, m1, 'string'), noAp, 'throws when subsequent applicatives are truthy string')
  t.throws(fn(2, add, m1, false), noAp, 'throws when subsequent applicatives are false')
  t.throws(fn(2, add, m1, true), noAp, 'throws when subsequent applicatives are true')
  t.throws(fn(2, add, m1, {}), noAp, 'throws when subsequent applicatives are an object')

  t.throws(fn(2, add, m1, []), noAp, 'throws when applicatives differ')

  t.end()
})

test('liftN', t => {
  const m1 = MockCrock(4)
  const m2 = MockCrock(7)

  const add = (x, y) => x + y
  const fn = liftN(2, add)

  t.ok(isFunction(liftN), 'is a function')
  t.ok(isFunction(fn), 'returns a function')

  t.ok(isSameType(MockCrock, fn(m1, m2)), 'returns the underlying applicative')
  t.equals(fn(m1, m2).valueOf(), 11, 'provides the result of appying the function')

  t.ok(isSameType(Array, fn([ 4 ], [ 7 ])), 'returns the underlying applicative')
  t.same(fn([ 4 ], [ 7 ]), [ 11 ], 'provides the result of appying the function')

  t.end()
})

test('liftN auto-curry', t => {
  const fn = liftN(3)

  const many = fn((...args) => args.reduce((x, y) => x + y, 0))
  const normal = fn((x, y, z) => x + y + z)
  const builtin = fn(Math.max)

  const a = [ 1 ]
  const b = [ 2 ]
  const c = [ 3 ]

  t.same(many(a, b, c), [ 6 ], 'applys many as normal')
  t.same(many(a)(b)(c), [ 6 ], 'applys many as curried')
  t.same(many(a)(b, c), [ 6 ], 'applys many as partial curried')

  t.same(normal(a, b, c), [ 6 ], 'applys normal as normal')
  t.same(normal(a)(b)(c), [ 6 ], 'applys normal as curried')
  t.same(normal(a)(b, c), [ 6 ], 'applys normal as partial curried')

  t.same(builtin(a, b, c), [ 3 ], 'applys builtin as normal')
  t.same(builtin(a)(b)(c), [ 3 ], 'applys builtin as curried')
  t.same(builtin(a)(b, c), [ 3 ], 'applys builtin as partial curried')

  t.end()
})
