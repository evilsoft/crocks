const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Maybe = require('.')
const Last = require('../Last')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const lastToMaybe = require('./lastToMaybe')

test('lastToMaybe transform', t => {
  const f = bindFunc(lastToMaybe)

  t.ok(isFunction(lastToMaybe), 'is a function')

  const err = /lastToMaybe: Last or Last returning function required/
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

test('lastToMaybe with Last', t => {
  const some = 'last'
  const none = 'empty'

  const good = lastToMaybe(Last(some))
  const bad = lastToMaybe(Last.empty())

  t.ok(isSameType(Maybe, good), 'returns a Maybe when Last')
  t.ok(isSameType(Maybe, bad), 'returns a Maybe when Empty')

  t.equals(good.option(none), some, 'Last maps to a Just')
  t.equals(bad.option(none), none, 'Empty maps to a Nothing')

  t.end()
})

test('lastToMaybe with Last returning function', t => {
  const some = 'last'
  const none = 'empty'

  t.ok(isFunction(lastToMaybe(Maybe.of)), 'returns a function')

  const f = bindFunc(lastToMaybe(identity))

  const err = /lastToMaybe: Last returning function required/
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

  const good = lastToMaybe(lift, some)
  const bad = lastToMaybe(lift, undefined)

  t.ok(isSameType(Maybe, good), 'returns a Maybe with a Last')
  t.ok(isSameType(Maybe, bad), 'returns a Maybe with an Empty')

  t.equals(good.option(none), some, 'Last maps to a Just')
  t.equals(bad.option(none), none, 'Empty maps to a Nothing')

  t.end()
})
