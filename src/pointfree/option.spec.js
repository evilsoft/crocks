const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const bindFunc    = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const option = require('./option')

test('option pointfree', t => {
  const f = bindFunc(option)
  const x = 'result'
  const m = { option: sinon.spy(constant(x)) }

  t.ok(isFunction(option), 'is a function')

  const err = /option: Last argument must be a Maybe/
  t.throws(f(0, undefined), err, 'throws if undefined in second arg')
  t.throws(f(0, null), err, 'throws if passed null in second arg')
  t.throws(f(0, 0), err, 'throws if passed a falsey number in second arg')
  t.throws(f(0, 1), err, 'throws if passed a truthy number in second arg')
  t.throws(f(0, ''), err, 'throws if passed a falsey string in second arg')
  t.throws(f(0, 'string'), err, 'throws if passed a truthy string in second arg')
  t.throws(f(0, false), err, 'throws if passed false in second arg')
  t.throws(f(0, true), err, 'throws if passed true in second arg')
  t.throws(f(0, []), err, 'throws if passed an array in second arg')
  t.throws(f(0, {}), err, 'throws if passed an object in second arg')
  t.throws(f(0, unit), err, 'throws if passed a function in second arg')

  const result = option(0, m)

  t.ok(m.option.called, 'calls option on the passed container')
  t.equal(result, x, 'returns the result of calling m.option')

  t.end()
})
