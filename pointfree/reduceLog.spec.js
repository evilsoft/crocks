const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const constant = require('../combinators/constant')

const reduceLog = require('./reduceLog')

test('reduceLog pointfree', t => {
  const r = bindFunc(reduceLog)
  const x = 'result'
  const m = { reduceLog: sinon.spy(constant(x)) }

  t.ok(isFunction(reduceLog), 'is a function')

  t.throws(r(undefined, m), 'throws if first arg is undefined')
  t.throws(r(null, m), 'throws if first arg is null')
  t.throws(r(0, m), 'throws if first arg is a falsey number')
  t.throws(r(1, m), 'throws if first arg is a truthy number')
  t.throws(r('', m), 'throws if first arg is a falsey string')
  t.throws(r('string', m), 'throws if first arg is a truthy string')
  t.throws(r(false, m), 'throws if first arg is false')
  t.throws(r(true, m), 'throws if first arg is true')
  t.throws(r([], m), 'throws if first arg is an array')
  t.throws(r({}, m), 'throws if first arg is an object')

  t.throws(r(noop, undefined), 'throws if second arg is undefined')
  t.throws(r(noop, null), 'throws if second arg is null')
  t.throws(r(noop, 0), 'throws if second arg is a falsey number')
  t.throws(r(noop, 1), 'throws if second arg is a truthy number')
  t.throws(r(noop, ''), 'throws if second arg is a falsey string')
  t.throws(r(noop, 'string'), 'throws if second arg is a truthy string')
  t.throws(r(noop, false), 'throws if second arg is false')
  t.throws(r(noop, true), 'throws if second arg is true')
  t.throws(r(noop, {}), 'throws if second arg is an object')

  t.doesNotThrow(r(noop, m), 'allows a function and valid container')

  const f = sinon.spy()
  const res = reduceLog(f, m)

  t.ok(m.reduceLog.calledWith(f), 'calls reduceLog on container, passing the function')
  t.equal(res, x, 'returns the result of reduceLog')

  t.end()
})
