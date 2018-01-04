const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const First = require('.')
const Either = require('../Either')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const eitherToFirst = require('./eitherToFirst')

test('eitherToFirst transform', t => {
  const f = bindFunc(eitherToFirst)

  t.ok(isFunction(eitherToFirst), 'is a function')

  const err = /eitherToFirst: Either or Either returning function required/
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

test('eitherToFirst with Either', t => {
  const some = 'something'
  const none = 'nothing'

  const good = eitherToFirst(Either.Right(some))
  const bad = eitherToFirst(Either.Left(none))

  t.ok(isSameType(First, good), 'returns a First when Right')
  t.ok(isSameType(First, bad), 'returns a First when Left')

  t.equals(good.option(none), some, 'Right maps to a Just')
  t.equals(bad.option(none), none, 'Left maps to a Nothing')

  t.end()
})

test('eitherToFirst with Either returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(eitherToFirst(First)), 'returns a function')

  const f = bindFunc(eitherToFirst(identity))

  const err = /eitherToFirst: Either returning function required/
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

  const good = eitherToFirst(lift, some)
  const bad = eitherToFirst(lift, undefined)

  t.ok(isSameType(First, good), 'returns a First with a Right')
  t.ok(isSameType(First, bad), 'returns a First with a Left')

  t.equals(good.option(none), some, 'Right maps to a Just')
  t.equals(bad.option(none), none, 'Left maps to a Nothing')

  t.end()
})
