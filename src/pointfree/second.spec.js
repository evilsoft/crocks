const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Pair = require('../core/Pair')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const second = require('./second')

test('second pointfree', t => {
  const s = bindFunc(second)

  const m = { second: unit }

  t.ok(isFunction(second), 'is a function')

  const err = /second: Arrow, Function or Star required/
  t.throws(s(undefined), err, 'throws if arg is undefined')
  t.throws(s(null), err, 'throws if arg is null')
  t.throws(s(0), err, 'throws if arg is a falsey number')
  t.throws(s(1), err, 'throws if arg is a truthy number')
  t.throws(s(''), err, 'throws if arg is a falsey string')
  t.throws(s('string'), err, 'throws if arg is a truthy string')
  t.throws(s(false), err, 'throws if arg is false')
  t.throws(s(true), err, 'throws if arg is true')
  t.throws(s({}), err, 'throws if arg is an object')
  t.throws(s([]), err, 'throws if arg is an array')

  t.doesNotThrow(s(unit), 'allows a Function')
  t.doesNotThrow(s(m), 'allows an Arrow')

  t.end()
})

test('second with Arrow or Star', t => {
  const x = 'result'
  const m = { second: sinon.spy(constant(x)) }
  const res = second(m)

  t.ok(m.second.called, 'calls second on Arrow or Star')
  t.equal(res, x, 'returns the result of second on Arrow or Star')

  t.end()
})

test('second with Function', t => {
  const f = second(x => x + 1)
  const g = bindFunc(f)

  const res = f(Pair(3, 3))

  const err = /second: Pair required as input/
  t.throws(g(undefined), err, 'throws when wrapped function called with undefined')
  t.throws(g(null), err, 'throws when wrapped function called with null')
  t.throws(g(0), err, 'throws when wrapped function called with falsey number')
  t.throws(g(1), err, 'throws when wrapped function called with truthy number')
  t.throws(g(''), err, 'throws when wrapped function called with falsey string')
  t.throws(g('string'), err, 'throws when wrapped function called with truthy string')
  t.throws(g(false), err, 'throws when wrapped function called with false')
  t.throws(g(true), err, 'throws when wrapped function called with true')
  t.throws(g({}), err, 'throws when wrapped function called with an Object')
  t.throws(g([]), err, 'throws when wrapped function called with an Array')
  t.throws(g(unit), err, 'throws when wrapped function called with a function')

  t.equal(res.fst(), 3, 'Does not Apply function to `fst` of the Pair')
  t.equal(res.snd(), 4, 'Applies function to `snd` of the Pair')

  t.end()
})
