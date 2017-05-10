const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../helpers/unit')

const Async = require('../crocks/Async')
const isFunction = require('../predicates/isFunction')

const fork = require('./fork')

test('fork pointfree', t => {
  const f = bindFunc(fork)
  const m = { fork: sinon.spy() }

  t.ok(isFunction(fork), 'is a function')

  t.throws(f(undefined, unit, m), TypeError, 'throws if first arg undefined')
  t.throws(f(null, unit, m), TypeError, 'throws if first arg null')
  t.throws(f(0, unit, m), TypeError, 'throws if first arg a falsey number')
  t.throws(f(1, unit, m), TypeError, 'throws if first arg a truthy number')
  t.throws(f('', unit, m), TypeError, 'throws if first arg a falsey string')
  t.throws(f('string', unit, m), TypeError, 'throws if first arg a truthy string')
  t.throws(f(false, unit, m), TypeError, 'throws if first arg false')
  t.throws(f(true, unit, m), TypeError, 'throws if first arg true')
  t.throws(f([], unit, m), TypeError, 'throws if first arg an array')
  t.throws(f({}, unit, m), TypeError, 'throws if first arg an object')

  t.throws(f(unit, undefined, m), TypeError, 'throws if second arg undefined')
  t.throws(f(unit, null, m), TypeError, 'throws if second arg null')
  t.throws(f(unit, 0, m), TypeError, 'throws if second arg a falsey number')
  t.throws(f(unit, 1, m), TypeError, 'throws if second arg a truthy number')
  t.throws(f(unit, '', m), TypeError, 'throws if second arg a falsey string')
  t.throws(f(unit, 'string', m), TypeError, 'throws if second arg a truthy string')
  t.throws(f(unit, false, m), TypeError, 'throws if second arg false')
  t.throws(f(unit, true, m), TypeError, 'throws if second arg true')
  t.throws(f(unit, [], m), TypeError, 'throws if second arg an array')
  t.throws(f(unit, {}, m), TypeError, 'throws if second arg an object')

  t.throws(f(unit, unit, undefined), TypeError, 'throws if third arg undefined')
  t.throws(f(unit, unit, null), TypeError, 'throws if third arg null')
  t.throws(f(unit, unit, 0), TypeError, 'throws if third arg a falsey number')
  t.throws(f(unit, unit, 1), TypeError, 'throws if third arg a truthy number')
  t.throws(f(unit, unit, ''), TypeError, 'throws if third arg a falsey string')
  t.throws(f(unit, unit, 'string'), TypeError, 'throws if third arg a truthy string')
  t.throws(f(unit, unit, false), TypeError, 'throws if third arg false')
  t.throws(f(unit, unit, true), TypeError, 'throws if third arg true')
  t.throws(f(unit, unit, []), TypeError, 'throws if third arg an array')
  t.throws(f(unit, unit, {}), TypeError, 'throws if third arg an object')
  t.throws(f(unit, unit, unit), TypeError, 'throws if third arg a function')

  const result = fork(unit, unit, m)

  t.ok(m.fork.called, 'calls fork on the passed container')
  t.equals(undefined, result, 'returns undefined')

  const rej = sinon.spy()
  const res = sinon.spy()

  const resolved = Async.Resolved()
  fork(rej, res, resolved)

  t.ok(res.called, 'calls passed resolve function')
  t.notOk(rej.called, 'does not call passed reject function')
  rej.reset()
  res.reset()

  const rejected = Async.Rejected()
  fork(rej, res, rejected)

  t.ok(rej.called, 'calls passed reject function')
  t.notOk(res.called, 'does not call passed resolve function')
  rej.reset()
  res.reset()

  t.end()
})
