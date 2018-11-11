const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const { bindFunc, testIterable } = helpers

const M = require('../core/Maybe')
const isFunction  = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const head = require('./head')

test('head pointfree', t => {
  const f = bindFunc(head)

  t.ok(isFunction(head), 'is a function')

  const err = /head: List or iterable required/
  t.throws(f(undefined), err, 'throws when arg is undefined')
  t.throws(f(null), err, 'throws when arg is null')
  t.throws(f(0), err, 'throws when arg is falsey number')
  t.throws(f(1), err, 'throws when arg is truthy number')
  t.throws(f(false), err, 'throws when arg is false')
  t.throws(f(true), err, 'throws when arg is true')
  t.throws(f({}), err, 'throws when arg is an object without head')
  t.throws(f(unit), err, 'throws whetypes a function')

  t.end()
})

test('head pointfree arrays', t => {
  const empty = []
  const one = [ 1 ]
  const two = [ 2, 3 ]

  t.equals(head(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(head(one).type(), M.type(), 'returns a Maybe on one element array')
  t.equals(head(two).type(), M.type(), 'returns a Maybe on two element array')

  t.equals(head(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(head(one).option('Nothing'), 1, 'returns `1` on one element array')
  t.equals(head(two).option('Nothing'), 2, 'returns `2` on two element array')

  t.end()
})

test('head pointfree strings', t => {
  const empty = ''
  const one = 'a'
  const two = 'bc'

  t.equals(head(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(head(one).type(), M.type(), 'returns a Maybe on one element array')
  t.equals(head(two).type(), M.type(), 'returns a Maybe on two element array')

  t.equals(head(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(head(one).option('Nothing'), 'a', 'returns `a` on one char string')
  t.equals(head(two).option('Nothing'), 'b', 'returns `b` on two char string')

  t.end()
})

test('head pointfree List', t => {
  const m = { head: sinon.spy(constant('result')) }

  const result = head(m)

  t.ok(m.head.called, 'calls head on list passing first arg')
  t.equal(m.head.returnValues[0], result, 'returns the result of the List head')

  t.end()
})

test('head pointfree iterable', t => {
  const empty = testIterable(0, 0, 1)
  const one = testIterable(1, 1, 1)
  const two = testIterable(2, 2, 2)

  t.equals(head(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(head(one).type(), M.type(), 'returns a Maybe on one element array')
  t.equals(head(two).type(), M.type(), 'returns a Maybe on two element array')

  t.equals(head(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(head(one).option('Nothing'), 1, 'returns `1` on single element iterable')
  t.equals(head(two).option('Nothing'), 2, 'returns `2` on dual element iterable')

  t.end()
})
