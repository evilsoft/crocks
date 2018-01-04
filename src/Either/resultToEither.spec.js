const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Either = require('.')
const Result = require('../Result')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const constant = x => () => x
const identity = x => x

const resultToEither = require('./resultToEither')

test('resultToEither transform', t => {
  const f = bindFunc(resultToEither)

  t.ok(isFunction(resultToEither), 'is a function')

  const err = /resultToEither: Result or Result returning function required/
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

test('resultToEither with Result', t => {
  const some = 'something'
  const none = 'nothing'

  const good = resultToEither(Result.Ok(some))
  const bad = resultToEither(Result.Err(none))

  t.ok(isSameType(Either, good), 'returns an Either when Ok')
  t.ok(isSameType(Either, bad), 'returns an Either when Err')

  t.equals(good.either(constant(none), identity), some, 'Ok maps to a Right')
  t.equals(bad.either(identity, constant(some)), none, 'Err maps to a Left')

  t.end()
})

test('resultToEither with Result returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(resultToEither(Either.of)), 'returns a function')

  const f = bindFunc(resultToEither(identity))

  const err = /resultToEither: Result returning function required/
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
    x => x !== undefined ? Result.Ok(x) : Result.Err(none)

  const good = resultToEither(lift, some)
  const bad = resultToEither(lift, undefined)

  t.ok(isSameType(Either, good), 'returns a Either with an Ok')
  t.ok(isSameType(Either, bad), 'returns a Either with an Err')

  t.equals(good.either(constant(none), identity), some, 'Ok maps to a Right')
  t.equals(bad.either(identity, constant(some)), none, 'Err maps to Left')

  t.end()
})
