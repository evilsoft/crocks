const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../helpers/unit')

const isFunction = require('../predicates/isFunction')

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')

const mock = x => Object.assign({}, x, {
  map: unit, of: unit, chain: unit, type: constant('silly')
})

const ap = require('./ap')

test('ap pointfree', t => {
  const a = bindFunc(ap)
  const m = mock({ ap: identity })

  t.ok(isFunction(ap), 'is a function')

  const sameType = /ap: Both arguments must be Applys of the same type/
  t.throws(a(undefined, m), sameType, 'throws if first arg is undefined')
  t.throws(a(null, m), sameType, 'throws if first arg is null')
  t.throws(a(0, m), sameType, 'throws if first arg is a falsey number')
  t.throws(a(1, m), sameType, 'throws if first arg is a truthy number')
  t.throws(a('', m), sameType, 'throws if first arg is a falsey string')
  t.throws(a('string', m), sameType, 'throws if first arg is a truthy string')
  t.throws(a(false, m), sameType, 'throws if first arg is false')
  t.throws(a(true, m), sameType, 'throws if first arg is true')
  t.throws(a([], m), sameType, 'throws if first arg is an empty array')
  t.throws(a({}, m), sameType, 'throws if first arg is an object without an ap method')

  t.throws(a(m, undefined), sameType, 'throws if second arg is undefined')
  t.throws(a(m, null), sameType, 'throws if second arg is null')
  t.throws(a(m, 0), sameType, 'throws if second arg is a falsey number')
  t.throws(a(m, 1), sameType, 'throws if second arg is a truthy number')
  t.throws(a(m, ''), sameType, 'throws if second arg is a falsey string')
  t.throws(a(m, 'string'), sameType, 'throws if second arg is a truthy string')
  t.throws(a(m, false), sameType, 'throws if second arg is false')
  t.throws(a(m, true), sameType, 'throws if second arg is true')
  t.throws(a(m, []), sameType, 'throws if second arg is an array')
  t.throws(a(m, {}), sameType, 'throws if second arg is an object without an ap method')

  const noFuncs = /ap: Second Array must all be functions/
  t.throws(a([ 2 ], []), noFuncs, 'throws if second array is empty')
  t.throws(a([ 2 ], [ 2, 3 ]), noFuncs, 'throws if second array contains no functions')
  t.throws(a([ 2 ], [ identity, 3 ]), noFuncs, 'throws if second is not all functions')

  t.end()
})

test('ap applicative', t => {
  const m = mock({ ap: sinon.spy(identity) })
  const x = mock({ ap: sinon.spy(identity) })

  ap(m, x)

  t.ok(x.ap.calledWith(m), 'calls the ap method on the second arg passing in the first arg')

  t.end()
})

test('ap array', t => {
  const f = x => x + 2
  const g = x => x + 1

  const funcs = [ f, g ]
  const values = [ 1 , 2 ]

  const result = ap(values, funcs)

  t.same(result, [ 3, 4, 2, 3 ], 'applies functions to values as expected')

  t.end()
})
