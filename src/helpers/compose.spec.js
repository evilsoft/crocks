const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction  = require('../core/isFunction')
const unit = require('../core/_unit')

const compose = require('./compose')

test('compose parameters', t => {
  const c = bindFunc(compose)

  t.ok(isFunction(compose), 'compose is a function')

  const err = /compose: Functions required/
  t.throws(compose, err, 'throws Error when nothing passed')

  t.throws(c(undefined), err, 'throws when undefined passed')
  t.throws(c(null), err, 'throws when null passed')
  t.throws(c(''), err, 'throws when falsey string passed')
  t.throws(c('string'), err, 'throws when truthy string passed')
  t.throws(c(0), err, 'throws when falsy number passed')
  t.throws(c(1), err, 'throws when truthy number passed')
  t.throws(c(false), err, 'throws when false passed')
  t.throws(c(true), err, 'throws when true passed')
  t.throws(c({}), err, 'throws when object passed')
  t.throws(c([]), err, 'throws when array passed')

  t.throws(c(undefined, unit), err, 'throws when undefined passed as second argument')
  t.throws(c(null, unit), err, 'throws when null passed as second argument')
  t.throws(c('', unit), err, 'throws when falsey string passed as second argument')
  t.throws(c('string', unit), err, 'throws when truthy string passed as second argument')
  t.throws(c(0, unit), err, 'throws when falsy number passed as second argument')
  t.throws(c(1, unit), err, 'throws when truthy number passed as second argument')
  t.throws(c(false, unit), err, 'throws when false passed as second argument')
  t.throws(c(true, unit), err, 'throws when true passed as second argument')
  t.throws(c({}, unit), err, 'throws when object passed as second argument')
  t.throws(c([], unit), err, 'throws when array passed as second argument')

  t.ok(isFunction(compose(unit)), 'returns a function')

  t.end()
})

test('composed function', t => {
  const retString = () => 'string'
  const retBling = () => 'bling'

  const first = sinon.spy(retString)
  const second = sinon.spy(retBling)

  const args = [ 'first', 'second' ]
  const result = compose(second, first).apply(null, args)

  t.ok(first.calledBefore(second), 'right-most function is called first')
  t.ok(first.calledWith.apply(first, args.slice(0, 1)), 'right-most function applied with only first argument')
  t.ok(second.calledWith('string'), 'second function receives result of the first function')

  t.equal(result, 'bling', 'returns the result of the left-most function')
  t.end()
})
