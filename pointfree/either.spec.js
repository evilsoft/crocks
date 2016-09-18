const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const constant = require('../combinators/constant')

const either = require('./either')

test('either pointfree', t => {
  const f = bindFunc(either)
  const x = 'result'
  const m = { either: sinon.spy(constant(x)) }

  t.ok(isFunction(either), 'is a function')

  t.throws(f(undefined, noop, m), TypeError, 'throws if first arg undefined')
  t.throws(f(null, noop, m), TypeError, 'throws if first arg passed null')
  t.throws(f(0, noop, m), TypeError, 'throws if first arg passed a falsey number')
  t.throws(f(1, noop, m), TypeError, 'throws if first arg passed a truthy number')
  t.throws(f('', noop, m), TypeError, 'throws if first arg passed a falsey string')
  t.throws(f('string', noop, m), TypeError, 'throws if first arg passed a truthy string')
  t.throws(f(false, noop, m), TypeError, 'throws if first arg passed false')
  t.throws(f(true, noop, m), TypeError, 'throws if first arg passed true')
  t.throws(f([], noop, m), TypeError, 'throws if first arg passed an array')
  t.throws(f({}, noop, m), TypeError, 'throws if first arg passed an object')

  t.throws(f(noop, undefined, m), TypeError, 'throws if second arg undefined')
  t.throws(f(noop, null, m), TypeError, 'throws if second second arg passed null')
  t.throws(f(noop, 0, m), TypeError, 'throws if second arg passed a falsey number')
  t.throws(f(noop, 1, m), TypeError, 'throws if second arg passed a truthy number')
  t.throws(f(noop, '', m), TypeError, 'throws if second arg passed a falsey string')
  t.throws(f(noop, 'string', m), TypeError, 'throws if second arg passed a truthy string')
  t.throws(f(noop, false, m), TypeError, 'throws if second arg passed false')
  t.throws(f(noop, true, m), TypeError, 'throws if second arg passed true')
  t.throws(f(noop, [], m), TypeError, 'throws if second arg passed an array')
  t.throws(f(noop, {}, m), TypeError, 'throws if second arg passed an object')

  t.throws(f(noop, noop, undefined), TypeError, 'throws if third arg undefined')
  t.throws(f(noop, noop, null), TypeError, 'throws if third arg passed null')
  t.throws(f(noop, noop, 0), TypeError, 'throws if third arg passed a falsey number')
  t.throws(f(noop, noop, 1), TypeError, 'throws if third arg passed a truthy number')
  t.throws(f(noop, noop, ''), TypeError, 'throws if third arg passed a falsey string')
  t.throws(f(noop, noop, 'string'), TypeError, 'throws if third arg passed a truthy string')
  t.throws(f(noop, noop, false), TypeError, 'throws if third arg passed false')
  t.throws(f(noop, noop, true), TypeError, 'throws if third arg passed true')
  t.throws(f(noop, noop, []), TypeError, 'throws if third arg passed an array')
  t.throws(f(noop, noop, {}), TypeError, 'throws if third arg passed an object')

  const result = either(noop, noop, m)

  t.ok(m.either.called, 'calls either on the passed container')
  t.equal(result, x, 'returns the result of calling m.either')

  t.end()
})
