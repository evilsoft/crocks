const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Either = require('.')
const First = require('../First')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const firstToEither = require('./firstToEither')

const identity = x => x

test('firstToEither transform', t => {
  const f = bindFunc(firstToEither)
  const x = 23

  t.ok(isFunction(firstToEither), 'is a function')

  const err = /firstToEither: First or First returning function required for second argument/
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

test('firstToEither with First', t => {
  const some = 'something'
  const none = 'empty'

  const good = firstToEither(none, First(some))
  const bad = firstToEither(none, First.empty())

  t.ok(isSameType(Either, good), 'returns an Either with a First')
  t.ok(isSameType(Either, bad), 'returns an Either with a empty')

  t.equals(good.either(identity, identity), some, 'First maps to a Right')
  t.equals(bad.either(identity, identity), none, 'empty maps to a Left with option value')

  t.end()
})

test('firstToEither with First returning function', t => {
  const some = 'something'
  const none = 'empty'

  t.ok(isFunction(firstToEither(none, First)), 'returns a function')

  const f = bindFunc(firstToEither(none, identity))

  const err = /firstToEither: First returning function required for second argument/
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
    x => x !== undefined ? First(x) : First.empty()

  const good = firstToEither(none, lift, some)
  const bad = firstToEither(none, lift, undefined)

  t.ok(isSameType(Either, good), 'returns an Either with a First')
  t.ok(isSameType(Either, bad), 'returns an Either with a empty')

  t.equals(good.either(identity, identity), some, 'First maps to a Right')
  t.equals(bad.either(identity, identity), none, 'empty maps to a Left with option value')

  t.end()
})
