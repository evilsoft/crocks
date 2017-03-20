const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')

const mock = x => Object.assign({}, x, {
  map: noop, of: noop, chain: noop, type: constant('silly')
})

const ap = require('./ap')

test('ap pointfree', t => {
  const a = bindFunc(ap)
  const m = mock({ ap: identity })

  t.ok(isFunction(ap), 'is a function')

  t.throws(a(undefined, m), TypeError, 'throws if first arg is undefined')
  t.throws(a(null, m), TypeError, 'throws if first arg is null')
  t.throws(a(0, m), TypeError, 'throws if first arg is a falsey number')
  t.throws(a(1, m), TypeError, 'throws if first arg is a truthy number')
  t.throws(a('', m), TypeError, 'throws if first arg is a falsey string')
  t.throws(a('string', m), TypeError, 'throws if first arg is a truthy string')
  t.throws(a(false, m), TypeError, 'throws if first arg is false')
  t.throws(a(true, m), TypeError, 'throws if first arg is true')
  t.throws(a([], m), TypeError, 'throws if first arg is an array')
  t.throws(a({}, m), TypeError, 'throws if first arg is an object without an ap method')

  t.throws(a(m, undefined), TypeError, 'throws if second arg is undefined')
  t.throws(a(m, null), TypeError, 'throws if second arg is null')
  t.throws(a(m, 0), TypeError, 'throws if second arg is a falsey number')
  t.throws(a(m, 1), TypeError, 'throws if second arg is a truthy number')
  t.throws(a(m, ''), TypeError, 'throws if second arg is a falsey string')
  t.throws(a(m, 'string'), TypeError, 'throws if second arg is a truthy string')
  t.throws(a(m, false), TypeError, 'throws if second arg is false')
  t.throws(a(m, true), TypeError, 'throws if second arg is true')
  t.throws(a(m, []), TypeError, 'throws if second arg is an array')
  t.throws(a(m, {}), TypeError, 'throws if second arg is an object without an ap method')

  t.end()
})

test('ap applicative', t => {
  const m = mock({ ap: sinon.spy(identity) })
  const x = mock({ ap: sinon.spy(identity) })

  ap(m, x)

  t.ok(x.ap.calledWith(m), 'calls the ap method on the second arg passing in the first arg')

  t.end()
})
