const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const curryN = require('./curryN')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

test('curryN errors', t => {
  const c = bindFunc(curryN)

  t.ok(isFunction(curryN), 'curryN is a function')

  t.throws(curryN, TypeError, 'throws when nothing passed')

  t.throws(c(undefined, noop), TypeError, 'throws when undefined passed in first argument')
  t.throws(c(null, noop), TypeError, 'throws when null passed in first argument')
  t.throws(c('', noop), TypeError, 'throws when falsey string passed in first argument')
  t.throws(c('string', noop), TypeError, 'throws when truthy string passed in first argument')
  t.throws(c(false, noop), TypeError, 'throws when false passed in first argument')
  t.throws(c(true, noop), TypeError, 'throws when true passed in first argument')
  t.throws(c(noop, noop), TypeError, 'throws when function passed in first argument')
  t.throws(c({}, noop), TypeError, 'throws when object passed in first argument')
  t.throws(c([], noop), TypeError, 'throws when array passed in first argument')

  t.throws(c(1, undefined), TypeError, 'throws when undefined passed in second argument')
  t.throws(c(1, null), TypeError, 'throws when null passed in second argument')
  t.throws(c(1, ''), TypeError, 'throws when falsey string passed in second argument')
  t.throws(c(1, 'string'), TypeError, 'throws when truthy string passed in second argument')
  t.throws(c(1, 0), TypeError, 'throws when falsey number passed in second argument')
  t.throws(c(1, 32), TypeError, 'throws when truthy number passed in second argument')
  t.throws(c(1, false), TypeError, 'throws when false passed in second argument')
  t.throws(c(1, true), TypeError, 'throws when true passed in second argument')
  t.throws(c(1, {}), TypeError, 'throws when object passed in second argument')
  t.throws(c(1, []), TypeError, 'throws when array passed in second argument')

  t.ok(isFunction(curryN(1, noop)), 'returns a function')

  t.end()
})

test('curryN function functionality', t => {
  const result = 'result'
  const f = sinon.spy(() => result)
  const curried = curryN(3, f)

  t.equal(curried(2, 3, 1), result, 'returns the result when fully applied')
  t.equal(curried(2)(3)(1), result, 'returns the result when curried')
  t.equal(curried(1, 2)(3), result, 'returns the result when called (_, _)(_)')
  t.equal(curried(1)(2, 3), result, 'returns the result when called (_)(_, _)')

  curried(1, 2, 3, 4, 5)
  t.equal(f.lastCall.args.length, 3, 'only applies N arguments')

  t.equal(curried()()(), result, 'returns the result when curried with no args')
  t.same(f.lastCall.args, [ undefined, undefined, undefined ], 'applies undefineds when curried with no args')

  t.end()
})

test('curry0 called with arguments', t => {
  const f = sinon.spy(() => 'string')
  const curried = curryN(0, f)

  t.equal(curried(1, 2, 3), 'string', 'returns the result')
  t.equal(f.lastCall.args.length, 0, 'does not pass arguments to function')
  t.end()
})

test('curry0 called with no arguments', t => {
  const f = sinon.spy(() => 'string')
  const curried = curryN(0, f)

  t.equal(curried(), 'string', 'returns the result')
  t.end()
})
