const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../../test/helpers')

const bindFunc    = helpers.bindFunc

const constant = require('../core/constant')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const option = require('./option')

test('option pointfree', t => {
  const f = bindFunc(option)
  const x = 'result'
  const m = { option: sinon.spy(constant(x)) }

  t.ok(isFunction(option), 'is a function')

  t.throws(f(0, undefined), TypeError, 'throws if undefined in second arg')
  t.throws(f(0, null), TypeError, 'throws if passed null in second arg')
  t.throws(f(0, 0), TypeError, 'throws if passed a falsey number in second arg')
  t.throws(f(0, 1), TypeError, 'throws if passed a truthy number in second arg')
  t.throws(f(0, ''), TypeError, 'throws if passed a falsey string in second arg')
  t.throws(f(0, 'string'), TypeError, 'throws if passed a truthy string in second arg')
  t.throws(f(0, false), TypeError, 'throws if passed false in second arg')
  t.throws(f(0, true), TypeError, 'throws if passed true in second arg')
  t.throws(f(0, []), TypeError, 'throws if passed an array in second arg')
  t.throws(f(0, {}), TypeError, 'throws if passed an object in second arg')
  t.throws(f(0, unit), TypeError, 'throws if passed a function in second arg')

  const result = option(0, m)

  t.ok(m.option.called, 'calls option on the passed container')
  t.equal(result, x, 'returns the result of calling m.option')

  t.end()
})
