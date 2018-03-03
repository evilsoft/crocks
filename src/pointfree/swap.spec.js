const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x
const identity = x => x

const swap = require('./swap')

test('swap pointfree', t => {
  const m = bindFunc(swap)
  const f = { swap: unit }

  t.ok(isFunction(swap), 'is a function')

  const err = /swap: Function required for first two arguments/
  t.throws(m(undefined, unit, f), err, 'throws if first arg is undefined')
  t.throws(m(null, unit, f), err, 'throws if first arg is null')
  t.throws(m(0, unit, f), err, 'throws if first arg is a falsey number')
  t.throws(m(1, unit, f), err, 'throws if first arg is a truthy number')
  t.throws(m('', unit, f), err, 'throws if first arg is a falsey string')
  t.throws(m('string', unit, f), err, 'throws if first arg is a truthy string')
  t.throws(m(false, unit, f), err, 'throws if first arg is false')
  t.throws(m(true, unit, f), err, 'throws if first arg is true')
  t.throws(m([], unit, f), err, 'throws if first arg is an array')
  t.throws(m({}, unit, f), err, 'throws if first arg is an object')

  t.throws(m(unit, undefined, f), err, 'throws if second arg is undefined')
  t.throws(m(unit, null, f), err, 'throws if second arg is null')
  t.throws(m(unit, 0, f), err, 'throws if second arg is a falsey number')
  t.throws(m(unit, 1, f), err, 'throws if second arg is a truthy number')
  t.throws(m(unit, '', f), err, 'throws if second arg is a falsey string')
  t.throws(m(unit, 'string', f), err, 'throws if second arg is a truthy string')
  t.throws(m(unit, false, f), err, 'throws if second arg is false')
  t.throws(m(unit, true, f), err, 'throws if second arg is true')
  t.throws(m(unit, [], f), err, 'throws if second arg is an array')
  t.throws(m(unit, {}, f), err, 'throws if second arg is an object')

  const last = /swap: Async, Either, Pair or Result required for third arguments/
  t.throws(m(unit, unit, undefined), last, 'throws if third arg is undefined')
  t.throws(m(unit, unit, null), last, 'throws if third arg is null')
  t.throws(m(unit, unit, 0), last, 'throws if third arg is a falsey number')
  t.throws(m(unit, unit, 1), last, 'throws if third arg is a truthy number')
  t.throws(m(unit, unit, ''), last, 'throws if third arg is a falsey string')
  t.throws(m(unit, unit, 'string'), last, 'throws if third arg is a truthy string')
  t.throws(m(unit, unit, false), last, 'throws if third arg is false')
  t.throws(m(unit, unit, true), last, 'throws if third arg is true')
  t.throws(m(unit, unit, {}), last, 'throws if third arg is an object')

  t.end()
})

test('swap sum type', t => {
  const x = 'result'
  const m = { swap: sinon.spy(constant(x)) }

  const result = swap(identity, identity, m)

  t.ok(m.swap.calledWith(identity, identity), 'calls swap on sum types, passing the functions')
  t.equal(result, x, 'returns the result of the call to swap')

  t.end()
})
