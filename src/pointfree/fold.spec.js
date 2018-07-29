import test from 'tape'
import sinon from 'sinon'
import { bindFunc } from '../test/helpers'

import isFunction from '../core/isFunction'
import unit from '../core/_unit'

const constant = x => () => x

import fold from './fold'

test('fold pointfree errors', t => {
  const f = bindFunc(fold)

  t.ok(isFunction(fold), 'is a function')

  const noFold = /^TypeError: fold: Non-empty Foldable with at least one Semigroup is required/
  t.throws(f(undefined), noFold, 'throws when passed undefined')
  t.throws(f(null), noFold, 'throws when passed null')
  t.throws(f(0), noFold, 'throws when passed falsey number')
  t.throws(f(1), noFold, 'throws when passed truthy number')
  t.throws(f(''), noFold, 'throws when passed falsey string')
  t.throws(f('string'), noFold, 'throws when passed truthy string')
  t.throws(f(false), noFold, 'throws when passed false')
  t.throws(f(true), noFold, 'throws when passed true')
  t.throws(f({}), noFold, 'throws when passed an object')
  t.throws(f(unit), noFold, 'throws when passed a function')

  t.end()
})

test('fold pointfree', t => {
  const x = 'folded'
  const m = { fold: sinon.spy(constant(x)) }

  const result = fold(m)

  t.ok(m.fold.called, 'calls fold on the foldable')
  t.equals(result, x, 'returns the result of calling fold on container')

  const arr = fold([ x ])
  t.equals(arr, x, 'returns the result of calling fold on an array')

  t.end()
})
