const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const Pair = require('../crocks/Pair')

const second = require('./second')

test('second pointfree', t => {
  const s = bindFunc(second)

  const m = { second: noop }

  t.ok(isFunction(second), 'is a function')

  t.throws(s(undefined), 'throws if arg is undefined')
  t.throws(s(null), 'throws if arg is null')
  t.throws(s(0), 'throws if arg is a falsey number')
  t.throws(s(1), 'throws if arg is a truthy number')
  t.throws(s(''), 'throws if arg is a falsey string')
  t.throws(s('string'), 'throws if arg is a truthy string')
  t.throws(s(false), 'throws if arg is false')
  t.throws(s(true), 'throws if arg is true')
  t.throws(s({}), 'throws if arg is an object')
  t.throws(s([]), 'throws if arg is an array')

  t.doesNotThrow(s(noop), 'allows a Function')
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

  t.throws(g(undefined), TypeError, 'throws when wrapped function called with undefined')
  t.throws(g(null), TypeError, 'throws when wrapped function called with null')
  t.throws(g(0), TypeError, 'throws when wrapped function called with falsey number')
  t.throws(g(1), TypeError, 'throws when wrapped function called with truthy number')
  t.throws(g(''), TypeError, 'throws when wrapped function called with falsey string')
  t.throws(g('string'), TypeError, 'throws when wrapped function called with truthy string')
  t.throws(g(false), TypeError, 'throws when wrapped function called with false')
  t.throws(g(true), TypeError, 'throws when wrapped function called with true')
  t.throws(g({}), TypeError, 'throws when wrapped function called with an Object')
  t.throws(g([]), TypeError, 'throws when wrapped function called with an Array')
  t.throws(g(noop), TypeError, 'throws when wrapped function called with a function')

  t.equal(res.fst(), 3, 'Does not Apply function to `fst` of the Pair')
  t.equal(res.snd(), 4, 'Applies function to `snd` of the Pair')

  t.end()
})
