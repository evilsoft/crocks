const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction  = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const execWith = require('./execWith')

test('execWith pointfree', t => {
  const f = bindFunc(execWith)
  const x = 'result'
  const m = { execWith: sinon.spy(constant(x)) }

  t.ok(isFunction(execWith), 'is a function')

  const err = /execWith: State required for second argument/
  t.throws(f(13, undefined), err, 'throws if passed undefined')
  t.throws(f(13, null), err, 'throws if passed null')
  t.throws(f(13, 0), err, 'throws if passed a falsey number')
  t.throws(f(13, 1), err, 'throws if passed a truthy number')
  t.throws(f(13, ''), err, 'throws if passed a falsey string')
  t.throws(f(13, 'string'), err, 'throws if passed a truthy string')
  t.throws(f(13, false), err, 'throws if passed false')
  t.throws(f(13, true), err, 'throws if passed true')
  t.throws(f(13, []), err, 'throws if passed an array')
  t.throws(f(13, {}), err, 'throws if passed an object')
  t.throws(f(13, unit), err, 'throws if passed a function')

  const result = execWith(23)(m)

  t.ok(m.execWith.called, 'calls execWith on the passed container')
  t.equal(result, x, 'returns the result of calling m.execWith')

  t.end()
})
