const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const reduce = require('./reduce')

test('reduce pointfree', t => {
  const r = bindFunc(reduce)
  const x = 'result'
  const m = { reduce: sinon.spy(constant(x)) }

  t.ok(isFunction(reduce), 'is a function')

  const err = /reduce: Function required for first argument/
  t.throws(r(undefined, 0, m), err, 'throws if first arg is undefined')
  t.throws(r(null, 0, m), err, 'throws if first arg is null')
  t.throws(r(0, 0, m), err, 'throws if first arg is a falsey number')
  t.throws(r(1, 0, m), err, 'throws if first arg is a truthy number')
  t.throws(r('', 0, m), err, 'throws if first arg is a falsey string')
  t.throws(r('string', 0, m), err, 'throws if first arg is a truthy string')
  t.throws(r(false, 0, m), err, 'throws if first arg is false')
  t.throws(r(true, 0, m), err, 'throws if first arg is true')
  t.throws(r([], 0, m), err, 'throws if first arg is an array')
  t.throws(r({}, 0, m), err, 'throws if first arg is an object')

  const second = /reduce: Foldable required for third argument/
  t.throws(r(unit, 0, undefined), second, 'throws if second arg is undefined')
  t.throws(r(unit, 0, null), second, 'throws if second arg is null')
  t.throws(r(unit, 0, 0), second, 'throws if second arg is a falsey number')
  t.throws(r(unit, 0, 1), second, 'throws if second arg is a truthy number')
  t.throws(r(unit, 0, ''), second, 'throws if second arg is a falsey string')
  t.throws(r(unit, 0, 'string'), second, 'throws if second arg is a truthy string')
  t.throws(r(unit, 0, false), second, 'throws if second arg is false')
  t.throws(r(unit, 0, true), second, 'throws if second arg is true')
  t.throws(r(unit, 0, {}), second, 'throws if second arg is an object')

  t.doesNotThrow(r(unit, 0, m), 'allows a function and Foldable')
  t.doesNotThrow(r(unit, 0, []), 'allows a function and an array (Foldable)')

  const f = sinon.spy()
  const res = reduce(f, 0, m)

  t.ok(m.reduce.calledWith(f), 'calls reduce on container, passing the function')
  t.equal(res, x, 'returns the result of reduce')

  t.end()
})
