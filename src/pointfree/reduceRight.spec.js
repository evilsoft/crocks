const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const reduceRight = require('./reduceRight')

test('reduce pointfree', t => {
  const r = bindFunc(reduceRight)
  const x = 'result'
  const m = { reduceRight: sinon.spy(constant(x)) }

  t.ok(isFunction(reduceRight), 'is a function')

  const noFunc = /reduceRight: Function required for first argument/
  t.throws(r(undefined, 0, m), noFunc, 'throws if first arg is undefined')
  t.throws(r(null, 0, m), noFunc, 'throws if first arg is null')
  t.throws(r(0, 0, m), noFunc, 'throws if first arg is a falsey number')
  t.throws(r(1, 0, m), noFunc, 'throws if first arg is a truthy number')
  t.throws(r('', 0, m), noFunc, 'throws if first arg is a falsey string')
  t.throws(r('string', 0, m), noFunc, 'throws if first arg is a truthy string')
  t.throws(r(false, 0, m), noFunc, 'throws if first arg is false')
  t.throws(r(true, 0, m), noFunc, 'throws if first arg is true')
  t.throws(r([], 0, m), noFunc, 'throws if first arg is an array')
  t.throws(r({}, 0, m), noFunc, 'throws if first arg is an object')

  const err = /reduceRight: Right Foldable required for third argument/
  t.throws(r(unit, 0, undefined), err, 'throws if second arg is undefined')
  t.throws(r(unit, 0, null), err, 'throws if second arg is null')
  t.throws(r(unit, 0, 0), err, 'throws if second arg is a falsey number')
  t.throws(r(unit, 0, 1), err, 'throws if second arg is a truthy number')
  t.throws(r(unit, 0, ''), err, 'throws if second arg is a falsey string')
  t.throws(r(unit, 0, 'string'), err, 'throws if second arg is a truthy string')
  t.throws(r(unit, 0, false), err, 'throws if second arg is false')
  t.throws(r(unit, 0, true), err, 'throws if second arg is true')
  t.throws(r(unit, 0, {}), err, 'throws if second arg is an object')

  t.doesNotThrow(r(unit, 0, m), 'allows a function and Foldable')
  t.doesNotThrow(r(unit, 0, []), 'allows a function and an array (Foldable)')

  const f = sinon.spy()
  const res = reduceRight(f, 0, m)

  t.ok(m.reduceRight.calledWith(f), 'calls reduceRight on container, passing the function')
  t.equal(res, x, 'returns the result of reduce')

  t.end()
})
