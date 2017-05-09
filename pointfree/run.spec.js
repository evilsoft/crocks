const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const unit = require('../helpers/unit')

const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const run = require('./run')

test('run pointfree', t => {
  const f = bindFunc(run)
  const x = 'result'
  const m = { run: sinon.spy(constant(x)) }

  t.ok(isFunction(run), 'is a function')

  t.throws(f(undefined), TypeError, 'throws if passed undefined')
  t.throws(f(null), TypeError, 'throws if passed null')
  t.throws(f(0), TypeError, 'throws if passed a falsey number')
  t.throws(f(1), TypeError, 'throws if passed a truthy number')
  t.throws(f(''), TypeError, 'throws if passed a falsey string')
  t.throws(f('string'), TypeError, 'throws if passed a truthy string')
  t.throws(f(false), TypeError, 'throws if passed false')
  t.throws(f(true), TypeError, 'throws if passed true')
  t.throws(f([]), TypeError, 'throws if passed an array')
  t.throws(f({}), TypeError, 'throws if passed an object')
  t.throws(f(unit), TypeError, 'throws if passed a function')

  const result = run(m)

  t.ok(m.run.called, 'calls run on the passed container')
  t.equal(result, x, 'returns the result of calling m.run')

  t.end()
})
