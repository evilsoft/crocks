const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Maybe = require('.')
const Result = require('../Result')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const resultToMaybe = require('./resultToMaybe')

test('resultToMaybe transform', t => {
  const f = bindFunc(resultToMaybe)

  t.ok(isFunction(resultToMaybe), 'is a function')

  const err = /resultToMaybe: Result or Result returning function required/
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

test('resultToMaybe with Result', t => {
  const some = 'something'
  const none = 'nothing'

  const good = resultToMaybe(Result.Ok(some))
  const bad = resultToMaybe(Result.Err(none))

  t.ok(isSameType(Maybe, good), 'returns a Maybe when Ok')
  t.ok(isSameType(Maybe, bad), 'returns a Maybe when Err')

  t.equals(good.option(none), some, 'Ok maps to a Just')
  t.equals(bad.option(none), none, 'Err maps to a Nothing')

  t.end()
})

test('resultToMaybe with Result returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(resultToMaybe(Maybe.of)), 'returns a function')

  const f = bindFunc(resultToMaybe(identity))

  const err = /resultToMaybe: Result returning function required/
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

  const good = resultToMaybe(lift, some)
  const bad = resultToMaybe(lift, undefined)

  t.ok(isSameType(Maybe, good), 'returns a Maybe with a Ok')
  t.ok(isSameType(Maybe, bad), 'returns a Maybe with a Err')

  t.equals(good.option(none), some, 'Ok maps to a Just')
  t.equals(bad.option(none), none, 'Err maps to a Nothing')

  t.end()
})
