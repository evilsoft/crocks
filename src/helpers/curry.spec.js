const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const curry = require('./curry')

test('curry', t => {
  const c = bindFunc(curry)

  t.ok(isFunction(curry), 'curry is a function')

  const err = /curry: Argument must be a Function/
  t.throws(curry, err, 'throws err when nothing passed')

  t.throws(c(undefined), err, 'throws err when undefined passed')
  t.throws(c(null), err, 'throws err when null passed')
  t.throws(c(''), err, 'throws err when falsey string passed')
  t.throws(c('string'), err, 'throws err when truthy string passed')
  t.throws(c(0), err, 'throws err when falsy number passed')
  t.throws(c(1), err, 'throws err when truthy number passed')
  t.throws(c(false), err, 'throws err when false passed')
  t.throws(c(true), err, 'throws err when true passed')
  t.throws(c({}), err, 'throws err when object passed')
  t.throws(c([]), err, 'throws err when array passed')

  t.ok(isFunction(curry(unit)), 'returns a function')

  t.end()
})
