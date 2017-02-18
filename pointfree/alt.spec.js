const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')

const mock = x => Object.assign({}, x, {
  map: noop, type: constant('silly')
})

const alt = require('./alt')

test('alt pointfree', t => {
  const a = bindFunc(alt)
  const m = mock({ alt: identity })

  t.ok(isFunction(alt), 'is a function')

  t.throws(a(undefined, m), TypeError, 'throws if first arg is undefined')
  t.throws(a(null, m), TypeError, 'throws if first arg is null')
  t.throws(a(0, m), TypeError, 'throws if first arg is a falsey number')
  t.throws(a(1, m), TypeError, 'throws if first arg is a truthy number')
  t.throws(a('', m), TypeError, 'throws if first arg is a falsey string')
  t.throws(a('string', m), TypeError, 'throws if first arg is a truthy string')
  t.throws(a(false, m), TypeError, 'throws if first arg is false')
  t.throws(a(true, m), TypeError, 'throws if first arg is true')
  t.throws(a([], m), TypeError, 'throws if first arg is an array')
  t.throws(a({}, m), TypeError, 'throws if first arg is an object')

  t.throws(a(m, undefined), TypeError, 'throws if second arg is undefined')
  t.throws(a(m, null), TypeError, 'throws if second arg is null')
  t.throws(a(m, 0), TypeError, 'throws if second arg is a falsey number')
  t.throws(a(m, 1), TypeError, 'throws if second arg is a truthy number')
  t.throws(a(m, ''), TypeError, 'throws if second arg is a falsey string')
  t.throws(a(m, 'string'), TypeError, 'throws if second arg is a truthy string')
  t.throws(a(m, false), TypeError, 'throws if second arg is false')
  t.throws(a(m, true), TypeError, 'throws if second arg is true')
  t.throws(a(m, []), TypeError, 'throws if second arg is an array')
  t.throws(a(m, {}), TypeError, 'throws if second arg is an object')

  t.end()
})

test('alt with Alt', t => {
  const m = mock({ alt: sinon.spy(identity) })
  const x = mock({ alt: sinon.spy(identity) })

  const result = alt(m)(x)

  t.ok(x.alt.calledWith(m), 'calls the alt function on the second arg passing in the first arg')

  t.end()
})
