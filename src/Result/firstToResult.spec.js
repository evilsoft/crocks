const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Result = require('.')
const First = require('../First')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const identity = x => x

const firstToResult = require('./firstToResult')

test('firstToResult transform', t => {
  const f = bindFunc(firstToResult)
  const x = 23

  t.ok(isFunction(firstToResult), 'is a function')

  const err = /firstToResult: First or First returning function required for second argument/
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

test('firstToResult with First', t => {
  const some = 'first'
  const none = 'empty'

  const good = firstToResult(none, First(some))
  const bad = firstToResult(none, First.empty())

  t.ok(isSameType(Result, good), 'returns an Result with a First')
  t.ok(isSameType(Result, bad), 'returns an Result with an Empty')

  t.equals(good.either(identity, identity), some, 'First maps to an Ok')
  t.equals(bad.either(identity, identity), none, 'Empty maps to an Err with option value')

  t.end()
})

test('firstToResult with First returning function', t => {
  const some = 'first'
  const none = 'empty'

  t.ok(isFunction(firstToResult(none, First)), 'returns a function')

  const f = bindFunc(firstToResult(none, identity))

  const err = /firstToResult: First returning function required for second argument/
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

  const good = firstToResult(none, lift, some)
  const bad = firstToResult(none, lift, undefined)

  t.ok(isSameType(Result, good), 'returns an Result with a First')
  t.ok(isSameType(Result, bad), 'returns an Result with an Empty')

  t.equals(good.either(identity, identity), some, 'First maps to an Ok')
  t.equals(bad.either(identity, identity), none, 'Empty maps to an Err with option value')

  t.end()
})
