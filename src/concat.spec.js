const test = require('tape')
const helpers = require('../test/helpers')
const Last = require('../test/LastMonoid')

const bindFunc = helpers.bindFunc

const isFunction  = require('./core/isFunction')
const unit = require('./core/unit')

const concat = require('./concat')

test('concat pointfree', t => {
  const f = bindFunc(concat)

  t.ok(isFunction(concat), 'is a function')

  const err = /concat: Semigroups of the same type required both arguments/
  t.throws(f('', undefined), TypeError, 'throws if second arg is undefined')
  t.throws(f('', null), TypeError, 'throws if second arg is null')
  t.throws(f('', 0), TypeError, 'throws if second arg is falsey number')
  t.throws(f('', 1), TypeError, 'throws if second arg is truthy number')
  t.throws(f('', false), TypeError, 'throws if second arg is false')
  t.throws(f('', true), TypeError, 'throws if second arg is true')
  t.throws(f('', {}), TypeError, 'throws if second arg is true')
  t.throws(f('', unit), TypeError, 'throws if second arg is function')

  t.throws(f([], ''), err, 'throws when semigroups differ')

  t.end()
})

test('concat pointfree strings', t => {
  const a = 'one'
  const b = 'two'
  const ab = a + b

  t.equal(concat(b, a), ab, 'concats the first string to the second')

  t.end()
})

test('concat pointfree arrays', t => {
  t.same(concat( [ 2 ], [ 1 ]), [ 1, 2 ], 'concats number on array')
  t.same(concat( [ '2' ], [ 1 ]), [ 1, '2' ], 'concats string on array')
  t.same(concat( [ false ], [ 1 ]), [ 1, false ], 'concats bool on array')
  t.same(concat( [ {} ], [ 1 ]), [ 1, {} ], 'concats object on array')
  t.same(concat([ 2, 3 ], [ 1 ]), [ 1, 2, 3 ], 'concats two arrays first onto second')

  t.end()
})

test('concat pointfree semigroup', t => {
  const m = Last('1')

  const result = concat(Last('3'), m)

  t.equal(result.value(), '3', 'concats semigroup as expected')

  t.end()
})
