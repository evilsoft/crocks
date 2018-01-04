const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Async = require('.')
const Either = require('../Either')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const eitherToAsync = require('./eitherToAsync')

const identity = x => x

test('eitherToAsync transform', t => {
  const f = bindFunc(eitherToAsync)

  t.ok(isFunction(eitherToAsync), 'is a function')

  const err = /eitherToAsync: Either or Either returning function required/
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

test('eitherToAsync with Either', t => {
  const some = 'something'
  const none = 'nothing'

  const good = eitherToAsync(Either.Right(some))
  const bad = eitherToAsync(Either.Left(none))

  t.ok(isSameType(Async, good), 'returns an Async when Right')
  t.ok(isSameType(Async, bad), 'returns an Async when Left')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'Right maps to a Resolved')
  t.ok(rej.calledWith(none), 'Left maps to a Rejected')

  t.end()
})

test('eitherToAsync with Either returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(eitherToAsync(Either.Right)), 'returns a function')

  const f = bindFunc(eitherToAsync(identity))

  const err = /eitherToAsync: Either returning function required/
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
    x => x !== undefined ? Either.Right(x) : Either.Left(none)

  const good = eitherToAsync(lift, some)
  const bad = eitherToAsync(lift, undefined)

  t.ok(isSameType(Async, good), 'returns an Async when Right')
  t.ok(isSameType(Async, bad), 'returns an Async when Left')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'Right maps to a Resolved')
  t.ok(rej.calledWith(none), 'Left maps to a Rejected with option')

  t.end()
})
