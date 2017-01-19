const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const second = require('./second')

test('second pointfree', t => {
  const s = bindFunc(second)

  const x = 'result'
  const m = { second: sinon.spy(constant(x)) }

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

  t.doesNotThrow(s(m), 'allows an Arrow')

  const res = second(m)

  t.ok(m.second.called, 'calls second on Arrow')
  t.equal(res, x, 'returns the result of second on Arrow')

  t.end()
})
