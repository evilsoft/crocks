const test = require('tape')
const fl = require('../core/flNames')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('./../core/isFunction')
const unit = require('./../core/_unit')

const Tuple = require('./index')

const identity = x => x

test('Tuple', t => {
  const f = bindFunc(Tuple)

  const noNum = /Tuple: Tuple size should be a number greater than 1/
  t.ok(isFunction(Tuple), 'is a function')

  t.throws(f(undefined), noNum, 'throws with undefined as first arg')
  t.throws(f(null), noNum, 'throws with null as first arg')
  t.throws(f(''), noNum, 'throws with falsey string as first arg')
  t.throws(f('string'), noNum, 'throws with truthy string as first arg')
  t.throws(f(false), noNum, 'throws with false as first arg')
  t.throws(f(true), noNum, 'throws with true as first arg')
  t.throws(f({}), noNum, 'throws with object as first arg')
  t.throws(f([]), noNum, 'throws with array as first arg')
  t.throws(f(unit), noNum, 'throws with function as first arg')
  t.throws(f(-1), noNum, 'throws with a number less than 1')

  t.ok(isFunction(Tuple(2)), 'returns a function')
  t.equals(Tuple(50).length, 50, 'returns a function of the correct length')

  t.end()
})

test('Tuple inspect', t => {
  const m = Tuple(2)(0, 'nice')

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Tuple( 0, "nice" )', 'returns inspect string')

  t.end()
})

test('Tuple map errors', t => {
  const map = bindFunc(Tuple(4)('zalgo', 'will', 'be', 'back').map)
  const err = /Tuple.map: Function required/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws with object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Tuple map fantasy-land errors', t => {
  const map = bindFunc(Tuple(4)('zalgo', 'will', 'be', 'back')[fl.map])

  const err = /Tuple.fantasy-land\/map: Function required/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws with object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Tuple map functionality', t => {
  const m = Tuple(3)(5, 45, 50)

  t.equal(m.map(identity).type(), 'Tuple', 'returns a Tuple')

  t.end()
})
