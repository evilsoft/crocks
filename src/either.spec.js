const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const constant = require('./core/constant')
const isFunction = require('./core/isFunction')
const unit = require('./core/unit')

const either = require('./either')

test('either pointfree', t => {
  const f = bindFunc(either)
  const x = 'result'
  const m = { either: sinon.spy(constant(x)) }

  t.ok(isFunction(either), 'is a function')

  t.throws(f(undefined, unit, m), TypeError, 'throws if first arg undefined')
  t.throws(f(null, unit, m), TypeError, 'throws if first arg passed null')
  t.throws(f(0, unit, m), TypeError, 'throws if first arg passed a falsey number')
  t.throws(f(1, unit, m), TypeError, 'throws if first arg passed a truthy number')
  t.throws(f('', unit, m), TypeError, 'throws if first arg passed a falsey string')
  t.throws(f('string', unit, m), TypeError, 'throws if first arg passed a truthy string')
  t.throws(f(false, unit, m), TypeError, 'throws if first arg passed false')
  t.throws(f(true, unit, m), TypeError, 'throws if first arg passed true')
  t.throws(f([], unit, m), TypeError, 'throws if first arg passed an array')
  t.throws(f({}, unit, m), TypeError, 'throws if first arg passed an object')

  t.throws(f(unit, undefined, m), TypeError, 'throws if second arg undefined')
  t.throws(f(unit, null, m), TypeError, 'throws if second second arg passed null')
  t.throws(f(unit, 0, m), TypeError, 'throws if second arg passed a falsey number')
  t.throws(f(unit, 1, m), TypeError, 'throws if second arg passed a truthy number')
  t.throws(f(unit, '', m), TypeError, 'throws if second arg passed a falsey string')
  t.throws(f(unit, 'string', m), TypeError, 'throws if second arg passed a truthy string')
  t.throws(f(unit, false, m), TypeError, 'throws if second arg passed false')
  t.throws(f(unit, true, m), TypeError, 'throws if second arg passed true')
  t.throws(f(unit, [], m), TypeError, 'throws if second arg passed an array')
  t.throws(f(unit, {}, m), TypeError, 'throws if second arg passed an object')

  t.throws(f(unit, unit, undefined), TypeError, 'throws if third arg undefined')
  t.throws(f(unit, unit, null), TypeError, 'throws if third arg passed null')
  t.throws(f(unit, unit, 0), TypeError, 'throws if third arg passed a falsey number')
  t.throws(f(unit, unit, 1), TypeError, 'throws if third arg passed a truthy number')
  t.throws(f(unit, unit, ''), TypeError, 'throws if third arg passed a falsey string')
  t.throws(f(unit, unit, 'string'), TypeError, 'throws if third arg passed a truthy string')
  t.throws(f(unit, unit, false), TypeError, 'throws if third arg passed false')
  t.throws(f(unit, unit, true), TypeError, 'throws if third arg passed true')
  t.throws(f(unit, unit, []), TypeError, 'throws if third arg passed an array')
  t.throws(f(unit, unit, {}), TypeError, 'throws if third arg passed an object')

  const result = either(unit, unit, m)

  t.ok(m.either.called, 'calls either on the passed container')
  t.equal(result, x, 'returns the result of calling m.either')

  t.end()
})
