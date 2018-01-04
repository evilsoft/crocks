const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Maybe = require('.')
const First = require('../First')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const firstToMaybe = require('./firstToMaybe')

test('firstToMaybe transform', t => {
  const f = bindFunc(firstToMaybe)

  t.ok(isFunction(firstToMaybe), 'is a function')

  const err = /firstToMaybe: First or First returning function required/
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

test('firstToMaybe with First', t => {
  const some = 'first'
  const none = 'empty'

  const good = firstToMaybe(First(some))
  const bad = firstToMaybe(First.empty())

  t.ok(isSameType(Maybe, good), 'returns a Maybe when First')
  t.ok(isSameType(Maybe, bad), 'returns a Maybe when Empty')

  t.equals(good.option(none), some, 'First maps to a Just')
  t.equals(bad.option(none), none, 'Empty maps to a Nothing')

  t.end()
})

test('firstToMaybe with First returning function', t => {
  const some = 'first'
  const none = 'empty'

  t.ok(isFunction(firstToMaybe(Maybe.of)), 'returns a function')

  const f = bindFunc(firstToMaybe(identity))

  const err = /firstToMaybe: First returning function required/
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

  const good = firstToMaybe(lift, some)
  const bad = firstToMaybe(lift, undefined)

  t.ok(isSameType(Maybe, good), 'returns a Maybe with a First')
  t.ok(isSameType(Maybe, bad), 'returns a Maybe with an Empty')

  t.equals(good.option(none), some, 'First maps to a Just')
  t.equals(bad.option(none), none, 'Empty maps to a Nothing')

  t.end()
})
