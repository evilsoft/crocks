const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const { Resolved, Rejected } = require('../crocks/Async')
const isFunction = require('../predicates/isFunction')

const fork = require('./fork')

test('fork pointfree', t => {
  const f = bindFunc(fork)
  const m = { fork: sinon.spy() }

  t.ok(isFunction(fork), 'is a function')

  t.throws(f(undefined, noop, m), TypeError, 'throws if first arg undefined')
  t.throws(f(null, noop, m), TypeError, 'throws if first arg null')
  t.throws(f(0, noop, m), TypeError, 'throws if first arg a falsey number')
  t.throws(f(1, noop, m), TypeError, 'throws if first arg a truthy number')
  t.throws(f('', noop, m), TypeError, 'throws if first arg a falsey string')
  t.throws(f('string', noop, m), TypeError, 'throws if first arg a truthy string')
  t.throws(f(false, noop, m), TypeError, 'throws if first arg false')
  t.throws(f(true, noop, m), TypeError, 'throws if first arg true')
  t.throws(f([], noop, m), TypeError, 'throws if first arg an array')
  t.throws(f({}, noop, m), TypeError, 'throws if first arg an object')

  t.throws(f(noop, undefined, m), TypeError, 'throws if second arg undefined')
  t.throws(f(noop, null, m), TypeError, 'throws if second arg null')
  t.throws(f(noop, 0, m), TypeError, 'throws if second arg a falsey number')
  t.throws(f(noop, 1, m), TypeError, 'throws if second arg a truthy number')
  t.throws(f(noop, '', m), TypeError, 'throws if second arg a falsey string')
  t.throws(f(noop, 'string', m), TypeError, 'throws if second arg a truthy string')
  t.throws(f(noop, false, m), TypeError, 'throws if second arg false')
  t.throws(f(noop, true, m), TypeError, 'throws if second arg true')
  t.throws(f(noop, [], m), TypeError, 'throws if second arg an array')
  t.throws(f(noop, {}, m), TypeError, 'throws if second arg an object')

  t.throws(f(noop, noop, undefined), TypeError, 'throws if third arg undefined')
  t.throws(f(noop, noop, null), TypeError, 'throws if third arg null')
  t.throws(f(noop, noop, 0), TypeError, 'throws if third arg a falsey number')
  t.throws(f(noop, noop, 1), TypeError, 'throws if third arg a truthy number')
  t.throws(f(noop, noop, ''), TypeError, 'throws if third arg a falsey string')
  t.throws(f(noop, noop, 'string'), TypeError, 'throws if third arg a truthy string')
  t.throws(f(noop, noop, false), TypeError, 'throws if third arg false')
  t.throws(f(noop, noop, true), TypeError, 'throws if third arg true')
  t.throws(f(noop, noop, []), TypeError, 'throws if third arg an array')
  t.throws(f(noop, noop, {}), TypeError, 'throws if third arg an object')
  t.throws(f(noop, noop, noop), TypeError, 'throws if third arg a function')

  fork(noop, noop, m)

  t.ok(m.fork.called, 'calls fork on the passed container')

  const rej = sinon.spy()
  const res = sinon.spy()

  const resolved = Resolved()
  fork(rej, res, resolved)

  t.ok(res.called, 'calls passed resolve function')
  t.notOk(rej.called, 'does not call passed reject function')
  rej.reset()
  res.reset()

  const rejected = Rejected()
  fork(rej, res, rejected)

  t.ok(rej.called, 'calls passed reject function')
  t.notOk(res.called, 'does not call passed resolve function')
  rej.reset()
  res.reset()

  t.end()
})
