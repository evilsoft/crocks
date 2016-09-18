const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const constant = require('../combinators/constant')

const Last = require('../test/LastMonoid')

const mreduceLog = require('./mreduceLog')

test('mreduceLog pointfree', t => {
  const r = bindFunc(mreduceLog)
  const x = 'result'
  const m = { mreduceLog: sinon.spy(constant(x)) }

  t.ok(isFunction(mreduceLog), 'is a function')

  t.throws(r(undefined, 0, m), 'throws if first arg is undefined')
  t.throws(r(null, 0, m), 'throws if first arg is null')
  t.throws(r(0, 0, m), 'throws if first arg is a falsey number')
  t.throws(r(1, 0, m), 'throws if first arg is a truthy number')
  t.throws(r('', 0, m), 'throws if first arg is a falsey string')
  t.throws(r('string', 0, m), 'throws if first arg is a truthy string')
  t.throws(r(false, 0, m), 'throws if first arg is false')
  t.throws(r(true, 0, m), 'throws if first arg is true')
  t.throws(r([], 0, m), 'throws if first arg is an array')
  t.throws(r({}, 0, m), 'throws if first arg is an object')
  t.throws(r(noop, 0, m), 'throws if first arg is a function')

  t.throws(r(Last, 0, undefined), 'throws if second arg is undefined')
  t.throws(r(Last, 0, null), 'throws if second arg is null')
  t.throws(r(Last, 0, 0), 'throws if second arg is a falsey number')
  t.throws(r(Last, 0, 1), 'throws if second arg is a truthy number')
  t.throws(r(Last, 0, ''), 'throws if second arg is a falsey string')
  t.throws(r(Last, 0, 'string'), 'throws if second arg is a truthy string')
  t.throws(r(Last, 0, false), 'throws if second arg is false')
  t.throws(r(Last, 0, true), 'throws if second arg is true')
  t.throws(r(Last, 0, {}), 'throws if second arg is an object')
  t.throws(r(Last, 0, noop), 'throws if second arg is an object')

  t.doesNotThrow(r(Last, 0, m), 'allows a Monoid and valid container')

  const f= sinon.spy()
  const res = mreduceLog(Last, 0, m)

  t.ok(m.mreduceLog.calledWith(Last), 'calls mreduceLog on container, passing the monoid')
  t.equal(res, x, 'returns the result of reduceLog')

  t.end()
})
