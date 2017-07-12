const test = require('tape')
const MockCrock = require('../../test/MockCrock')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const identity = require('../core/identity')
const isFunction = require('../core/isFunction')

const liftA3 = require('./liftA3')

test('liftA3', t => {
  const fn = bindFunc(liftA3)
  const m1 = MockCrock(23)
  const m2 = MockCrock(5)
  const m3 = MockCrock(19)

  const add = x => y => z => x + y + z

  t.ok(isFunction(liftA3), 'is a function')

  const noFunc = /liftA3: Function required for first argument/
  t.throws(fn(undefined, m1, m2, m3), noFunc, 'throws when first arg is undefined')
  t.throws(fn(null, m1, m2, m3), noFunc, 'throws when first arg is null')
  t.throws(fn(0, m1, m2, m3), noFunc, 'throws when first arg is falsey number')
  t.throws(fn(1, m1, m2, m3), noFunc, 'throws when first arg is truthy number')
  t.throws(fn('', m1, m2, m3), noFunc, 'throws when first arg is falsey string')
  t.throws(fn('string', m1, m2, m3), noFunc, 'throws when first arg is truthy string')
  t.throws(fn(false, m1, m2, m3), noFunc, 'throws when first arg is false')
  t.throws(fn(true, m1, m2, m3), noFunc, 'throws when first arg is true')
  t.throws(fn({}, m1, m2, m3), noFunc, 'throws when first arg is an object')
  t.throws(fn([], m1, m2, m3), noFunc, 'throws when first arg is an array')

  const noApply = /liftA3: Applys of same type required for last three arguments/
  t.throws(fn(add, undefined, m2, m3), noApply, 'throws when second arg is undefined')
  t.throws(fn(add, null, m2, m3), noApply, 'throws when second arg is null')
  t.throws(fn(add, 0, m2, m3), noApply, 'throws when second arg is falsey number')
  t.throws(fn(add, 1, m2, m3), noApply, 'throws when second arg is truthy number')
  t.throws(fn(add, '', m2, m3), noApply, 'throws when second arg is falsey string')
  t.throws(fn(add, 'string', m2, m3), noApply, 'throws when second arg is truthy string')
  t.throws(fn(add, false, m2, m3), noApply, 'throws when second arg is false')
  t.throws(fn(add, true, m2, m3), noApply, 'throws when second arg is true')
  t.throws(fn(add, {}, m2, m3), noApply, 'throws when second arg is an object')
  t.throws(fn(add, [], m2, m3), noApply, 'throws when second arg is an array')
  t.throws(fn(add, identity, m2, m3), noApply, 'throws when second arg is function')

  t.throws(fn(add, m1, undefined, m3), noApply, 'throws when third arg is undefined')
  t.throws(fn(add, m1, null, m3), noApply, 'throws when third arg is null')
  t.throws(fn(add, m1, 0, m3), noApply, 'throws when third arg is falsey number')
  t.throws(fn(add, m1, 1, m3), noApply, 'throws when third arg is truthy number')
  t.throws(fn(add, m1, '', m3), noApply, 'throws when third arg is falsey string')
  t.throws(fn(add, m1, 'string', m3), noApply, 'throws when third arg is truthy string')
  t.throws(fn(add, m1, false, m3), noApply, 'throws when third arg is false')
  t.throws(fn(add, m1, true, m3), noApply, 'throws when third arg is true')
  t.throws(fn(add, m1, {}, m3), noApply, 'throws when third arg is an object')
  t.throws(fn(add, m1, [], m3), noApply, 'throws when third arg is an array')
  t.throws(fn(add, m1, identity, m3), noApply, 'throws when third arg is function')

  t.throws(fn(add, m1, m2, undefined), noApply, 'throws when fourth arg is undefined')
  t.throws(fn(add, m1, m2, null), noApply, 'throws when fourth arg is null')
  t.throws(fn(add, m1, m2, 0), noApply, 'throws when fourth arg is falsey number')
  t.throws(fn(add, m1, m2, 1), noApply, 'throws when fourth arg is truthy number')
  t.throws(fn(add, m1, m2, ''), noApply, 'throws when fourth arg is falsey string')
  t.throws(fn(add, m1, m2, 'string'), noApply, 'throws when fourth arg is truthy string')
  t.throws(fn(add, m1, m2, false), noApply, 'throws when fourth arg is false')
  t.throws(fn(add, m1, m2, true), noApply, 'throws when fourth arg is true')
  t.throws(fn(add, m1, m2, {}), noApply, 'throws when fourth arg is an object')
  t.throws(fn(add, m1, m2, []), noApply, 'throws when fourth arg is an array')
  t.throws(fn(add, m1, m2, identity), noApply, 'throws when fourth arg is function')

  const notSame = /liftA3: Applys of same type required for last three arguments/
  t.throws(fn(add, [], m2, m3), notSame, 'throws when first is not the same apply')
  t.throws(fn(add, m1, [], m3), notSame, 'throws when second is not the same apply')
  t.throws(fn(add, m1, m2, []), notSame, 'throws when third is not the same apply')

  const result = liftA3(add, m1, m2, m3)

  t.equal(result.type(), m1.type(), 'returns an Apply of the same type of second argument')
  t.ok(result.equals(MockCrock(47)), '23 + 5 + 19 === 47, result === 12')

  t.end()
})

test('liftA3 arrays', t => {
  const add = x => y => z => x + y + z
  const f = liftA3(add)

  t.same(f([ 1 ], [ 2 ], [ 3 ]), [ 6 ], 'applys single element lists')
  t.same(f([ 1, 2 ], [ 3, 4 ], [ 5, 6 ]), [ 9, 10, 10, 11, 10, 11, 11, 12 ], 'applys multi element lists')
  t.same(f([ 1, 2 ], [ 3 ], []), [], 'returns empty when fourth arg is empty array')

  t.end()
})
