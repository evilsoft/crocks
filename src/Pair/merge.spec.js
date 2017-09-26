const test = require('tape')
const helpers = require('../test/helpers')
const sinon = require('sinon')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x
const identity = x => x

const merge  = require('./merge')

test('merge pointfree', t => {
  const m = bindFunc(merge)
  const a = { merge: unit }

  t.ok(isFunction(merge), 'is a function')

  const noFunc = /merge: Binary function required for first argument/
  t.throws(m(undefined, a), noFunc, 'throws if first arg is undefined')
  t.throws(m(null, a), noFunc, 'throws if first arg is null')
  t.throws(m(0, a), noFunc, 'throws if first arg is a falsey number')
  t.throws(m(1, a), noFunc, 'throws if first arg is a truthy number')
  t.throws(m('', a), noFunc, 'throws if first arg is a falsey string')
  t.throws(m('string', a), noFunc, 'throws if first arg is a truthy string')
  t.throws(m(false, a), noFunc, 'throws if first arg is false')
  t.throws(m(true, a), noFunc, 'throws if first arg is true')
  t.throws(m([], a), noFunc, 'throws if first arg is an array')
  t.throws(m({}, a), noFunc, 'throws if first arg is an object')

  const noPair = /merge: Pair required for second argument/
  t.throws(m(unit, undefined), noPair, 'throws if second arg is undefined')
  t.throws(m(unit, null), noPair, 'throws if second arg is null')
  t.throws(m(unit, 0), noPair, 'throws if second arg is a falsey number')
  t.throws(m(unit, 1), noPair, 'throws if second arg is a truthy number')
  t.throws(m(unit, ''), noPair, 'throws if second arg is a falsey string')
  t.throws(m(unit, 'string'), noPair, 'throws if second arg is a truthy string')
  t.throws(m(unit, false), noPair, 'throws if second arg is false')
  t.throws(m(unit, true), noPair, 'throws if second arg is true')
  t.throws(m(unit, []), noPair, 'throws if second arg is an array')
  t.throws(m(unit, {}), noPair, 'throws if second arg is an object')

  t.doesNotThrow(m(unit, a), 'allows a function and adt with merge function')

  const x = 34
  const y = { merge: sinon.spy(constant(x)) }

  merge(identity, y)

  t.ok(y.merge.calledWith(identity), 'calls merge on arrow, passing the function')
  t.ok(y.merge.returned(x), 'returns the result of m.merge')

  t.end()
})
