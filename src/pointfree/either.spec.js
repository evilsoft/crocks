const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const either = require('./either')

test('either pointfree', t => {
  const f = bindFunc(either)
  const x = 'result'
  const m = { either: sinon.spy(constant(x)) }

  t.ok(isFunction(either), 'is a function')

  const err = /either: First two arguments must be functions/
  t.throws(f(undefined, unit, m), err, 'throws if first arg undefined')
  t.throws(f(null, unit, m), err, 'throws if first arg passed null')
  t.throws(f(0, unit, m), err, 'throws if first arg passed a falsey number')
  t.throws(f(1, unit, m), err, 'throws if first arg passed a truthy number')
  t.throws(f('', unit, m), err, 'throws if first arg passed a falsey string')
  t.throws(f('string', unit, m), err, 'throws if first arg passed a truthy string')
  t.throws(f(false, unit, m), err, 'throws if first arg passed false')
  t.throws(f(true, unit, m), err, 'throws if first arg passed true')
  t.throws(f([], unit, m), err, 'throws if first arg passed an array')
  t.throws(f({}, unit, m), err, 'throws if first arg passed an object')

  t.throws(f(unit, undefined, m), err, 'throws if second arg undefined')
  t.throws(f(unit, null, m), err, 'throws if second second arg passed null')
  t.throws(f(unit, 0, m), err, 'throws if second arg passed a falsey number')
  t.throws(f(unit, 1, m), err, 'throws if second arg passed a truthy number')
  t.throws(f(unit, '', m), err, 'throws if second arg passed a falsey string')
  t.throws(f(unit, 'string', m), err, 'throws if second arg passed a truthy string')
  t.throws(f(unit, false, m), err, 'throws if second arg passed false')
  t.throws(f(unit, true, m), err, 'throws if second arg passed true')
  t.throws(f(unit, [], m), err, 'throws if second arg passed an array')
  t.throws(f(unit, {}, m), err, 'throws if second arg passed an object')

  const last = /either: Last argument must be an Either or Maybe/
  t.throws(f(unit, unit, undefined), last, 'throws if third arg undefined')
  t.throws(f(unit, unit, null), last, 'throws if third arg passed null')
  t.throws(f(unit, unit, 0), last, 'throws if third arg passed a falsey number')
  t.throws(f(unit, unit, 1), last, 'throws if third arg passed a truthy number')
  t.throws(f(unit, unit, ''), last, 'throws if third arg passed a falsey string')
  t.throws(f(unit, unit, 'string'), last, 'throws if third arg passed a truthy string')
  t.throws(f(unit, unit, false), last, 'throws if third arg passed false')
  t.throws(f(unit, unit, true), last, 'throws if third arg passed true')
  t.throws(f(unit, unit, []), last, 'throws if third arg passed an array')
  t.throws(f(unit, unit, {}), last, 'throws if third arg passed an object')

  const result = either(unit, unit, m)

  t.ok(m.either.called, 'calls either on the passed container')
  t.equal(result, x, 'returns the result of calling m.either')

  t.end()
})
