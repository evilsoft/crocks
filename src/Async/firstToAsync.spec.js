const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Async = require('.')
const First = require('../First')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const firstToAsync = require('./firstToAsync')

const identity = x => x

test('firstToAsync transform', t => {
  const f = bindFunc(firstToAsync)

  const x = 23

  t.ok(isFunction(firstToAsync), 'is a function')

  const err = /firstToAsync: First or First returning function required for second argument/
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

test('firstToAsync with First', t => {
  const some = 'first'
  const none = 'empty'

  const good = firstToAsync(none, First(some))
  const bad = firstToAsync(none, First.empty())

  t.ok(isSameType(Async, good), 'returns an Async with a First')
  t.ok(isSameType(Async, bad), 'returns an Async with an Empty')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'First maps to a Resolved')
  t.ok(rej.calledWith(none), 'Empty maps to a Rejected with option')

  t.end()
})

test('firstToAsync with First returning function', t => {
  const some = 'first'
  const none = 'empty'

  t.ok(isFunction(firstToAsync(none, First)), 'returns a function')

  const f = bindFunc(firstToAsync(none, identity))

  const err = /firstToAsync: First returning function required for second argument/
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
    x => x !== undefined ? First(x) : First.empty()

  const good = firstToAsync(none, lift, some)
  const bad = firstToAsync(none, lift, undefined)

  t.ok(isSameType(Async, good), 'returns an Async with a First')
  t.ok(isSameType(Async, bad), 'returns an Async with a Empty')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'First maps to a Resolved')
  t.ok(rej.calledWith(none), 'Empty maps to a Rejected with option')

  t.end()
})
