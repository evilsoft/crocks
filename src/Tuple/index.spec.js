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

  const noNum = /Tuple: Tuple size should be a number greater than 1 and less than 10/
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
  t.throws(f(111), noNum, 'throws with a number greater than 10')

  t.equals(Tuple.length, 1, 'constructor has a length of 1')
  t.equals(Tuple(2).length, 2, 'returns a function with correct length (2)')
  t.equals(Tuple(3).length, 3, 'returns a function with correct length (3)')
  t.equals(Tuple(4).length, 4, 'returns a function with correct length (4)')
  t.equals(Tuple(5).length, 5, 'returns a function with correct length (5)')
  t.equals(Tuple(6).length, 6, 'returns a function with correct length (6)')
  t.equals(Tuple(7).length, 7, 'returns a function with correct length (7)')
  t.equals(Tuple(8).length, 8, 'returns a function with correct length (8)')
  t.equals(Tuple(9).length, 9, 'returns a function with correct length (9)')
  t.equals(Tuple(10).length, 10, 'returns a function with correct length (10)')

  t.throws(
    bindFunc(Tuple(3))(1, 2, 3, 4),
    /3-Tuple: Expected 3 values, but got 4/,
    'throws if invalid number of arguments'
  )
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

test('Tuple project', t => {
  const tuple = Tuple(3)('zalgo', 'is', 'back')

  t.ok(isFunction(tuple.project), 'is a function')

  const project = bindFunc(tuple.project)
  const err = /3-Tuple.project: Index should be an integer between 2 and 3/

  t.throws(project(0), err, 'throws with index less than 2')
  t.throws(project(6), err, 'throws with index less than tuple length')

  t.same(tuple.project(1), 'zalgo', 'provides the first value')
  t.same(tuple.project(2), 'is', 'provides the second value')
  t.same(tuple.project(3), 'back', 'provides the third value')

  t.end()
})

test('Tuple map functionality', t => {
  const m = Tuple(3)(5, 45, 50)
  const n = m.map(x => x + 5)

  t.equal(m.map(identity).type(), 'Tuple', 'returns a Tuple')
  t.equal(n.project(1), 5, 'Does not modify first value')
  t.equal(n.project(2), 45, 'Does not modify second value')
  t.equal(n.project(3), 55, 'applies function to third value')

  t.end()
})

test('Tuple mapAll errors', t => {
  const m = Tuple(3)(5, 45, 50)

  const mapAll = bindFunc(m.mapAll)
  const err1 = /3-Tuple.mapAll: Requires 3 functions/
  const err2 = /3-Tuple.mapAll: Functions required for all arguments/

  t.throws(
    mapAll(identity, identity),
    err1,
    'throws with an invalid number of functions'
  )
  t.throws(
    mapAll(identity, 5, identity),
    err2,
    'throws if all arguments are not functions'
  )
  t.end()
})

test('Tuple mapAll functionality', t => {
  const m = Tuple(3)(5, 45, 50)
  const n = m.mapAll(identity, x => x + 5, x => x - 10)

  t.equal(m.map(identity).type(), 'Tuple', 'returns a Tuple')
  t.equal(n.project(1), 5, 'applies function to first value')
  t.equal(n.project(2), 50, 'applies function to second value')
  t.equal(n.project(3), 40, 'applies function to third value')

  t.end()
})
