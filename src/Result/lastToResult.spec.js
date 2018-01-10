const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Result = require('.')
const Last = require('../Last')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const lastToResult = require('./lastToResult')

test('lastToResult transform', t => {
  const f = bindFunc(lastToResult)
  const x = 23

  t.ok(isFunction(lastToResult), 'is a function')

  const err = /lastToResult: Last or Last returning function required for second argument/
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

test('lastToResult with Last', t => {
  const some = 'last'
  const none = 'empty'

  const good = lastToResult(none, Last(some))
  const bad = lastToResult(none, Last.empty())

  t.ok(isSameType(Result, good), 'returns an Result with a Last')
  t.ok(isSameType(Result, bad), 'returns an Result with an Empty')

  t.equals(good.either(identity, identity), some, 'Last maps to an Ok')
  t.equals(bad.either(identity, identity), none, 'Empty maps to an Err with option value')

  t.end()
})

test('lastToResult with Last returning function', t => {
  const some = 'last'
  const none = 'empty'

  t.ok(isFunction(lastToResult(none, Last)), 'returns a function')

  const f = bindFunc(lastToResult(none, identity))

  const err = /lastToResult: Last returning function required for second argument/
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

  const good = lastToResult(none, lift, some)
  const bad = lastToResult(none, lift, undefined)

  t.ok(isSameType(Result, good), 'returns an Result with a Last')
  t.ok(isSameType(Result, bad), 'returns an Result with an Empty')

  t.equals(good.either(identity, identity), some, 'Last maps to an Ok')
  t.equals(bad.either(identity, identity), none, 'Empty maps to an Err with option value')

  t.end()
})
