const test = require('tape')
const sinon = require('sinon')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const constant = require('../core/constant')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const fold = require('./fold')

test('fold pointfree errors', t => {
  const f = bindFunc(fold)

  t.ok(isFunction(fold), 'is a function')

  const noFold = /fold: Non-empty Foldable with at least one Semigroup is required/
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
  t.throws(f([]), noFold, 'throws when passed an empty array')

  const noSemi = /fold: Foldable must contain Semigroups of the same type/
  t.throws(f([ 0 ]), noSemi, 'throws when passed a single element array with no semigroup')

  const notSame = /fold: Foldable must contain Semigroups of the same type/
  t.throws(f([ '', 0 ]), notSame, 'throws when not elements are semigroups')
  t.throws(f([ '', [] ]), notSame, 'throws when different semigroups')

  t.end()
})

test('fold pointfree array', t => {
  t.same(fold([ [ 1 ], [ 2 ] ]), [ 1, 2 ], 'combines and extracts semigroups')
  t.same(fold([ 'happy' ]), 'happy', 'extracts a single semigroup')

  t.end()
})

test('fold pointfree foldable', t => {
  const x = 'folded'
  const m = { fold: sinon.spy(constant(x)) }

  const result = fold(m)

  t.ok(m.fold.called, 'calls fold on the ')
  t.equals(result, x, 'returns the result of calling fold on container')

  t.end()
})
