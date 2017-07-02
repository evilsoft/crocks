const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const constant = require('./core/constant')
const identity = require('./core/identity')

const pipeS = require('./pipeS')

const Mock = x => ({
  compose: sinon.spy(identity),
  type: constant('Mock'),
  value: constant(x)
})

test('pipeS parameters', t => {
  const c = bindFunc(pipeS)

  const err = /pipeS: Semigroupoids of the same type required/
  t.throws(pipeS, err, 'throws when nothing passed')

  t.throws(c(undefined, Mock(0)), err, 'throws when undefined passed first')
  t.throws(c(null, Mock(0)), err, 'throws when null passed passed first')
  t.throws(c('', Mock(0)), err, 'throws when falsey string passed first')
  t.throws(c('string', Mock(0)), err, 'throws when truthy string passed first')
  t.throws(c(0, Mock(0)), err, 'throws when falsy number passed first')
  t.throws(c(1, Mock(0)), err, 'throws when truthy number passed first')
  t.throws(c(false, Mock(0)), err, 'throws when false passed first')
  t.throws(c(true, Mock(0)), err, 'throws when true passed first')
  t.throws(c({}, Mock(0)), err, 'throws when object passed first')
  t.throws(c([], Mock(0)), err, 'throws when array passed first')
  t.throws(c(identity, Mock(0)), err, 'throws when function passed first')

  t.throws(c(Mock(0), undefined), err, 'throws when undefined passed after first')
  t.throws(c(Mock(0), null), err, 'throws when null passed passed after first')
  t.throws(c(Mock(0), ''), err, 'throws when falsey string passed after first')
  t.throws(c(Mock(0), 'string'), err, 'throws when truthy string passed after first')
  t.throws(c(Mock(0), 0), err, 'throws when falsy number passed after first')
  t.throws(c(Mock(0), 1), err, 'throws when truthy number passed after first')
  t.throws(c(Mock(0), false), err, 'throws when false passed after first')
  t.throws(c(Mock(0), true), err, 'throws when true passed after first')
  t.throws(c(Mock(0), {}), err, 'throws when object passed after first')
  t.throws(c(Mock(0), []), err, 'throws when array passed after first')
  t.throws(c(Mock(0), identity), err, 'throws when function passed after first')

  t.end()
})

test('pipeS helper', t => {
  const f = Mock('a')
  const g = Mock('b')
  const h = Mock('c')

  const m = pipeS(f, g, h)

  t.ok(f.compose.calledWith(g), 'calls compose on the first (head) passing the next')
  t.ok(g.compose.calledWith(h), 'calls compose on the penultimate passing the last')
  t.equals(g.compose.lastCall.returnValue, m, 'returns the result of compose on the penultimate argument')

  f.compose.reset()

  const single = pipeS(f)

  t.equals(single, f, 'returns the semigroupoid when only one is passed in')

  t.end()
})
