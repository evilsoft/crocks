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
  const m = Async.of(unit)
  sinon.stub(m, 'fork').callsFake(unit)

  t.ok(isFunction(fork), 'is a function')

  const noRejRes = /fork: Reject and resolve functions required for first two arguments/
  t.throws(f(undefined, unit, unit, m), noRejRes, 'throws if first arg undefined')
  t.throws(f(null, unit, unit, m), noRejRes, 'throws if first arg null')
  t.throws(f(0, unit, unit, m), noRejRes, 'throws if first arg a falsey number')
  t.throws(f(1, unit, unit, m), noRejRes, 'throws if first arg a truthy number')
  t.throws(f('', unit, unit, m), noRejRes, 'throws if first arg a falsey string')
  t.throws(f('string', unit, unit, m), noRejRes, 'throws if first arg a truthy string')
  t.throws(f(false, unit, unit, m), noRejRes, 'throws if first arg false')
  t.throws(f(true, unit, unit, m), noRejRes, 'throws if first arg true')
  t.throws(f([], unit, unit, m), noRejRes, 'throws if first arg an array')
  t.throws(f({}, unit, unit, m), noRejRes, 'throws if first arg an object')

  t.throws(f(unit, undefined, unit, m), noRejRes, 'throws if second arg undefined')
  t.throws(f(unit, null, unit, m), noRejRes, 'throws if second arg null')
  t.throws(f(unit, 0, unit, m), noRejRes, 'throws if second arg a falsey number')
  t.throws(f(unit, 1, unit, m), noRejRes, 'throws if second arg a truthy number')
  t.throws(f(unit, '', unit, m), noRejRes, 'throws if second arg a falsey string')
  t.throws(f(unit, 'string', unit, m), noRejRes, 'throws if second arg a truthy string')
  t.throws(f(unit, false, unit, m), noRejRes, 'throws if second arg false')
  t.throws(f(unit, true, unit, m), noRejRes, 'throws if second arg true')
  t.throws(f(unit, [], unit, m), noRejRes, 'throws if second arg an array')
  t.throws(f(unit, {}, unit, m), noRejRes, 'throws if second arg an object')

  const noCancel = /fork: Function or falsey value required for third argument/
  t.throws(f(unit, unit, 1, m), noCancel, 'throws if third arg a truthy number')
  t.throws(f(unit, unit, 'string', m), noCancel, 'throws if third arg a truthy string')
  t.throws(f(unit, unit, true, m), noCancel, 'throws if third arg true')
  t.throws(f(unit, unit, [], m), noCancel, 'throws if third arg an array')
  t.throws(f(unit, unit, {}, m), noCancel, 'throws if third arg an object')

  const noAsync = /fork: Async required for fourth argument/
  t.throws(f(unit, unit, unit, undefined), noAsync, 'throws if fourth arg undefined')
  t.throws(f(unit, unit, unit, null), noAsync, 'throws if fourth arg null')
  t.throws(f(unit, unit, unit, 0), noAsync, 'throws if fourth arg a falsey number')
  t.throws(f(unit, unit, unit, 1), noAsync, 'throws if fourth arg a truthy number')
  t.throws(f(unit, unit, unit, ''), noAsync, 'throws if fourth arg a falsey string')
  t.throws(f(unit, unit, unit, 'string'), noAsync, 'throws if fourth arg a truthy string')
  t.throws(f(unit, unit, unit, false), noAsync, 'throws if fourth arg false')
  t.throws(f(unit, unit, unit, true), noAsync, 'throws if fourth arg true')
  t.throws(f(unit, unit, unit, []), noAsync, 'throws if fourth arg an array')
  t.throws(f(unit, unit, unit, {}), noAsync, 'throws if fourth arg an object')
  t.throws(f(unit, unit, unit, unit), noAsync, 'throws if fourth arg a function')

  const result = fork(unit, unit, unit, m)

  t.ok(m.fork.called, 'calls fork on the passed container')
  t.equals(undefined, result, 'returns undefined')

  const rej = sinon.spy()
  const res = sinon.spy()
  const cancel = sinon.spy()

  fork(rej, res, cancel, m)

  t.ok(m.fork.calledWith(rej, res), 'calls fork on forkable passing the rej, res, and cancel functions')
  rej.reset()
  res.reset()
  cancel.reset()
  m.fork.reset()

  fork(rej, res, null, m)

  t.ok(m.fork.calledWith(rej, res), 'calls fork on forkable passing the rej and res functions')
  rej.reset()
  res.reset()
  m.fork.reset()

  t.end()
})
