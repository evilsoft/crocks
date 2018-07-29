import test from 'tape'
import { bindFunc } from '../test/helpers'

import Pair from '../core/Pair'
import isObject from '../core/isObject'
import unit from '../core/_unit'

import fromPairs from './fromPairs'

test('fromPairs', t => {
  const fn = bindFunc(fromPairs)

  const noFold = /fromPairs: Foldable of Pairs required for argument/
  t.throws(fn(undefined), noFold, 'throws when argument is undefined')
  t.throws(fn(null), noFold, 'throws when argument is null')
  t.throws(fn(0), noFold, 'throws when argument is a falsey number')
  t.throws(fn(1), noFold, 'throws when argument is a truthy number')
  t.throws(fn(''), noFold, 'throws when argument is a falsey string')
  t.throws(fn('string'), noFold, 'throws when argument is a truthy string')
  t.throws(fn(false), noFold, 'throws when argument is false')
  t.throws(fn(true), noFold, 'throws when argument is true')
  t.throws(fn(unit), noFold, 'throws when argument is a function')
  t.throws(fn({}), noFold, 'throws when argument is an object')

  t.throws(fn([ undefined ]), noFold, 'throws when argument contains undefined')
  t.throws(fn([ null ]), noFold, 'throws when argument contains null')
  t.throws(fn([ 0 ]), noFold, 'throws when argument contains a falsey number')
  t.throws(fn([ 1 ]), noFold, 'throws when argument contains a truthy number')
  t.throws(fn([ '' ]), noFold, 'throws when argument contains a falsey string')
  t.throws(fn([ 'string' ]), noFold, 'throws when argument contains a truthy string')
  t.throws(fn([ false ]), noFold, 'throws when argument contains false')
  t.throws(fn([ true ]), noFold, 'throws when argument contains true')
  t.throws(fn([ unit ]), noFold, 'throws when argument contains a function')
  t.throws(fn([ {} ]), noFold, 'throws when argument contains an object')

  const buildPair =
    x => fn([ Pair(x, 0) ])

  const noString  = /fromPairs: String required for fst of every Pair/
  t.throws(buildPair(undefined), noString, 'throws when fst of Pair is undefined')
  t.throws(buildPair(null), noString, 'throws when fst of Pair is null')
  t.throws(buildPair(0), noString, 'throws when fst of Pair is a falsey number')
  t.throws(buildPair(1), noString, 'throws when fst of Pair is a truthy number')
  t.throws(buildPair(false), noString, 'throws when fst of Pair is false')
  t.throws(buildPair(true), noString, 'throws when fst of Pair is true')
  t.throws(buildPair(unit), noString, 'throws when fst of Pair is a function')
  t.throws(buildPair({}), noString, 'throws when fst of Pair is an object')
  t.throws(buildPair([]), noString, 'throws when fst of Pair is an object')

  const data = [
    Pair('undef', undefined),
    Pair('nil', null),
    Pair('falseNumber', 0),
    Pair('trueNumber', 1),
    Pair('falseString', ''),
    Pair('trueString', 'string'),
    Pair('falseBoolean', false),
    Pair('trueBoolean', true),
    Pair('obj', {}),
    Pair('array', [])
  ]

  const result = fromPairs(data)
  const keys = Object.keys(result)
  const hasKey = key => keys.indexOf(key) !== -1
  const getValue = key => result[key]

  t.ok(isObject(result), 'returns an object')

  t.notOk(hasKey('undef'), 'does not include keys with an undefined value')
  t.ok(hasKey('nil'), 'includes keys with a null value')
  t.ok(hasKey('falseNumber'), 'includes keys with a falsey number value')
  t.ok(hasKey('trueNumber'), 'includes keys with a truthy number value')
  t.ok(hasKey('falseString'), 'includes keys with a falsey string value')
  t.ok(hasKey('trueString'), 'includes keys with a truthy string value')
  t.ok(hasKey('falseBoolean'), 'includes keys with a false value')
  t.ok(hasKey('trueBoolean'), 'includes keys with a true value')
  t.ok(hasKey('obj'), 'includes keys with an object value')
  t.ok(hasKey('array'), 'includes keys with an array value')

  t.equals(getValue('nil'), null, 'includes null values')
  t.equals(getValue('falseNumber'), 0, 'includes falsey number values')
  t.equals(getValue('trueNumber'), 1, 'includes truthy number values')
  t.equals(getValue('falseString'), '', 'includes falsey string values')
  t.equals(getValue('trueString'), 'string', 'includes truthy string values')
  t.equals(getValue('falseBoolean'), false, 'includes false values')
  t.equals(getValue('trueBoolean'), true, 'includes true values')
  t.same(getValue('obj'), {}, 'includes object values')
  t.same(getValue('array'), [], 'includes array values')

  t.end()
})
