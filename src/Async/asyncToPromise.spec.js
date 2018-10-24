const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Async = require('.')
const isFunction  = require('../core/isFunction')

const unit = () => undefined

const asyncToPromise = require('./asyncToPromise')

test('asyncToPromise pointfree', t => {
  const f = bindFunc(asyncToPromise)
  const m = Async(unit)

  const err = /asyncToPromise: Async required/

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

  t.ok(isFunction(asyncToPromise), 'is a function')

  m.toPromise = sinon.spy()

  const result = asyncToPromise(m)

  t.ok(m.toPromise.called, 'calls asyncToPromise on the passed in container')
  t.equal(result, unit(), 'returns the result of calling asyncToPromise')

  t.end()
})
