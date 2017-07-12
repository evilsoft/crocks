const test = require('tape')
const sinon = require('sinon')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const constant = require('../core/constant')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const reduce = require('./reduce')

test('reduce pointfree', t => {
  const r = bindFunc(reduce)
  const x = 'result'
  const m = { reduce: sinon.spy(constant(x)) }

  t.ok(isFunction(reduce), 'is a function')

  t.throws(r(undefined, 0, m), 'throws if first arg is undefined')
  t.throws(r(null, 0, m), 'throws if first arg is null')
  t.throws(r(0, 0, m), 'throws if first arg is a falsey number')
  t.throws(r(1, 0, m), 'throws if first arg is a truthy number')
  t.throws(r('', 0, m), 'throws if first arg is a falsey string')
  t.throws(r('string', 0, m), 'throws if first arg is a truthy string')
  t.throws(r(false, 0, m), 'throws if first arg is false')
  t.throws(r(true, 0, m), 'throws if first arg is true')
  t.throws(r([], 0, m), 'throws if first arg is an array')
  t.throws(r({}, 0, m), 'throws if first arg is an object')

  t.throws(r(unit, 0, undefined), 'throws if second arg is undefined')
  t.throws(r(unit, 0, null), 'throws if second arg is null')
  t.throws(r(unit, 0, 0), 'throws if second arg is a falsey number')
  t.throws(r(unit, 0, 1), 'throws if second arg is a truthy number')
  t.throws(r(unit, 0, ''), 'throws if second arg is a falsey string')
  t.throws(r(unit, 0, 'string'), 'throws if second arg is a truthy string')
  t.throws(r(unit, 0, false), 'throws if second arg is false')
  t.throws(r(unit, 0, true), 'throws if second arg is true')
  t.throws(r(unit, 0, {}), 'throws if second arg is an object')

  t.doesNotThrow(r(unit, 0, m), 'allows a function and Foldable')
  t.doesNotThrow(r(unit, 0, []), 'allows a function and an array (Foldable)')

  const f = sinon.spy()
  const res = reduce(f, 0, m)

  t.ok(m.reduce.calledWith(f), 'calls reduce on container, passing the function')
  t.equal(res, x, 'returns the result of reduce')

  t.end()
})
