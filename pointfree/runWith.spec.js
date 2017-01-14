const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction  = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const runWith = require('./runWith')

test('runWith pointfree', t => {
  const f = bindFunc(runWith)
  const x = 'result'
  const m = { runWith: sinon.spy(constant(x)) }

  t.ok(isFunction(runWith), 'is a function')

  t.throws(f(13, undefined), TypeError, 'throws if passed undefined')
  t.throws(f(13, null), TypeError, 'throws if passed null')
  t.throws(f(13, 0), TypeError, 'throws if passed a falsey number')
  t.throws(f(13, 1), TypeError, 'throws if passed a truthy number')
  t.throws(f(13, ''), TypeError, 'throws if passed a falsey string')
  t.throws(f(13, 'string'), TypeError, 'throws if passed a truthy string')
  t.throws(f(13, false), TypeError, 'throws if passed false')
  t.throws(f(13, true), TypeError, 'throws if passed true')
  t.throws(f(13, []), TypeError, 'throws if passed an array')
  t.throws(f(13, {}), TypeError, 'throws if passed an object')
  t.throws(f(13, noop), TypeError, 'throws if passed a function')

  const result = runWith(23)(m)

  t.ok(m.runWith.called, 'calls runWith on the passed container')
  t.equal(result, x, 'returns the result of calling m.runWith')

  t.end()
})
