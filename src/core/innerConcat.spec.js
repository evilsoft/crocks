const test = require('tape')
const helpers = require('../test/helpers')
const Mock = require('../test/MockCrock')
const Last = require('../test/LastMonoid')

const bindFunc = helpers.bindFunc

const isFunction = require('./isFunction')
const isSameType = require('./isSameType')

const innerConcat = require('./innerConcat')

test('innerConcat errors', t => {
  const err = /MockCrock.concat:/

  const outer = bindFunc(x => innerConcat(Mock, Mock.of(Last(4)))(x))

  t.throws(outer(undefined), err, 'throws interpolated error when left container contains undefined')
  t.throws(outer(null), err, 'throws interpolated error when left container contains null')
  t.throws(outer(0), err, 'throws interpolated error when left container contains falsey number')
  t.throws(outer(1), err, 'throws interpolated error when left container contains truthy number')
  t.throws(outer(''), err, 'throws interpolated error when left container contains falsey string')
  t.throws(outer('string'), err, 'throws interpolated error when left container contains truthy string')
  t.throws(outer(false), err, 'throws interpolated error when left container contains false')
  t.throws(outer(true), err, 'throws interpolated error when left container contains true')
  t.throws(outer({}), err, 'throws interpolated error when left container contains an object')

  t.end()
})

test('innerConcat functionality', t => {
  t.ok(isFunction(innerConcat), 'is a function')

  const val = 4
  const right = Last(val)
  const left = Last(99)

  const fn = innerConcat(Mock, Mock.of(right))
  const res = fn(left)

  t.ok(isSameType(Mock, res), 'returns a container of the same type')
  t.ok(isSameType(Last, res.valueOf()), 'new value is a Monoid of the expected type')
  t.equals(res.valueOf().valueOf(), val, 'new value is a Monoid of the expected type')

  t.end()
})
