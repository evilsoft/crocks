const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const First = require('.')
const Result = require('../Result')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const resultToFirst = require('./resultToFirst')

test('resultToFirst transform', t => {
  const f = bindFunc(resultToFirst)

  t.ok(isFunction(resultToFirst), 'is a function')

  const err = /resultToFirst: Result or Result returning function required/
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

test('resultToFirst with Result', t => {
  const some = 'something'
  const none = 'nothing'

  const good = resultToFirst(Result.Ok(some))
  const bad = resultToFirst(Result.Err(none))

  t.ok(isSameType(First, good), 'returns a First when Ok')
  t.ok(isSameType(First, bad), 'returns an Empty when Err')

  t.equals(good.option(none), some, 'Ok maps to a First')
  t.equals(bad.option(none), none, 'Err maps to an Empty')

  t.end()
})

test('resultToFirst with Result returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(resultToFirst(First)), 'returns a function')

  const f = bindFunc(resultToFirst(identity))

  const err = /resultToFirst: Result returning function required/
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

  const good = resultToFirst(lift, some)
  const bad = resultToFirst(lift, undefined)

  t.ok(isSameType(First, good), 'returns a First with a Ok')
  t.ok(isSameType(First, bad), 'returns an Empty with a Err')

  t.equals(good.option(none), some, 'Ok maps to a First')
  t.equals(bad.option(none), none, 'Err maps to a Nothing')

  t.end()
})
