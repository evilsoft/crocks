const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isFunction = require('../internal/isFunction')

const pipe = require('./pipe')

test('pipe parameters', t => {
  const c = bindFunc(pipe)

  t.ok(isFunction(pipe), 'pipe is a function')

  t.throws(pipe, TypeError, 'throws Error when nothing passed')

  t.throws(c(undefined), TypeError, 'throws TypeError when undefined passed')
  t.throws(c(null), TypeError, 'throws TypeError when null passed')

  t.throws(c(''), TypeError, 'throws TypeError when falsey string passed')
  t.throws(c('string'), TypeError, 'throws TypeError when truthy string passed')
  t.throws(c(0), TypeError, 'throws TypeError when falsy number passed')
  t.throws(c(1), TypeError, 'throws TypeError when truthy number passed')
  t.throws(c(false), TypeError, 'throws TypeError when false passed')
  t.throws(c(true), TypeError, 'throws TypeError when true passed')

  t.throws(c({}), TypeError, 'throws TypeError when object passed')
  t.throws(c([]), TypeError, 'throws TypeError when array passed')

  t.ok(isFunction(pipe(noop)), 'returns a function')

  t.end()
})

test('pipe function', t => {
  const retString = () => 'string'
  const retBling = () => 'bling'

  const first = sinon.spy(retString)
  const second = sinon.spy(retBling)

  const args = [ 'first', 'second' ]
  const result = pipe(first, second).apply(null, args)

  t.ok(first.calledBefore(second), 'left-most function is called first')
  t.ok(first.calledWith.apply(first, args), 'right-most function applied with all arguments')
  t.ok(second.calledWith('string'), 'second function receives result of the first function')

  t.equal(result, 'bling', 'returns the result of the left-most function')
  t.end()
})
