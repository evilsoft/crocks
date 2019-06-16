const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const M = require('../core/Maybe')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const init = require('./init')

test('init pointfree', t => {
  const f = bindFunc(init)

  t.ok(isFunction(init), 'is a function')

  const err = /init: Array, String, or List required/
  t.throws(f(undefined), err, 'throws when arg is undefined')
  t.throws(f(null), err, 'throws when arg is null')
  t.throws(f(0), err, 'throws when arg is falsey number')
  t.throws(f(1), err, 'throws when arg is truthy number')
  t.throws(f(false), err, 'throws when arg is false')
  t.throws(f(true), err, 'throws when arg is true')
  t.throws(f({}), err, 'throws when arg is an object without head')
  t.throws(f(unit), err, 'throws when arg is function')

  t.end()
})

test('init pointfree arrays', t => {
  const empty = []
  const one = [ 1 ]
  const two = [ 2, 3 ]
  const three = [ 4, 5, 6 ]

  t.equals(init(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(init(one).type(), M.type(), 'returns a Maybe on one element array')
  t.equals(init(two).type(), M.type(), 'returns a Maybe on two element array')
  t.equals(init(three).type(), M.type(), 'returns a Maybe on two element array')

  t.equals(init(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(init(one).option('Nothing'), 'Nothing', 'returns a Nothing on one element array')
  t.same(init(two).option('Nothing'), [ 2 ], 'returns `[ 2 ]` on two element array')
  t.same(init(three).option('Nothing'), [ 4, 5 ], 'returns `[ 4, 5 ]` on two element array')

  t.end()
})

test('init pointfree strings', t => {
  const empty = ''
  const one = 'a'
  const two = 'bc'
  const three = 'def'

  t.equals(init(empty).type(), M.type(), 'returns a Maybe on empty')
  t.equals(init(one).type(), M.type(), 'returns a Maybe on one element array')
  t.equals(init(two).type(), M.type(), 'returns a Maybe on two element array')
  t.equals(init(three).type(), M.type(), 'returns a Maybe on two element array')

  t.equals(init(empty).option('Nothing'), 'Nothing', 'returns a Nothing on empty')
  t.equals(init(one).option('Nothing'), 'Nothing', 'returns a Nothing on one char string')
  t.equals(init(two).option('Nothing'), 'b', 'returns `b` on two char string')
  t.equals(init(three).option('Nothing'), 'de', 'returns `de` on two char string')

  t.end()
})

test('init pointfree List', t => {
  const m = { init: sinon.spy(constant('result')) }

  const result = init(m)

  t.ok(m.init.called, 'calls init on list passing first arg')
  t.equal(m.init.returnValues[0], result, 'returns the result of the List init')

  t.end()
})
