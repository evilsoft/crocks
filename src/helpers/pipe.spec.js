const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const pipe = require('./pipe')

test('pipe errors', t => {
  const c = bindFunc(pipe)
  const err = /pipe: Functions required/

  t.throws(pipe, err, 'throws when nothing passed')

  t.throws(c(undefined), err, 'throws when undefined passed')
  t.throws(c(null), err, 'throws when null passed')
  t.throws(c(''), err, 'throws when falsey string passed')
  t.throws(c('string'), err, 'throws err when truthy string passed')
  t.throws(c(0), err, 'throws err when falsy number passed')
  t.throws(c(1), err, 'throws err when truthy number passed')
  t.throws(c(false), err, 'throws err when false passed')
  t.throws(c(true), err, 'throws err when true passed')
  t.throws(c({}), err, 'throws err when object passed')
  t.throws(c([]), err, 'throws err when array passed')

  t.throws(c(unit, undefined), err, 'throws when undefined passed as second argument')
  t.throws(c(unit, null), err, 'throws when null passed as second argument')
  t.throws(c(unit, ''), err, 'throws when falsey string passed as second argument')
  t.throws(c(unit, 'string'), err, 'throws err when truthy string passed as second argument')
  t.throws(c(unit, 0), err, 'throws err when falsy number passed as second argument')
  t.throws(c(unit, 1), err, 'throws err when truthy number passed as second argument')
  t.throws(c(unit, false), err, 'throws err when false passed as second argument')
  t.throws(c(unit, true), err, 'throws err when true passed as second argument')
  t.throws(c(unit, {}), err, 'throws err when object passed as second argument')
  t.throws(c(unit, []), err, 'throws err when array passed as second argument')

  t.end()
})

test('pipe helper', t => {
  const retString = () => 'string'
  const retBling = () => 'bling'

  const first = sinon.spy(retString)
  const second = sinon.spy(retBling)

  const args = [ 'first', 'second' ]
  const result = pipe(first, second).apply(null, args)

  t.ok(isFunction(pipe(unit)), 'returns a function')

  t.ok(first.calledBefore(second), 'left-most function is called first')
  t.ok(first.calledWith.apply(first, args.slice(0, 1)), 'right-most function applied with only first argument')
  t.ok(second.calledWith('string'), 'second function receives result of the first function')

  t.equal(result, 'bling', 'returns the result of the left-most function')
  t.end()
})
