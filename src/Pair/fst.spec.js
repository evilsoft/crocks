const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const fst = require('./fst')

test('fst pointfree', t => {
  const f = bindFunc(fst)
  const x = 'result'
  const m = { fst: sinon.spy(constant(x)) }

  t.ok(isFunction(fst), 'is a function')

  const err = /fst: Argument must be a Pair/
  t.throws(f(undefined), err, 'throws if passed undefined')
  t.throws(f(null), err, 'throws if passed null')
  t.throws(f(0), err, 'throws if passed a falsey number')
  t.throws(f(1), err, 'throws if passed a truthy number')
  t.throws(f(''), err, 'throws if passed a falsey string')
  t.throws(f('string'), err, 'throws if passed a truthy string')
  t.throws(f(false), err, 'throws if passed false')
  t.throws(f(true), err, 'throws if passed true')
  t.throws(f([]), err, 'throws if passed an array')
  t.throws(f({}), err, 'throws if passed an object')
  t.throws(f(unit), err, 'throws if passed a function')

  const result = fst(m)

  t.ok(m.fst.called, 'calls fst on the passed container')
  t.equal(result, x, 'returns the result of calling m.fst')

  t.end()
})
