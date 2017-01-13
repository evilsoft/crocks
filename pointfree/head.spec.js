const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction  = require('../predicates/isFunction')

const constant = require('../combinators/constant')

const M = require('../crocks/Maybe')

const head = require('./head')

test('head pointfree', t => {
  const f = bindFunc(head)

  t.ok(isFunction(head), 'is a function')

  t.throws(f(undefined), TypeError, 'throws when arg is undefined')
  t.throws(f(null), TypeError, 'throws when arg is null')
  t.throws(f(0), TypeError, 'throws when arg is falsey number')
  t.throws(f(1), TypeError, 'throws when arg is truthy number')
  t.throws(f(false), TypeError, 'throws when arg is false')
  t.throws(f(true), TypeError, 'throws when arg is true')
  t.throws(f({}), TypeError, 'throws when arg is an object without head')
  t.throws(f(noop), TypeError, 'throws whetypes a function')

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
