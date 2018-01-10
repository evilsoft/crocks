const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Either = require('.')
const Last = require('../Last')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const lastToEither = require('./lastToEither')

test('lastToEither transform', t => {
  const f = bindFunc(lastToEither)
  const x = 23

  t.ok(isFunction(lastToEither), 'is a function')

  const err = /lastToEither: Last or Last returning function required for second argument/
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

test('lastToEither with Last', t => {
  const some = 'something'
  const none = 'empty'

  const good = lastToEither(none, Last(some))
  const bad = lastToEither(none, Last.empty())

  t.ok(isSameType(Either, good), 'returns an Either with a Last')
  t.ok(isSameType(Either, bad), 'returns an Either with a empty')

  t.equals(good.either(identity, identity), some, 'Last maps to a Right')
  t.equals(bad.either(identity, identity), none, 'empty maps to a Left with option value')

  t.end()
})

test('lastToEither with Last returning function', t => {
  const some = 'something'
  const none = 'empty'

  t.ok(isFunction(lastToEither(none, Last)), 'returns a function')

  const f = bindFunc(lastToEither(none, identity))

  const err = /lastToEither: Last returning function required for second argument/
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

  const good = lastToEither(none, lift, some)
  const bad = lastToEither(none, lift, undefined)

  t.ok(isSameType(Either, good), 'returns an Either with a Last')
  t.ok(isSameType(Either, bad), 'returns an Either with a empty')

  t.equals(good.either(identity, identity), some, 'Last maps to a Right')
  t.equals(bad.either(identity, identity), none, 'empty maps to a Left with option value')

  t.end()
})
