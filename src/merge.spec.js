const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('./isFunction')
const unit = require('./unit')

const merge  = require('./merge')

test('merge pointfree', t => {
  const m = bindFunc(merge)
  const a = { merge: unit }

  t.ok(isFunction(merge), 'is a function')

  t.throws(m(undefined, a), 'throws if first arg is undefined')
  t.throws(m(null, a), 'throws if first arg is null')
  t.throws(m(0, a), 'throws if first arg is a falsey number')
  t.throws(m(1, a), 'throws if first arg is a truthy number')
  t.throws(m('', a), 'throws if first arg is a falsey string')
  t.throws(m('string', a), 'throws if first arg is a truthy string')
  t.throws(m(false, a), 'throws if first arg is false')
  t.throws(m(true, a), 'throws if first arg is true')
  t.throws(m([], a), 'throws if first arg is an array')
  t.throws(m({}, a), 'throws if first arg is an object')

  t.throws(m(unit, undefined), 'throws if second arg is undefined')
  t.throws(m(unit, null), 'throws if second arg is null')
  t.throws(m(unit, 0), 'throws if second arg is a falsey number')
  t.throws(m(unit, 1), 'throws if second arg is a truthy number')
  t.throws(m(unit, ''), 'throws if second arg is a falsey string')
  t.throws(m(unit, 'string'), 'throws if second arg is a truthy string')
  t.throws(m(unit, false), 'throws if second arg is false')
  t.throws(m(unit, true), 'throws if second arg is true')
  t.throws(m(unit, []), 'throws if second arg is an array')
  t.throws(m(unit, {}), 'throws if second arg is an object')

  t.doesNotThrow(m(unit, a), 'allows a function and adt with merge function')

  t.end()
})
