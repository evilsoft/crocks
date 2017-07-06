const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const constant = require('./core/constant')
const isFunction  = require('./core/isFunction')
const unit = require('./core/unit')

const evalWith = require('./evalWith')

test('evalWith pointfree', t => {
  const f = bindFunc(evalWith)
  const x = 'result'
  const m = { evalWith: sinon.spy(constant(x)) }

  t.ok(isFunction(evalWith), 'is a function')

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
  t.throws(f(13, unit), TypeError, 'throws if passed a function')

  const result = evalWith(23)(m)

  t.ok(m.evalWith.called, 'calls evalWith on the passed container')
  t.equal(result, x, 'returns the result of calling m.evalWith')

  t.end()
})
