const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const identity = require('../combinators/identity')
const isFunction = require('../predicates/isFunction')
const unit = require('../helpers/unit')

const mock = x => Object.assign({}, x, { map: unit })

const extend = require('./extend')

test('extend pointfree', t => {
  const a = bindFunc(extend)
  const m = mock({ extend: identity })

  t.ok(isFunction(extend), 'is a function')

  const noFunc = /extend: Function required for first argument/
  t.throws(a(undefined, m), noFunc, 'throws if first arg is undefined')
  t.throws(a(null, m), noFunc, 'throws if first arg is null')
  t.throws(a(0, m), noFunc, 'throws if first arg is a falsey number')
  t.throws(a(1, m), noFunc, 'throws if first arg is a truthy number')
  t.throws(a('', m), noFunc, 'throws if first arg is a falsey string')
  t.throws(a('string', m), noFunc, 'throws if first arg is a truthy string')
  t.throws(a(false, m), noFunc, 'throws if first arg is false')
  t.throws(a(true, m), noFunc, 'throws if first arg is true')
  t.throws(a([], m), noFunc, 'throws if first arg is an array')
  t.throws(a({}, m), noFunc, 'throws if first arg is an object')

  const noExtend = /extend: Extend required for second argument/
  t.throws(a(identity, undefined), noExtend, 'throws if second arg is undefined')
  t.throws(a(identity, null), noExtend, 'throws if second arg is null')
  t.throws(a(identity, 0), noExtend, 'throws if second arg is a falsey number')
  t.throws(a(identity, 1), noExtend, 'throws if second arg is a truthy number')
  t.throws(a(identity, ''), noExtend, 'throws if second arg is a falsey string')
  t.throws(a(identity, 'string'), noExtend, 'throws if second arg is a truthy string')
  t.throws(a(identity, false), noExtend, 'throws if second arg is false')
  t.throws(a(identity, true), noExtend, 'throws if second arg is true')
  t.throws(a(identity, []), noExtend, 'throws if second arg is an array')
  t.throws(a(identity, {}), noExtend, 'throws if second arg is an object')

  t.end()
})

test('extend with Extend', t => {
  const f = identity
  const m = mock({ extend: sinon.spy(identity) })

  extend(f, m)

  t.ok(m.extend.calledWith(f), 'calls the extend function on the second arg passing in the first arg')

  t.end()
})
