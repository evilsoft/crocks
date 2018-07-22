const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction  = require('../core/isFunction')

const constant = x => () => x

const toPromise = require('./toPromise')

test('toPromise pointfree', t => {
  const f = bindFunc(toPromise)
  const x = 1337
  const m = { toPromise: sinon.spy(constant(x)) }

  const err = /toPromise: Async required/

  t.throws(f(undefined), err, 'throws if passed undefined')
  t.throws(f(null), err, 'throws if passed null')
  t.throws(f(0), err, 'throws if passed a falsey number')
  t.throws(f(1), err, 'throws if passed a truthy number')
  t.throws(f(''), err, 'throws if passed a falsey string')
  t.throws(f('string'), err, 'throws if passed a truthy string')
  t.throws(f(false), err, 'throws if passed false')
  t.throws(f(true), err, 'throws if passed true')
  t.throws(f([]), err, 'throws if passed an array')
  t.throws(f({}), err, 'throws if passed an object')

  t.ok(isFunction(toPromise), 'is a function')

  const result = toPromise(m)

  t.ok(m.toPromise.called, 'calls toPromise on the passed in container')
  t.equal(result, x, 'returns the result of calling toPromise')
})
