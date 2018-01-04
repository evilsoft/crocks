const test = require('tape')
const helpers = require('../test/helpers')
const Last = require('../test/LastMonoid')

const bindFunc = helpers.bindFunc

const Pair = require('.')
const Writer = require('../Writer')(Last)

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const constant = x => () => x
const identity = x => x

const writerToPair = require('./writerToPair')

test('writerToPair transform', t => {
  const f = bindFunc(writerToPair)

  t.ok(isFunction(writerToPair), 'is a function')

  const err = /writerToPair: Writer or Writer returning function required/
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

test('writerToPair with Writer', t => {
  const value = 'something'
  const log = 'log'

  const p = writerToPair(Writer(log, value))

  t.ok(isSameType(Pair, p), 'returns a Pair')

  t.equals(p.snd(), value, 'second contains the value')
  t.ok(isSameType(Last, p.fst()), 'first contains the Writers Monoid')
  t.equals(p.fst().valueOf(), log, 'first Monoid wraps the same log value from Writer')

  t.end()
})

test('writerToPair with Writer returning function', t => {
  const value = 'something'
  const log = 'log'

  t.ok(isFunction(constant(writerToPair(Writer(log, value)))), 'returns a function')

  const f = bindFunc(writerToPair(identity))

  const err = /writerToPair: Writer returning function required/
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
    x => Writer(log, x)

  const p = writerToPair(lift, value)

  t.ok(isSameType(Pair, p), 'returns a Pair')

  t.equals(p.snd(), value, 'second contains the value')
  t.ok(isSameType(Last, p.fst()), 'first contains the Writers Monoid')
  t.equals(p.fst().valueOf(), log, 'first Monoid wraps the same log value from Writer')

  t.end()
})
