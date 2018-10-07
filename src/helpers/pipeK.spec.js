const test = require('tape')
const sinon = require('sinon')
const Mock = require('../test/MockCrock')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')

const identity = x => x

const pipeK = require('./pipeK')

test('pipeK parameters', t => {
  const c = bindFunc(pipeK)

  const err = /pipeK: Chain returning functions of the same type required/
  t.throws(pipeK, err, 'throws when nothing passed')

  t.throws(c(undefined, identity), err, 'throws when undefined passed first')
  t.throws(c(null, identity), err, 'throws when null passed passed first')
  t.throws(c('', identity), err, 'throws when falsey string passed first')
  t.throws(c('string', identity), err, 'throws when truthy string passed first')
  t.throws(c(0, identity), err, 'throws when falsy number passed first')
  t.throws(c(1, identity), err, 'throws when truthy number passed first')
  t.throws(c(false, identity), err, 'throws when false passed first')
  t.throws(c(true, identity), err, 'throws when true passed first')
  t.throws(c({}, identity), err, 'throws when object passed first')
  t.throws(c([], identity), err, 'throws when array passed first')

  t.throws(c(identity, undefined), err, 'throws when undefined passed after first')
  t.throws(c(identity, null), err, 'throws when null passed passed after first')
  t.throws(c(identity, ''), err, 'throws when falsey string passed after first')
  t.throws(c(identity, 'string'), err, 'throws when truthy string passed after first')
  t.throws(c(identity, 0), err, 'throws when falsy number passed after first')
  t.throws(c(identity, 1), err, 'throws when truthy number passed after first')
  t.throws(c(identity, false), err, 'throws when false passed after first')
  t.throws(c(identity, true), err, 'throws when true passed after first')
  t.throws(c(identity, {}), err, 'throws when object passed after first')
  t.throws(c(identity, []), err, 'throws when array passed after first')

  const f = bindFunc(x => pipeK(identity, () => x)())

  t.throws(f(undefined), err, 'throws when undefined returned')
  t.throws(f(null), err, 'throws when null returned')
  t.throws(f(0), err, 'throws when falsey number returned')
  t.throws(f(1), err, 'throws when truthy number returned')
  t.throws(f(''), err, 'throws when falsey string returned')
  t.throws(f('string'), err, 'throws when truthy string returned')
  t.throws(f(false), err, 'throws when false returned')
  t.throws(f(true), err, 'throws when true returned')
  t.throws(f({}), err, 'throws when an object is returned')
  t.throws(f([]), err, 'throws when an array is returned')
  t.throws(f(identity), err, 'throws when a function is returned')

  const func = pipeK(identity, Mock)

  t.ok(func(Mock(0)), 'allows Chain returning function')

  t.end()
})

test('pipeK helper', t => {
  const f = sinon.spy((x, y) => Mock(x * y))
  const g = sinon.spy(x => Mock(x + 10))

  const fn = pipeK(f, g)

  const resDouble = fn(6, 10)

  t.ok(isFunction(fn), 'returns a function')
  t.ok(g.calledAfter(f), 'calls first function before second')
  t.ok(f.calledWith(6, 10), 'applies all arguments to head function')
  t.ok(g.calledWith(6 * 10), 'last function is chained to result of first function')
  t.equal(g.lastCall.returnValue, resDouble, 'returns the result of the last function')

  f.resetHistory()

  const single = pipeK(f)
  const resSingle = single(23, 30)

  t.ok(isFunction(single), 'returns a function for single')
  t.ok(f.calledWith(23, 30), 'applies all arguments to head function')
  t.equal(f.lastCall.returnValue, resSingle, 'returns the result of the function')

  t.end()
})
