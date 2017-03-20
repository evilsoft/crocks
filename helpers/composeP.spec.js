const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const identity = require('../combinators/identity')
const isFunction = require('../predicates/isFunction')

const composeP = require('./composeP')

test('composeP parameters', t => {
  const prom = x => Promise.resolve(x)

  const pp = bindFunc(composeP)
  const f = bindFunc(composeP(noop))
  const g = bindFunc(composeP(prom, noop))

  t.ok(isFunction(composeP), 'composeP is a function')

  const noArgs = /composeP: At least one Promise returning function required/
  t.throws(composeP, noArgs, 'throws when nothing passed')

  const noFuncs = /composeP: Only accepts Promise returning functions/
  t.throws(f(), noFuncs, 'throws when single function does not return a Promise')
  t.throws(g(), noFuncs, 'throws when head function does not return a Promise')

  t.throws(pp(undefined), noFuncs, 'throws when undefined passed')
  t.throws(pp(null), noFuncs, 'throws when null passed')
  t.throws(pp(''), noFuncs, 'throws when falsey string passed')
  t.throws(pp('string'), noFuncs, 'throws when truthy string passed')
  t.throws(pp(0), noFuncs, 'throws when falsy number passed')
  t.throws(pp(1), noFuncs, 'throws when truthy number passed')
  t.throws(pp(false), noFuncs, 'throws when false passed')
  t.throws(pp(true), noFuncs, 'throws when true passed')
  t.throws(pp({}), noFuncs, 'throws when object passed')
  t.throws(pp([]), noFuncs, 'throws when array passed')

  t.end()
})

test('composeP functionality', t => {
  t.plan(5)

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
