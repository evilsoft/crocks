import test from 'tape'

import isFunction from '../core/isFunction'
import MockCrock from '../test/MockCrock'

import equals from './equals'

test('equals pointfree', t => {
  t.ok(isFunction(equals, 'is a function'))

  t.end()
})

test('equals pointfree with primatives', t => {
  t.equals(equals(true, true), true, 'returns true when (2) booleans match')
  t.equals(equals(true, false), false, 'returns false when (2) booleans do not match')

  t.equals(equals('', ''), true, 'returns true when (2) strings match')
  t.equals(equals('string', ''), false, 'returns false when (2) strings do not match')

  t.equals(equals(2, 2), true, 'returns true when (2) numbers match')
  t.equals(equals(0, 20), false, 'returns false when (2) numbers do not match')

  t.equals(
    equals([ 1, 2 ], [ 1, 2 ]),
    true,
    'returns true when (2) arrays values match'
  )

  t.equals(
    equals([ 1, 2 ], [ 2, 1 ]),
    false,
    'returns false when (2) arrays values do not match'
  )

  t.equals(
    equals({ a: true }, { a: true }),
    true,
    'returns true when (2) object keys/values match'
  )

  t.equals(
    equals({ a: true }, { a: true, b: 43 }),
    false,
    'returns false when (2) object keys/values do not match'
  )

  t.end()
})

test('equals pointfree with adts', t => {
  const a = MockCrock({ nice: true })
  const b = MockCrock({ nice: true })
  const c = MockCrock('wot m8')

  t.equals(equals(a, b), true, 'returns true when adts are equal')
  t.equals(equals(a, c), false, 'returns false when adts are not equal')

  t.end()
})
