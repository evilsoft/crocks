const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const compose = require('./compose')

const noop      = helpers.noop
const bindFunc  = helpers.bindFunc

test('compose parameters', t => {
  const c = bindFunc(compose)

  t.equal(typeof compose, 'function', 'compose is a function')

  t.throws(compose, TypeError, 'throws Error when nothing passed')

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

  t.equal(typeof compose(noop), 'function', 'returns a function')

  t.end()
})

test('composed function', t => {
  const retString = () => 'string'
  const retBling  = () => 'bling'

  const first   = sinon.spy(retString)
  const second  = sinon.spy(retBling)

  const args    = [ 'first', 'second' ]
  const result  = compose(second, first).apply(null, args)

  t.ok(first.calledBefore(second), 'right-most function is called first')
  t.ok(first.calledWith.apply(first, args), 'right-most function applied with all arguments')
  t.ok(second.calledWith('string'), 'second function receives result of the first function')

  t.equal(result, 'bling', 'returns the result of the left-most function')
  t.end()
})
