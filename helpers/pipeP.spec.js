const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const identity = require('../combinators/identity')
const isFunction = require('../predicates/isFunction')

const pipeP = require('./pipeP')

test('pipeP parameters', t => {
  const prom = x => Promise.resolve(x)

  const pp = bindFunc(pipeP)
  const f = bindFunc(pipeP(noop))
  const g = bindFunc(pipeP(noop, prom))

  t.ok(isFunction(pipeP), 'pipeP is a function')

  const noArgs = /pipeP: At least one Promise returning function required/
  t.throws(pipeP, noArgs, 'throws when nothing passed')

  const noFuncs = /pipeP: Only accepts Promise returning functions/
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

test('pipeP functionality', t => {
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
