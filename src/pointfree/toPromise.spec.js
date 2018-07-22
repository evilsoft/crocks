const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction  = require('../core/isFunction')

const Async = require('../Async')
const toPromise = require('./toPromise')

test('toPromise pointfree', t => {
  t.plan(13)

  const f = bindFunc(toPromise)
  const result = 1337

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

  const rej = y => x => t.equal(x, y, 'rejects a rejected Async')
  const res = y => x => t.equal(x, y, 'resolves a resolved Async')

  const testFunc = a => toPromise(a).then(res(result)).catch(rej(result))

  t.ok(isFunction(toPromise), 'is a function')

  testFunc(Async.Rejected(result))
  testFunc(Async.Resolved(result))
})
