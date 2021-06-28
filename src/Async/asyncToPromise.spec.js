const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Async = require('.')
const isFunction  = require('../core/isFunction')
const isPromise  = require('../core/isPromise')

const unit = () => undefined
const identity = x => x

const asyncToPromise = require('./asyncToPromise')

test('asyncToPromise transform', t => {
  const f = bindFunc(asyncToPromise)
  const m = Async(unit)

  const err = /asyncToPromise: Argument must be an Async or a Function that returns an Async/

  t.ok(isFunction(asyncToPromise), 'is a function')

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

test('asyncToPromise with Async', t => {
  const data = 'TestData'
  const async = Async.of(data)

  const p = asyncToPromise(async)

  const rej = y => x => t.equal(x, y, 'rejects a rejected Promise')
  const res = y => x => t.equal(x, y, 'resolves a resolved Promise')

  t.ok(isPromise(p), 'returns a promise from Async')
  p.then(res(data)).catch(rej(data))

  t.end()
})

test('asyncToPromise with Async returning function', t => {
  const f = bindFunc(asyncToPromise(identity))

  t.throws(f(undefined), TypeError, 'throws if function returns undefined')
  t.throws(f(null), TypeError, 'throws if function returns null')
  t.throws(f(0), TypeError, 'throws if function returns a falsey number')
  t.throws(f(1), TypeError, 'throws if function returns a truthy number')
  t.throws(f(''), TypeError, 'throws if function returns a falsey string')
  t.throws(f('string'), TypeError, 'throws if function returns a truthy string')
  t.throws(f(false), TypeError, 'throws if function returns false')
  t.throws(f(true), TypeError, 'throws if function returns true')
  t.throws(f({}), TypeError, 'throws if function returns an object')
  t.throws(f([]), TypeError, 'throws if function returns an array')

  const data = 'TestData'
  const promise = Async.of(data)

  const m = asyncToPromise(identity, promise)
  const rej = y => x => t.equal(x, y, 'rejects a rejected Promise')
  const res = y => x => t.equal(x, y, 'preserves the structure of underlying data')

  t.ok(isPromise(m), 'returns a promise from a function returning a Async')
  m.then(res(data)).catch(rej(data))

  t.end()
})
