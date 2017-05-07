const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../helpers/unit')

const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const Pair = require('../crocks/Pair')

const first = require('./first')

test('first pointfree', t => {
  const f = bindFunc(first)

  const x = 'result'
  const m = { first: sinon.spy(constant(x)) }

  t.ok(isFunction(first), 'is a function')

  t.throws(f(undefined), 'throws if arg is undefined')
  t.throws(f(null), 'throws if arg is null')
  t.throws(f(0), 'throws if arg is a falsey number')
  t.throws(f(1), 'throws if arg is a truthy number')
  t.throws(f(''), 'throws if arg is a falsey string')
  t.throws(f('string'), 'throws if arg is a truthy string')
  t.throws(f(false), 'throws if arg is false')
  t.throws(f(true), 'throws if arg is true')
  t.throws(f({}), 'throws if arg is an object')
  t.throws(f([]), 'throws if arg is an array')

  t.doesNotThrow(f(m), 'allows an Arrow')
  t.doesNotThrow(f(unit), 'allows a function')

  t.end()
})

test('first with Arrow or Star', t => {
  const x = 'result'
  const m = { first: sinon.spy(constant(x)) }
  const res = first(m)

  t.ok(m.first.called, 'calls first on Arrow or Star')
  t.equal(res, x, 'returns the result of first on Arrow or Star')

  t.end()
})

test('first with Function', t => {
  const f = first(x => x + 1)
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
  t.throws(g(unit), TypeError, 'throws when wrapped function called with a function')

  t.equal(res.fst(), 4, 'Applies function to `fst` of the Pair')
  t.equal(res.snd(), 3, 'Does not Apply function to `snd` of the Pair')

  t.end()
})
