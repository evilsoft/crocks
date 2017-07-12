const test = require('tape')
const sinon = require('sinon')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const Async = require('.')
const Maybe = require('../core/Maybe')

const identity = require('../core/identity')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const maybeToAsync = require('./maybeToAsync')

test('maybeToAsync transform', t => {
  const f = bindFunc(maybeToAsync)

  const x = 23

  t.ok(isFunction(maybeToAsync), 'is a function')

  t.throws(f(x, undefined), TypeError, 'throws if second arg is undefined')
  t.throws(f(x, null), TypeError, 'throws if second arg is null')
  t.throws(f(x, 0), TypeError, 'throws if second arg is a falsey number')
  t.throws(f(x, 1), TypeError, 'throws if second arg is a truthy number')
  t.throws(f(x, ''), TypeError, 'throws if second arg is a falsey string')
  t.throws(f(x, 'string'), TypeError, 'throws if second arg is a truthy string')
  t.throws(f(x, false), TypeError, 'throws if second arg is false')
  t.throws(f(x, true), TypeError, 'throws if second arg is true')
  t.throws(f(x, []), TypeError, 'throws if second arg is an array')
  t.throws(f(x, {}), TypeError, 'throws if second arg is an object')

  t.end()
})

test('maybeToAsync with Maybe', t => {
  const some = 'something'
  const none = 'nothing'

  const good = maybeToAsync(none, Maybe.Just(some))
  const bad = maybeToAsync(none, Maybe.Nothing())

  t.ok(isSameType(Async, good), 'returns an Async with a Just')
  t.ok(isSameType(Async, bad), 'returns an Async with a Nothing')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'Just maps to a Resolved')
  t.ok(rej.calledWith(none), 'Nothing maps to a Rejected with option')

  t.end()
})

test('maybeToAsync with Maybe returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(maybeToAsync(none, Maybe.of)), 'returns a function')

  const f = bindFunc(maybeToAsync(none, identity))

  t.throws(f(undefined), TypeError, 'throws if function returns undefined')
  t.throws(f(null), TypeError, 'throws if function returns null')
  t.throws(f(0), TypeError, 'throws if function returns a falsey number')
  t.throws(f(1), TypeError, 'throws if function returns a truthy number')
  t.throws(f(''), TypeError, 'throws if function returns a falsey string')
  t.throws(f('string'), TypeError, 'throws if function returns a truthy string')
  t.throws(f(false), TypeError, 'throws if function returns false')
  t.throws(f(true), TypeError, 'throws if function returns true')
  t.throws(f([]), TypeError, 'throws if function returns an array')
  t.throws(f({}), TypeError, 'throws if function returns an object')

  const lift =
    x => x !== undefined ? Maybe.Just(x) : Maybe.Nothing()

  const good = maybeToAsync(none, lift, some)
  const bad = maybeToAsync(none, lift, undefined)

  t.ok(isSameType(Async, good), 'returns an Async with a Just')
  t.ok(isSameType(Async, bad), 'returns an Async with a Nothing')

  const res = sinon.spy(unit)
  const rej = sinon.spy(unit)

  good.fork(rej, res)
  bad.fork(rej, res)

  t.ok(res.calledWith(some), 'Just maps to a Resolved')
  t.ok(rej.calledWith(none), 'Nothing maps to a Rejected with option')

  t.end()
})
