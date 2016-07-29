const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const constant = require('../combinators/constant')

const Last = require('../test/LastMonoid')

const mreduceLog = require('./mreduceLog')

test('mreduceLog pointfree', t => {
  const r = bindFunc(mreduceLog)
  const x = 'result'
  const m = { mreduceLog: sinon.spy(constant(x)) }

  t.ok(isFunction(mreduceLog), 'is a function')

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
  t.throws(r(noop, m), 'throws if first arg is a function')

  t.throws(r(Last, undefined), 'throws if second arg is undefined')
  t.throws(r(Last, null), 'throws if second arg is null')
  t.throws(r(Last, 0), 'throws if second arg is a falsey number')
  t.throws(r(Last, 1), 'throws if second arg is a truthy number')
  t.throws(r(Last, ''), 'throws if second arg is a falsey string')
  t.throws(r(Last, 'string'), 'throws if second arg is a truthy string')
  t.throws(r(Last, false), 'throws if second arg is false')
  t.throws(r(Last, true), 'throws if second arg is true')
  t.throws(r(Last, {}), 'throws if second arg is an object')
  t.throws(r(Last, noop), 'throws if second arg is an object')

  t.doesNotThrow(r(Last, m), 'allows a Monoid and valid container')

  const f   = sinon.spy()
  const res = mreduceLog(Last, m)

  t.ok(m.mreduceLog.calledWith(Last), 'calls mreduceLog on container, passing the monoid')
  t.equal(res, x, 'returns the result of reduceLog')

  t.end()
})
