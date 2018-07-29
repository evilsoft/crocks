import test from 'tape'
import { spy } from 'sinon'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'
import unit from '../core/_unit'

const constant = x => () => x
const identity = x => x

import foldMap from './foldMap'

test('fold pointfree errors', t => {
  const fn = bindFunc(x => foldMap(x, [ 1 ]))

  const noFunc = /^TypeError: foldMap: Function returning Semigroups of the same type required for first argument/
  t.throws(fn(undefined), noFunc, 'throws when passed undefined')
  t.throws(fn(null), noFunc, 'throws when passed null')
  t.throws(fn(0), noFunc, 'throws when passed falsey number')
  t.throws(fn(1), noFunc, 'throws when passed truthy number')
  t.throws(fn(''), noFunc, 'throws when passed falsey string')
  t.throws(fn('string'), noFunc, 'throws when passed truthy string')
  t.throws(fn(false), noFunc, 'throws when passed false')
  t.throws(fn(true), noFunc, 'throws when passed true')
  t.throws(fn({}), noFunc, 'throws when passed an object')
  t.throws(fn([]), noFunc, 'throws when passed an array')

  const m = bindFunc(x => foldMap(identity, x))

  const noFold = /^TypeError: foldMap: Non-empty Foldable with at least one Semigroup required for second argument/
  t.throws(m(undefined), noFold, 'throws when passed undefined')
  t.throws(m(null), noFold, 'throws when passed null')
  t.throws(m(0), noFold, 'throws when passed falsey number')
  t.throws(m(1), noFold, 'throws when passed truthy number')
  t.throws(m(''), noFold, 'throws when passed falsey string')
  t.throws(m('string'), noFold, 'throws when passed truthy string')
  t.throws(m(false), noFold, 'throws when passed false')
  t.throws(m(true), noFold, 'throws when passed true')
  t.throws(m({}), noFold, 'throws when passed an object')
  t.throws(m(unit), noFold, 'throws when passed a function')

  t.end()
})

test('fold pointfree', t => {
  const x = 'folded'
  const m = { foldMap: spy(constant(x)) }

  t.ok(isFunction(foldMap), 'is a function')

  const result = foldMap(identity, m)

  t.ok(m.foldMap.called, 'calls foldMap on the foldable')
  t.equals(result, x, 'returns the result of calling foldMap on container')

  const arr = foldMap(identity, [ x ])
  t.equals(arr, x, 'returns the result of calling foldMap on an array')

  t.end()
})
