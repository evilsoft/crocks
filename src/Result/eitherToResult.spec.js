const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Result = require('.')
const Either = require('../Either')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const constant = x => () => x
const identity = x => x

const eitherToResult = require('./eitherToResult')

test('eitherToResult transform', t => {
  const f = bindFunc(eitherToResult)

  t.ok(isFunction(eitherToResult), 'is a function')

  const err = /eitherToResult: Either or Either returning function required/
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

test('eitherToResult with Result', t => {
  const some = 'something'
  const none = 'nothing'

  const good = eitherToResult(Either.Right(some))
  const bad = eitherToResult(Either.Left(none))

  t.ok(isSameType(Result, good), 'returns a Result when Right')
  t.ok(isSameType(Result, bad), 'returns an Result when Left')

  t.equals(good.either(constant(none), identity), some, 'Right maps to an Ok')
  t.equals(bad.either(identity, constant(some)), none, 'Left maps to an Err')

  t.end()
})

test('eitherToResult with Result returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(eitherToResult(Either.Right)), 'returns a function')

  const f = bindFunc(eitherToResult(identity))

  const err = /eitherToResult: Either returning function required/
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

  const good = eitherToResult(lift, some)
  const bad = eitherToResult(lift, undefined)

  t.ok(isSameType(Result, good), 'returns a Result with a Right')
  t.ok(isSameType(Result, bad), 'returns a Result with a Left')

  t.equals(good.either(constant(none), identity), some, 'Right maps to an Ok')
  t.equals(bad.either(identity, constant(some)), none, 'Left maps to an Err')

  t.end()
})
