const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Last = require('.')
const Maybe = require('../core/Maybe')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const maybeToLast = require('./maybeToLast')

test('maybeToLast transform', t => {
  const f = bindFunc(maybeToLast)

  t.ok(isFunction(maybeToLast), 'is a function')

  const err = /maybeToLast: Maybe or Maybe returning function required/
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

test('maybeToLast with Maybe', t => {
  const some = 'something'
  const none = 'nothing'

  const good = maybeToLast(Maybe.Just(some))
  const bad = maybeToLast(Maybe.Nothing())

  t.ok(isSameType(Last, good), 'returns a Last when Just')
  t.ok(isSameType(Last, bad), 'returns a Last when Nothing')

  t.equals(good.option(none), some, 'Just maps to a Last')
  t.equals(bad.option(none), none, 'Nothing maps to an Empty')

  t.end()
})

test('maybeToLast with Maybe returning function', t => {
  const some = 'something'
  const none = 'nothing'

  t.ok(isFunction(maybeToLast(Last)), 'returns a function')

  const f = bindFunc(maybeToLast(identity))

  const err = /maybeToLast: Maybe returning function required/
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

  const good = maybeToLast(lift, some)
  const bad = maybeToLast(lift, undefined)

  t.ok(isSameType(Last, good), 'returns a Last with a Just')
  t.ok(isSameType(Last, bad), 'returns a Last with a Nothing')

  t.equals(good.option(none), some, 'Just maps to a Last')
  t.equals(bad.option(none), none, 'Nothing maps to an Empty')

  t.end()
})
