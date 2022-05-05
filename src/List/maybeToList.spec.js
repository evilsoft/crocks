const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const List = require('.')
const Maybe = require('../core/Maybe')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const maybeToList = require('./maybeToList')

test('maybeToList transform', t => {
  const f = bindFunc(maybeToList)

  t.ok(isFunction(maybeToList), 'is a function')

  const err = /maybeToList: Argument must be a Maybe instance or a Maybe returning function/
  t.throws(f(undefined), err, 'throws if first arg is undefined')
  t.throws(f(null), err, 'throws if first arg is null')
  t.throws(f(0), err, 'throws if first arg is a falsey number')
  t.throws(f(1), err, 'throws if first arg is a truthy number')
  t.throws(f(''), err, 'throws if first arg is a falsey string')
  t.throws(f('string'), err, 'throws if first arg is a truthy string')
  t.throws(f(false), err, 'throws if first arg is false')
  t.throws(f(true), err, 'throws if first arg is true')
  t.throws(f([]), err, 'throws if first arg is an array')
  t.throws(f({}), err, 'throws if first arg is an object')

  t.end()
})

test('maybeToList with Maybe', t => {
  const some = 'something'

  const good = maybeToList(Maybe.Just(some))
  const bad = maybeToList(Maybe.Nothing())

  t.ok(isSameType(List, good), 'returns a List with a Just')
  t.ok(isSameType(List, bad), 'returns a List with a Nothing')

  t.ok(good.equals(List.of(some)), 'Just maps to single item List containing the value')
  t.ok(bad.equals(List.empty()), 'Nothing maps to an empty List')

  t.end()
})

test('maybeToList with Maybe returning function', t => {
  const some = 'something'

  t.ok(isFunction(maybeToList(Maybe.of)), 'returns a function')

  const f = bindFunc(maybeToList(identity))

  const err = /maybeToList: Argument must be a Maybe instance or a Maybe returning function/
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

  const good = maybeToList(lift, some)
  const bad = maybeToList(lift, undefined)

  t.ok(isSameType(List, good), 'returns a List with a Just')
  t.ok(isSameType(List, bad), 'returns a List with a Nothing')

  t.ok(good.equals(List.of(some)), 'Just maps to single item List containing the value')
  t.ok(bad.equals(List.empty()), 'Nothing maps to an empty List')

  t.end()
})
