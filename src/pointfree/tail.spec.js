const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const M = require('../core/Maybe')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const tail = require('./tail')

test('tail pointfree', t => {
  const f = bindFunc(tail)

  t.ok(isFunction(tail), 'is a function')

  t.throws(f(undefined), TypeError, 'throws when arg is undefined')
  t.throws(f(null), TypeError, 'throws when arg is null')
  t.throws(f(0), TypeError, 'throws when arg is falsey number')
  t.throws(f(1), TypeError, 'throws when arg is truthy number')
  t.throws(f(false), TypeError, 'throws when arg is false')
  t.throws(f(true), TypeError, 'throws when arg is true')
  t.throws(f({}), TypeError, 'throws when arg is an object without head')
  t.throws(f(unit), TypeError, 'throws when arg is function')

  t.end()
})

test('tail pointfree arrays', t => {
  const empty = []
  const one = [ 1 ]
  const two = [ 2, 3 ]
  const three = [ 4, 5, 6 ]

  t.equals(tail(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(tail(one).type(), M.type(), 'returns a Maybe on one element array')
  t.equals(tail(two).type(), M.type(), 'returns a Maybe on two element array')
  t.equals(tail(three).type(), M.type(), 'returns a Maybe on two element array')

  t.equals(tail(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(tail(one).option('Nothing'), 'Nothing', 'returns a Nothing on one element array')
  t.same(tail(two).option('Nothing'), [ 3 ], 'returns `[ 3 ]` on two element array')
  t.same(tail(three).option('Nothing'), [ 5, 6 ], 'returns `[ 5, 6 ]` on two element array')

  t.end()
})

test('tail pointfree strings', t => {
  const empty = ''
  const one = 'a'
  const two = 'bc'
  const three = 'def'

  t.equals(tail(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(tail(one).type(), M.type(), 'returns a Maybe on one element array')
  t.equals(tail(two).type(), M.type(), 'returns a Maybe on two element array')
  t.equals(tail(three).type(), M.type(), 'returns a Maybe on two element array')

  t.equals(tail(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(tail(one).option('Nothing'), 'Nothing', 'returns a Nothing on one char string')
  t.equals(tail(two).option('Nothing'), 'c', 'returns `c` on two char string')
  t.equals(tail(three).option('Nothing'), 'ef', 'returns `ef` on two char string')

  t.end()
})

test('tail pointfree List', t => {
  const m = { tail: sinon.spy(constant('result')) }

  const result = tail(m)

  t.ok(m.tail.called, 'calls tail on list passing first arg')
  t.equal(m.tail.returnValues[0], result, 'returns the result of the List tail')

  t.end()
})
