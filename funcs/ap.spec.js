const test  = require('tape')
const sinon = require('sinon')

const helpers   = require('../test/helpers')
const bindFunc  = helpers.bindFunc
const noop      = helpers.noop

const ap  = require('./ap')

test('ap', t => {
  const a = bindFunc(ap)
  const first   = { type: () => 'first', ap: sinon.spy() }
  const second  = { type: () => 'second', ap: sinon.spy() }

  t.equal(typeof ap, 'function', 'ap is a function')
  t.throws(a(0, first), 'throws if first arg is a falsey number')
  t.throws(a(1, first), 'throws if first arg is a truthy number')
  t.throws(a('', first), 'throws if first arg is a falsey number')
  t.throws(a('string', first), 'throws if first arg is a truthy number')
  t.throws(a(false, first), 'throws if first arg is false')
  t.throws(a(true, first), 'throws if first arg is true')
  t.throws(a([], first), 'throws if first arg is an array')
  t.throws(a({}, first), 'throws if first arg is an object without an ap method')

  t.throws(a(first, second), 'throws if containers do not match')
  t.throws(a(first, second), 'throws if containers do not match')

  t.end()
})
