const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const First = require('.')
const Maybe = require('../core/Maybe')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const maybeToFirst = require('./maybeToFirst')

test('maybeToFirst transform', t => {
  const f = bindFunc(maybeToFirst)

  t.ok(isFunction(maybeToFirst), 'is a function')

  const err = /maybeToFirst: Maybe or Maybe returning function required/
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

test('maybeToFirst with Maybe', t => {
  const some = 'something'
  const none = 'nothing'

  const good = maybeToFirst(Maybe.Just(some))
  const bad = maybeToFirst(Maybe.Nothing())

  t.ok(isSameType(First, good), 'returns a First when Just')
  t.ok(isSameType(First, bad), 'returns a First when Nothing')

  t.equals(good.option(none), some, 'Just maps to a First')
  t.equals(bad.option(none), none, 'Nothing maps to an Empty')

  t.end()
})

test('maybeToFirst with Maybe returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(maybeToFirst(First)), 'returns a function')

  const f = bindFunc(maybeToFirst(identity))

  const err = /maybeToFirst: Maybe returning function required/
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

  const good = maybeToFirst(lift, some)
  const bad = maybeToFirst(lift, undefined)

  t.ok(isSameType(First, good), 'returns a First with a Just')
  t.ok(isSameType(First, bad), 'returns a First with a Nothing')

  t.equals(good.option(none), some, 'Just maps to a First')
  t.equals(bad.option(none), none, 'Nothing maps to an Empty')

  t.end()
})
