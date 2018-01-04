const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Either = require('../Either')
const Last = require('.')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const eitherToLast = require('./eitherToLast')

test('eitherToLast transform', t => {
  const f = bindFunc(eitherToLast)

  t.ok(isFunction(eitherToLast), 'is a function')

  const err = /eitherToLast: Either or Either returning function required/
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

test('eitherToLast with Either', t => {
  const some = 'something'
  const none = 'nothing'

  const good = eitherToLast(Either.Right(some))
  const bad = eitherToLast(Either.Left(none))

  t.ok(isSameType(Last, good), 'returns a Last when Right')
  t.ok(isSameType(Last, bad), 'returns a Last when Left')

  t.equals(good.option(none), some, 'Right maps to a Just')
  t.equals(bad.option(none), none, 'Left maps to a Nothing')

  t.end()
})

test('eitherToLast with Either returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(eitherToLast(Last)), 'returns a function')

  const f = bindFunc(eitherToLast(identity))

  const err = /eitherToLast: Either returning function required/
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

  const good = eitherToLast(lift, some)
  const bad = eitherToLast(lift, undefined)

  t.ok(isSameType(Last, good), 'returns a Last with a Right')
  t.ok(isSameType(Last, bad), 'returns a Last with a Left')

  t.equals(good.option(none), some, 'Right maps to a Just')
  t.equals(bad.option(none), none, 'Left maps to a Nothing')

  t.end()
})
