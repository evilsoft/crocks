const test = require('tape')
const sinon = require('sinon')

const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const constant = require('../combinators/constant')
const unit = require('../helpers/unit')

const empty = require('./empty')

test('empty pointfree', t => {
  const fn = bindFunc(empty)
  const mock = { empty: sinon.spy(constant('result')) }

  const err = /empty: Monoid, Array, String or Object required/
  t.throws(fn(undefined), err, 'throws with undefined')
  t.throws(fn(null), err, 'throws with null')
  t.throws(fn(0), err, 'throws with a falsey number')
  t.throws(fn(1), err, 'throws with a truthy number')
  t.throws(fn(false), err, 'throws with a false')
  t.throws(fn(true), err, 'throws with a true')
  t.throws(fn(unit), err, 'throws with a function')

  t.equal(empty(''), '', 'returns an empty string for a string value')
  t.equal(empty(String), '', 'returns an empty string for a string constructor')
  t.same(empty([]), [], 'returns an empty array for an array value')
  t.same(empty(Array), [], 'returns an empty array for an array constructor')
  t.same(empty({}), {}, 'returns an empty object for an object value')
  t.same(empty(Object), {}, 'returns an empty object for an object constructor')

  const result = empty(mock)

  t.ok(mock.empty.called, 'calls empty on object with it defined')
  t.equal(result, 'result', 'resturns the result of empty call')

  t.end()
})
