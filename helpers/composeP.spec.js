const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../helpers/unit')

const identity = require('../combinators/identity')
const isFunction = require('../predicates/isFunction')

const composeP = require('./composeP')

test('composeP errors', t => {
  const prom = x => Promise.resolve(x)

  const pp = bindFunc(composeP)
  const f = bindFunc(composeP(unit))
  const g = bindFunc(composeP(prom, unit))

  const err = /composeP: Promise returning functions required/
  t.throws(composeP, err, 'throws when nothing passed')

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

  t.throws(pp(undefined, prom), err, 'throws when undefined passed')
  t.throws(pp(null, prom), err, 'throws when null passed')
  t.throws(pp('', prom), err, 'throws when falsey string passed')
  t.throws(pp('string', prom), err, 'throws when truthy string passed')
  t.throws(pp(0, prom), err, 'throws when falsy number passed')
  t.throws(pp(1, prom), err, 'throws when truthy number passed')
  t.throws(pp(false, prom), err, 'throws when false passed')
  t.throws(pp(true, prom), err, 'throws when true passed')
  t.throws(pp({}, prom), err, 'throws when object passed')
  t.throws(pp([], prom), err, 'throws when array passed')

  t.end()
})

test('composeP functionality', t => {
  t.plan(6)

  t.ok(isFunction(composeP), 'composeP is a function')

  const res = x => Promise.resolve(x)
  const rej = x => Promise.reject(x)
  const data = 34

  t.ok(isFunction(composeP(res)), 'returns a function')

  const resolved = composeP(identity, res)
  const rejected = composeP(identity, rej)

  resolved(data)
    .then(x => t.equals(x, data, 'resolves with the expected value'))

  rejected(data)
    .catch(x => t.equals(x, data, 'rejects with the expected value'))

  const singleResolved = composeP(res)
  const singleRejected = composeP(rej)

  singleResolved(data)
    .then(x => t.equals(x, data, 'resolves with the expected value with one function'))

  singleRejected(data)
    .catch(x => t.equals(x, data, 'rejects with the expected value with one function'))
})
