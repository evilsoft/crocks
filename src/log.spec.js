const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const constant = require('./core/constant')
const isFunction = require('./core/isFunction')
const unit = require('./core/unit')

const log = require('./log')

test('log pointfree', t => {
  const f = bindFunc(log)
  const x = 'result'
  const m = { log: sinon.spy(constant(x)) }

  t.ok(isFunction(log), 'is a function')

  t.throws(f(undefined), TypeError, 'throws if passed undefined')
  t.throws(f(null), TypeError, 'throws if passed null')
  t.throws(f(0), TypeError, 'throws if passed a falsey number')
  t.throws(f(1), TypeError, 'throws if passed a truthy number')
  t.throws(f(''), TypeError, 'throws if passed a falsey string')
  t.throws(f('string'), TypeError, 'throws if passed a truthy string')
  t.throws(f(false), TypeError, 'throws if passed false')
  t.throws(f(true), TypeError, 'throws if passed true')
  t.throws(f([]), TypeError, 'throws if passed an array')
  t.throws(f({}), TypeError, 'throws if passed an object')
  t.throws(f(unit), TypeError, 'throws if passed a function')

  const result = log(m)

  t.ok(m.log.called, 'calls log on the passed container')
  t.equal(result, x, 'returns the result of calling m.log')

  t.end()
})
