const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const { bindFunc, testIterable } = helpers

const M = require('../core/Maybe')
const isFunction  = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const last = require('./last')

test('last pointfree', t => {
  const f = bindFunc(last)

  t.ok(isFunction(last), 'is a function')

  const err = /last: Argument must be a List, String, or Iterable/
  t.throws(f(undefined), err, 'throws when arg is undefined')
  t.throws(f(null), err, 'throws when arg is null')
  t.throws(f(0), err, 'throws when arg is falsey number')
  t.throws(f(1), err, 'throws when arg is truthy number')
  t.throws(f(false), err, 'throws when arg is false')
  t.throws(f(true), err, 'throws when arg is true')
  t.throws(f({}), err, 'throws when arg is an object without last')
  t.throws(f(unit), err, 'throws whetypes a function')

  t.end()
})

test('last pointfree arrays', t => {
  const empty = []
  const one = [ 1 ]
  const two = [ 1, 2 ]

  t.equals(last(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(last(one).type(), M.type(), 'returns a Maybe on one element array')
  t.equals(last(two).type(), M.type(), 'returns a Maybe on two element array')

  t.equals(last(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(last(one).option('Nothing'), 1, 'returns `1` on one element array')
  t.equals(last(two).option('Nothing'), 2, 'returns `2` on two element array')

  t.end()
})

test('last pointfree strings', t => {
  const empty = ''
  const one = 'a'
  const two = 'ab'

  t.equals(last(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(last(one).type(), M.type(), 'returns a Maybe on one element array')
  t.equals(last(two).type(), M.type(), 'returns a Maybe on two element array')

  t.equals(last(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(last(one).option('Nothing'), 'a', 'returns `a` on one char string')
  t.equals(last(two).option('Nothing'), 'b', 'returns `b` on two char string')

  t.end()
})

test('last pointfree List', t => {
  const m = { last: sinon.spy(constant('result')) }

  const result = last(m)

  t.ok(m.last.called, 'calls last on list passing first arg')
  t.equal(m.last.returnValues[0], result, 'returns the result of the List last')

  t.end()
})

test('last pointfree iterable', t => {
  const empty = testIterable(1, 1, 2)
  const one = testIterable(1, 2, 1)
  const two = testIterable(1, 3, 1)

  t.equals(last(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(last(one).type(), M.type(), 'returns a Maybe on one element iterable')
  t.equals(last(two).type(), M.type(), 'returns a Maybe on two element iterable')

  t.equals(last(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(last(one).option('Nothing'), 2, 'returns `2` on two element iterable')
  t.equals(last(two).option('Nothing'), 3, 'returns `3` on three element iterable')

  t.end()
})
