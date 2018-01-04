const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Async = require('.')
const Result = require('../Result')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const resultToAsync = require('./resultToAsync')

const identity = x => x

test('resultToAsync transform', t => {
  const f = bindFunc(resultToAsync)

  t.ok(isFunction(resultToAsync), 'is a function')

  const err = /resultToAsync: Result or Result returning function required/
  t.throws(f(undefined), err, 'throws if arg is undefined')
  t.throws(f(null), err, 'throws if arg is null')
  t.throws(f(0), err, 'throws if arg is a falsey number')
  t.throws(f(1), err, 'throws if arg is a truthy number')
  t.throws(f(''), err, 'throws if arg is a falsey string')
  t.throws(f('string'), err, 'throws if arg is a truthy string')
  t.throws(f(false), err, 'throws if arg is false')
  t.throws(f(true), err, 'throws if arg is true')
  t.throws(f([]), err, 'throws if arg is an array')
  t.throws(f({}), err, 'throws if arg is an object')

  t.end()
})

test('resultToAsync with Result', t => {
  const some = 'something'
  const none = 'nothing'

  const good = resultToAsync(Result.Ok(some))
  const bad = resultToAsync(Result.Err(none))

  t.ok(isSameType(Async, good), 'returns an Async when Ok')
  t.ok(isSameType(Async, bad), 'returns an Async when Err')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'Ok maps to a Resolved')
  t.ok(rej.calledWith(none), 'Err maps to a Rejected')

  t.end()
})

test('resultToAsync with Result returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(resultToAsync(Result.of)), 'returns a function')

  const f = bindFunc(resultToAsync(identity))

  const err = /resultToAsync: Result returning function required/
  t.throws(f(undefined), err, 'throws if function returns undefined')
  t.throws(f(null), err, 'throws if function returns null')
  t.throws(f(0), err, 'throws if function returns a falsey number')
  t.throws(f(1), err, 'throws if function returns a truthy number')
  t.throws(f(''), err, 'throws if function returns a falsey string')
  t.throws(f('string'), err, 'throws if function returns a truthy string')
  t.throws(f(false), err, 'throws if function returns false')
  t.throws(f(true), err, 'throws if function returns true')
  t.throws(f([]), err, 'throws if function returns an array')
  t.throws(f({}), err, 'throws if function returns an object')

  const lift =
    x => x !== undefined ? Result.Ok(x) : Result.Err(none)

  const good = resultToAsync(lift, some)
  const bad = resultToAsync(lift, undefined)

  t.ok(isSameType(Async, good), 'returns an Async when Ok')
  t.ok(isSameType(Async, bad), 'returns an Async when Err')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'Ok maps to a Resolved')
  t.ok(rej.calledWith(none), 'Err maps to a Rejected with option')

  t.end()
})
