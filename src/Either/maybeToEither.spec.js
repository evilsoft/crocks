const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Either = require('.')
const Maybe = require('../core/Maybe')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const maybeToEither = require('./maybeToEither')

test('maybeToEither transform', t => {
  const f = bindFunc(maybeToEither)
  const x = 23

  t.ok(isFunction(maybeToEither), 'is a function')

  const err = /maybeToEither: Maybe or Maybe returning function required for second argument/
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

test('maybeToEither with Maybe', t => {
  const some = 'something'
  const none = 'nothing'

  const good = maybeToEither(none, Maybe.Just(some))
  const bad = maybeToEither(none, Maybe.Nothing())

  t.ok(isSameType(Either, good), 'returns an Either with a Just')
  t.ok(isSameType(Either, bad), 'returns an Either with a Nothing')

  t.equals(good.either(identity, identity), some, 'Just maps to a Right')
  t.equals(bad.either(identity, identity), none, 'Nothing maps to a Left with option value')

  t.end()
})

test('maybeToEither with Maybe returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(maybeToEither(none, Maybe.of)), 'returns a function')

  const f = bindFunc(maybeToEither(none, identity))

  const err = /maybeToEither: Maybe returning function required for second argument/
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
    x => x !== undefined ? Maybe.Just(x) : Maybe.Nothing()

  const good = maybeToEither(none, lift, some)
  const bad = maybeToEither(none, lift, undefined)

  t.ok(isSameType(Either, good), 'returns an Either with a Just')
  t.ok(isSameType(Either, bad), 'returns an Either with a Nothing')

  t.equals(good.either(identity, identity), some, 'Just maps to a Right')
  t.equals(bad.either(identity, identity), none, 'Nothing maps to a Left with option value')

  t.end()
})
