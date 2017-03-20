const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const merge  = require('./merge')

test('merge pointfree', t => {
  const m = bindFunc(merge)
  const a = { merge: noop }

  t.ok(isFunction(merge), 'is a function')

  t.throws(m(undefined, a), 'throws if first arg is undefined')
  t.throws(m(null, a), 'throws if first arg is null')
  t.throws(m(0, a), 'throws if first arg is a falsey number')
  t.throws(m(1, a), 'throws if first arg is a truthy number')
  t.throws(m('', a), 'throws if first arg is a falsey string')
  t.throws(m('string', a), 'throws if first arg is a truthy string')
  t.throws(m(false, a), 'throws if first arg is false')
  t.throws(m(true, a), 'throws if first arg is true')
  t.throws(m([], a), 'throws if first arg is an array')
  t.throws(m({}, a), 'throws if first arg is an object')

  t.throws(m(noop, undefined), 'throws if second arg is undefined')
  t.throws(m(noop, null), 'throws if second arg is null')
  t.throws(m(noop, 0), 'throws if second arg is a falsey number')
  t.throws(m(noop, 1), 'throws if second arg is a truthy number')
  t.throws(m(noop, ''), 'throws if second arg is a falsey string')
  t.throws(m(noop, 'string'), 'throws if second arg is a truthy string')
  t.throws(m(noop, false), 'throws if second arg is false')
  t.throws(m(noop, true), 'throws if second arg is true')
  t.throws(m(noop, []), 'throws if second arg is an array')
  t.throws(m(noop, {}), 'throws if second arg is an object')

  t.end()
})

test('merge arrow', t => {
  const x = 34
  const m = { merge: sinon.spy(constant(x)) }

  merge(identity, m)

  t.ok(m.merge.calledWith(identity), 'calls merge on arrow, passing the function')
  t.ok(m.merge.returned(x), 'returns the result of m.merge')

  t.end()
})
