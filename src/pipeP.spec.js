const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('./core/unit')

const identity = require('./core/identity')
const isFunction = require('./core/isFunction')

const pipeP = require('./pipeP')

test('pipeP errors', t => {
  const prom = x => Promise.resolve(x)

  const pp = bindFunc(pipeP)
  const f = bindFunc(pipeP(unit))
  const g = bindFunc(pipeP(unit, prom))

  t.ok(isFunction(pipeP), 'pipeP is a function')

  const err = /pipeP: Promise returning functions required/
  t.throws(pipeP, err, 'throws when nothing passed')

  t.throws(f(), err, 'throws when single function does not return a Promise')
  t.throws(g(), err, 'throws when head function does not return a Promise')

  t.throws(pp(undefined), err, 'throws when undefined passed')
  t.throws(pp(null), err, 'throws when null passed')
  t.throws(pp(''), err, 'throws when falsey string passed')
  t.throws(pp('string'), err, 'throws when truthy string passed')
  t.throws(pp(0), err, 'throws when falsy number passed')
  t.throws(pp(1), err, 'throws when truthy number passed')
  t.throws(pp(false), err, 'throws when false passed')
  t.throws(pp(true), err, 'throws when true passed')
  t.throws(pp({}), err, 'throws when object passed')
  t.throws(pp([]), err, 'throws when array passed')

  t.throws(pp(prom, undefined), err, 'throws when undefined passed as second argument')
  t.throws(pp(prom, null), err, 'throws when null passed as second argument')
  t.throws(pp(prom, ''), err, 'throws when falsey string passed as second argument')
  t.throws(pp(prom, 'string'), err, 'throws when truthy string passed as second argument')
  t.throws(pp(prom, 0), err, 'throws when falsy number passed as second argument')
  t.throws(pp(prom, 1), err, 'throws when truthy number passed as second argument')
  t.throws(pp(prom, false), err, 'throws when false passed as second argument')
  t.throws(pp(prom, true), err, 'throws when true passed as second argument')
  t.throws(pp(prom, {}), err, 'throws when object passed as second argument')
  t.throws(pp(prom, []), err, 'throws when array passed as second argument')

  t.end()
})

test('pipeP helper', t => {
  t.plan(5)

  const res = x => Promise.resolve(x)
  const rej = x => Promise.reject(x)
  const data = 34

  t.ok(isFunction(pipeP(res)), 'returns a function')

  const resolved = pipeP(res, identity)
  const rejected = pipeP(rej, identity)

  resolved(data)
    .then(x => t.equals(x, data, 'resolves with the expected value'))

  rejected(data)
    .catch(x => t.equals(x, data, 'rejects with the expected value'))

  const singleResolved = pipeP(res)
  const singleRejected = pipeP(rej)

  singleResolved(data)
    .then(x => t.equals(x, data, 'resolves with the expected value with one function'))

  singleRejected(data)
    .catch(x => t.equals(x, data, 'rejects with the expected value with one function'))
})
