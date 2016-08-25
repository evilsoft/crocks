const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')

const coalesce = require('./coalesce')

test('coalesce pointfree', t => {
  const m = bindFunc(coalesce)
  const f = { coalesce: noop }

  t.ok(isFunction(coalesce), 'is a function')

  t.throws(m(undefined, noop, f), 'throws if first arg is undefined')
  t.throws(m(null, noop, f), 'throws if first arg is null')
  t.throws(m(0, noop, f), 'throws if first arg is a falsey number')
  t.throws(m(1, noop, f), 'throws if first arg is a truthy number')
  t.throws(m('', noop, f), 'throws if first arg is a falsey string')
  t.throws(m('string', noop, f), 'throws if first arg is a truthy string')
  t.throws(m(false, noop, f), 'throws if first arg is false')
  t.throws(m(true, noop, f), 'throws if first arg is true')
  t.throws(m([], noop, f), 'throws if first arg is an array')
  t.throws(m({}, noop, f), 'throws if first arg is an object')

  t.throws(m(noop, undefined, f), 'throws if second arg is undefined')
  t.throws(m(noop, null, f), 'throws if second arg is null')
  t.throws(m(noop, 0, f), 'throws if second arg is a falsey number')
  t.throws(m(noop, 1, f), 'throws if second arg is a truthy number')
  t.throws(m(noop, '', f), 'throws if second arg is a falsey string')
  t.throws(m(noop, 'string', f), 'throws if second arg is a truthy string')
  t.throws(m(noop, false, f), 'throws if second arg is false')
  t.throws(m(noop, true, f), 'throws if second arg is true')
  t.throws(m(noop, [], f), 'throws if second arg is an array')
  t.throws(m(noop, {}, f), 'throws if second arg is an object')

  t.throws(m(noop, noop, undefined), 'throws if third arg is undefined')
  t.throws(m(noop, noop, null), 'throws if third arg is null')
  t.throws(m(noop, noop, 0), 'throws if third arg is a falsey number')
  t.throws(m(noop, noop, 1), 'throws if third arg is a truthy number')
  t.throws(m(noop, noop, ''), 'throws if third arg is a falsey string')
  t.throws(m(noop, noop, 'string'), 'throws if third arg is a truthy string')
  t.throws(m(noop, noop, false), 'throws if third arg is false')
  t.throws(m(noop, noop, true), 'throws if third arg is true')
  t.throws(m(noop, noop, {}), 'throws if third arg is an object')

  t.end()
})

test('coalesce sum type', t => {
  const x = 'result'
  const m = { coalesce: sinon.spy(constant(x)) }

  const result = coalesce(identity, identity, m)

  t.ok(m.coalesce.calledWith(identity, identity), 'calls coalesce on sum types, passing the functions')
  t.equal(result, x, 'returns the result of the call to coalesce')

  t.end()
})
