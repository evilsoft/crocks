const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const identity = require('../combinators/identity')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Either = require('../crocks/Either')
const Maybe = require('../crocks/Maybe')

const eitherToMaybe = require('./eitherToMaybe')

test('eitherToMaybe transform', t => {
  const f = bindFunc(eitherToMaybe)

  t.ok(isFunction(eitherToMaybe), 'is a function')

  t.throws(f(undefined), TypeError, 'throws if arg is undefined')
  t.throws(f(null), TypeError, 'throws if arg is null')
  t.throws(f(0), TypeError, 'throws if arg is a falsey number')
  t.throws(f(1), TypeError, 'throws if arg is a truthy number')
  t.throws(f(''), TypeError, 'throws if arg is a falsey string')
  t.throws(f('string'), TypeError, 'throws if arg is a truthy string')
  t.throws(f(false), TypeError, 'throws if arg is false')
  t.throws(f(true), TypeError, 'throws if arg is true')
  t.throws(f([]), TypeError, 'throws if arg is an array')
  t.throws(f({}), TypeError, 'throws if arg is an object')

  t.end()
})

test('eitherToMaybe with Either', t => {
  const some = 'something'
  const none = 'nothing'

  const good = eitherToMaybe(Either.Right(some))
  const bad = eitherToMaybe(Either.Left(none))

  t.ok(isSameType(Maybe, good), 'returns a Maybe when Right')
  t.ok(isSameType(Maybe, bad), 'returns a Maybe when Left')

  t.equals(good.option(none), some, 'Right maps to a Just')
  t.equals(bad.option(none), none, 'Left maps to a Nothing')

  t.end()
})

test('eitherToMaybe with Either returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(eitherToMaybe(Maybe.of)), 'returns a function')

  const f = bindFunc(eitherToMaybe(identity))

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
    x => x !== undefined ? Either.Right(x) : Either.Left(none)

  const good = eitherToMaybe(lift, some)
  const bad = eitherToMaybe(lift, undefined)

  t.ok(isSameType(Maybe, good), 'returns a Maybe with a Right')
  t.ok(isSameType(Maybe, bad), 'returns a Maybe with a Left')

  t.equals(good.option(none), some, 'Right maps to a Just')
  t.equals(bad.option(none), none, 'Left maps to a Nothing')

  t.end()
})
