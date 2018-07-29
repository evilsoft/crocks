import test from 'tape'
import { bindFunc } from '../test/helpers'
import MockCrock from '../test/MockCrock'



import isFunction from '../core/isFunction'

const identity = x => x

import liftA2 from './liftA2'

test('liftA2', t => {
  const fn = bindFunc(liftA2)
  const m1 = MockCrock(4)
  const m2 = MockCrock(8)

  const add = x => y => x + y

  t.ok(isFunction(liftA2), 'is a function')

  const noFunc = /liftA2: Function required for first argument/
  t.throws(fn(undefined, m1, m2), noFunc, 'throws when first arg is undefined')
  t.throws(fn(null, m1, m2), noFunc, 'throws when first arg is null')
  t.throws(fn(0, m1, m2), noFunc, 'throws when first arg is falsey number')
  t.throws(fn(1, m1, m2), noFunc, 'throws when first arg is truthy number')
  t.throws(fn('', m1, m2), noFunc, 'throws when first arg is falsey string')
  t.throws(fn('string', m1, m2), noFunc, 'throws when first arg is truthy string')
  t.throws(fn(false, m1, m2), noFunc, 'throws when first arg is false')
  t.throws(fn(true, m1, m2), noFunc, 'throws when first arg is true')
  t.throws(fn({}, m1, m2), noFunc, 'throws when first arg is an object')
  t.throws(fn([], m1, m2), noFunc, 'throws when first arg is an array')

  const noApply = /liftA2: Applys of same type required for last two arguments/
  t.throws(fn(add, undefined, m2), noApply, 'throws when second arg is undefined')
  t.throws(fn(add, null, m2), noApply, 'throws when second arg is null')
  t.throws(fn(add, 0, m2), noApply, 'throws when second arg is falsey number')
  t.throws(fn(add, 1, m2), noApply, 'throws when second arg is truthy number')
  t.throws(fn(add, '', m2), noApply, 'throws when second arg is falsey string')
  t.throws(fn(add, 'string', m2), noApply, 'throws when second arg is truthy string')
  t.throws(fn(add, false, m2), noApply, 'throws when second arg is false')
  t.throws(fn(add, true, m2), noApply, 'throws when second arg is true')
  t.throws(fn(add, {}, m2), noApply, 'throws when second arg is an object')
  t.throws(fn(add, [], m2), noApply, 'throws when second arg is an array')
  t.throws(fn(add, identity, m2), noApply, 'throws when second arg is function')

  t.throws(fn(add, m1, undefined), noApply, 'throws when third arg is undefined')
  t.throws(fn(add, m1, null), noApply, 'throws when third arg is null')
  t.throws(fn(add, m1, 0), noApply, 'throws when third arg is falsey number')
  t.throws(fn(add, m1, 1), noApply, 'throws when third arg is truthy number')
  t.throws(fn(add, m1, ''), noApply, 'throws when third arg is falsey string')
  t.throws(fn(add, m1, 'string'), noApply, 'throws when third arg is truthy string')
  t.throws(fn(add, m1, false), noApply, 'throws when third arg is false')
  t.throws(fn(add, m1, true), noApply, 'throws when third arg is true')
  t.throws(fn(add, m1, {}), noApply, 'throws when third arg is an object')
  t.throws(fn(add, m1, []), noApply, 'throws when third arg is an array')
  t.throws(fn(add, m1, identity), noApply, 'throws when third arg is function')

  const notSame = /liftA2: Applys of same type required for last two arguments/
  t.throws(fn(add, [], m2), notSame, 'throws when first is not the same apply')
  t.throws(fn(add, m1, []), notSame, 'throws when second is not the same apply')

  const result = liftA2(add, m1, m2)

  t.equal(result.type(), m1.type(), 'returns an Apply of the same type of second argument')
  t.ok(result.equals(MockCrock(12)), '4 + 8 === 12, result === 12')

  t.end()
})

test('liftA2 arrays', t => {
  const add = x => y => x + y
  const f = liftA2(add)

  t.same(f([ 1 ], [ 2 ]), [ 3 ], 'applys single element lists')
  t.same(f([ 1, 2 ], [ 3, 4 ]), [ 4, 5, 5, 6 ], 'applys multi element lists')
  t.same(f([ 1, 2 ], []), [], 'returns empty when third arg is empty array')

  t.end()
})
