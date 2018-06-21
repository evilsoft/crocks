const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const fl = require('../core/flNames')
const unit = require('../core/_unit')

const constant = x => () => x

const mock = (x, value) => Object.assign({}, {
  constructor: { empty: sinon.spy(constant(value)) }
}, x)

const empty = require('./empty')

test('empty pointfree', t => {
  const fn = bindFunc(empty)

  t.ok(isFunction(empty), 'empty is a function')

  const err = /empty: Monoid, Array, String or Object required/
  t.throws(fn(undefined), err, 'throws with undefined')
  t.throws(fn(null), err, 'throws with null')
  t.throws(fn(0), err, 'throws with a falsey number')
  t.throws(fn(1), err, 'throws with a truthy number')
  t.throws(fn(false), err, 'throws with a false')
  t.throws(fn(true), err, 'throws with a true')
  t.throws(fn(unit), err, 'throws with a function')

  t.end()
})

test('empty with String', t => {
  t.equal(empty(''), '', 'returns an empty string for a string value')
  t.equal(empty(String), '', 'returns an empty string for a string constructor')

  t.end()
})

test('empty with Array', t => {
  t.same(empty([]), [], 'returns an empty array for an array value')
  t.same(empty(Array), [], 'returns an empty array for an array constructor')

  t.end()
})

test('empty with Object', t => {
  t.same(empty({}), {}, 'returns an empty object for an object value')
  t.same(empty(Object), {}, 'returns an empty object for an object constructor')

  t.end()
})

test('empty with Monoid same level', t => {
  const x = 'result'

  const m = mock({
    empty: sinon.spy(constant(x))
  }, x)

  const result = empty(m)

  t.ok(m.empty.called, 'calls empty on object')
  t.ok(m.empty.calledOn(m), 'binds empty to provided object')
  t.equal(result, x, 'returns the result of empty call')

  t.end()
})

test('empty with Monoid on constructor of instance', t => {
  const x = 'result'
  const m = mock({}, x)

  const result = empty(m)

  t.ok(m.constructor.empty.called, 'calls empty on object constructor')
  t.ok(m.constructor.empty.calledOn(m), 'binds constructor empty to provided instance')
  t.equal(result, x, 'returns the result of empty call')

  t.end()
})

test('empty with Monoid same level (fantasy-land)', t => {
  const x = 'result'

  const m = mock({
    empty: sinon.spy(),
    [fl.empty]: sinon.spy(constant(x))
  }, x)

  const result = empty(m)

  t.ok(m[fl.empty].called, 'calls fantasy-land/empty on object')
  t.ok(m[fl.empty].calledOn(m), 'binds fantasy-land/empty to provided object')
  t.equal(result, x, 'returns the result of empty call')
  t.notOk(m.empty.called, 'does not call empty')

  t.end()
})

test('empty with Monoid on constructor of instance (fantasy-land)', t => {
  const x = 'result'
  const m = {
    constructor: {
      empty: sinon.spy(),
      [fl.empty]: sinon.spy(constant(x))
    }
  }

  const result = empty(m)

  t.ok(m.constructor[fl.empty].called, 'calls fantasy-land/empty on object constructor')
  t.ok(m.constructor[fl.empty].calledOn(m), 'binds constructor fantasy-land/empty to provided instance')
  t.equal(result, x, 'returns the result of empty call')
  t.notOk(m.constructor.empty.called, 'does not call constructor empty')

  t.end()
})
