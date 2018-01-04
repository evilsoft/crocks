const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Async = require('.')
const Last = require('../Last')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const lastToAsync = require('./lastToAsync')

const identity = x => x

test('lastToAsync transform', t => {
  const f = bindFunc(lastToAsync)

  const x = 23

  t.ok(isFunction(lastToAsync), 'is a function')

  const err = /lastToAsync: Last or Last returning function required for second argument/
  t.throws(f(x, undefined), err, 'throws if second arg is undefined')
  t.throws(f(x, null), err, 'throws if second arg is null')
  t.throws(f(x, 0), err, 'throws if second arg is a falsey number')
  t.throws(f(x, 1), err, 'throws if second arg is a truthy number')
  t.throws(f(x, ''), err, 'throws if second arg is a falsey string')
  t.throws(f(x, 'string'), err, 'throws if second arg is a truthy string')
  t.throws(f(x, false), err, 'throws if second arg is false')
  t.throws(f(x, true), err, 'throws if second arg is true')
  t.throws(f(x, []), err, 'throws if second arg is an array')
  t.throws(f(x, {}), err, 'throws if second arg is an object')

  t.end()
})

test('lastToAsync with Last', t => {
  const some = 'last'
  const none = 'empty'

  const good = lastToAsync(none, Last(some))
  const bad = lastToAsync(none, Last.empty())

  t.ok(isSameType(Async, good), 'returns an Async with a Last')
  t.ok(isSameType(Async, bad), 'returns an Async with an Empty')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'Last maps to a Resolved')
  t.ok(rej.calledWith(none), 'Empty maps to a Rejected with option')

  t.end()
})

test('lastToAsync with Last returning function', t => {
  const some = 'last'
  const none = 'empty'

  t.ok(isFunction(lastToAsync(none, Last)), 'returns a function')

  const f = bindFunc(lastToAsync(none, identity))

  const err = /lastToAsync: Last returning function required for second argument/
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
    x => x !== undefined ? Last(x) : Last.empty()

  const good = lastToAsync(none, lift, some)
  const bad = lastToAsync(none, lift, undefined)

  t.ok(isSameType(Async, good), 'returns an Async with a Last')
  t.ok(isSameType(Async, bad), 'returns an Async with a Empty')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'Last maps to a Resolved')
  t.ok(rej.calledWith(none), 'Empty maps to a Rejected with option')

  t.end()
})
