const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')
const Tuple = require('./index')

const constant = x => () => x
const identity = x => x

const nMap = require('./nMap')

test('nMap pointfree', t => {
  const f = bindFunc(nMap)
  const x = () => 'result'

  t.ok(isFunction(nMap), 'is a function')

  const badInt = /nMap: Integer between 1 and 10 required for first argument/
  t.throws(f(undefined), badInt, 'throws if passed undefined')
  t.throws(f(unit), badInt, 'throws if passed a function')
  t.throws(f(null), badInt, 'throws if passed null')
  t.throws(f(''), badInt, 'throws if passed a falsey string')
  t.throws(f('string'), badInt, 'throws if passed a truthy string')
  t.throws(f(false), badInt, 'throws if passed false')
  t.throws(f(true), badInt, 'throws if passed true')
  t.throws(f([]), badInt, 'throws if passed an array')
  t.throws(f({}), badInt, 'throws if passed an object')
  t.throws(f(0), badInt, 'throws if passed a number less than 1')
  t.throws(f(11), badInt, 'throws if passed a number greater than 10')

  t.ok(isFunction(f(unit)), 'returns a function when passed a single function')
  t.ok(isFunction(f(unit, unit, unit)), 'returns a function when passed multiple functions')

  const p = Tuple(1)(0)
  const q = Tuple(3)(0, 0, 0)

  const g = bindFunc(nMap(1))
  const h = bindFunc(nMap(3))

  const noFunc = /nMap: Functions required/
  t.throws(g(undefined, p), noFunc, 'throws if passed undefined as mapping function')
  t.throws(g(null, p), noFunc, 'throws if passed null as mapping function')
  t.throws(g(0, p), noFunc, 'throws if passed a falsey number as mapping function')
  t.throws(g(1, p), noFunc, 'throws if passed a truthy number as mapping function')
  t.throws(g('', p), noFunc, 'throws if passed a falsey string as mapping function')
  t.throws(g('string', p), noFunc, 'throws if passed a truthy string as mapping function')
  t.throws(g(false, p), noFunc, 'throws if passed false as mapping function')
  t.throws(g(true, p), noFunc, 'throws if passed true as mapping function')
  t.throws(g([], p), noFunc, 'throws if passed an array as mapping function')
  t.throws(g({}, p), noFunc, 'throws if passed an object as mapping function')
  t.throws(h(identity, identity, null, q), noFunc, 'throws when all arguments are not functions')
  t.doesNotThrow(g(unit, p), noFunc, 'accepts a function')

  const noTuple = /nMap: 1-Tuple required/
  t.throws(g(identity, undefined), noTuple, 'throws if passed undefined')
  t.throws(g(identity, null), noTuple, 'throws if passed null')
  t.throws(g(identity, 0), noTuple, 'throws if passed a falsey number')
  t.throws(g(identity, 1), noTuple, 'throws if passed a truthy number')
  t.throws(g(identity, ''), noTuple, 'throws if passed a falsey string')
  t.throws(g(identity, 'string'), noTuple, 'throws if passed a truthy string')
  t.throws(g(identity, false), noTuple, 'throws if passed false')
  t.throws(g(identity, true), noTuple, 'throws if passed true')
  t.throws(g(identity, []), noTuple, 'throws if passed an array')
  t.throws(g(identity, {}), noTuple, 'throws if passed an object')
  t.throws(g(identity, identity), noTuple, 'throws if passed a function')
  t.throws(g(identity, Tuple(3)(0, 0, 0)), noTuple, 'throws if passed a Tuple of different length')
  t.doesNotThrow(g(identity, Tuple(1)(0)), noTuple, 'accepts a Tuple of the same length')

  const inc = f => f + 1
  const branch = (n, value) => Tuple(n)(...Array(n).fill(value))

  t.same(nMap(1, inc, branch(1, 0)).toArray(), Array(1).fill(1), 'maps a Tuple with (1) element')
  t.same(nMap(2, inc, inc, branch(2, 0)).toArray(), Array(2).fill(1), 'maps a Tuple with (2) elements')
  t.same(nMap(3, inc, inc, inc, branch(3, 0)).toArray(), Array(3).fill(1), 'maps a Tuple with (3) elements')
  t.same(nMap(4, inc, inc, inc, inc, branch(4, 0)).toArray(), Array(4).fill(1), 'maps a Tuple with (4) elements')
  t.same(nMap(5, inc, inc, inc, inc, inc, branch(5, 0)).toArray(), Array(5).fill(1), 'maps a Tuple with (5) elements')
  t.same(nMap(6, inc, inc, inc, inc, inc, inc, branch(6, 0)).toArray(), Array(6).fill(1), 'maps a Tuple with (6) elements')
  t.same(nMap(7, inc, inc, inc, inc, inc, inc, inc, branch(7, 0)).toArray(), Array(7).fill(1), 'maps a Tuple with (7) elements')
  t.same(nMap(8, inc, inc, inc, inc, inc, inc, inc, inc, branch(8, 0)).toArray(), Array(8).fill(1), 'maps a Tuple with (8) elements')
  t.same(nMap(9, inc, inc, inc, inc, inc, inc, inc, inc, inc, branch(9, 0)).toArray(), Array(9).fill(1), 'maps a Tuple with (9) elements')
  t.same(nMap(10, inc, inc, inc, inc, inc, inc, inc, inc, inc, inc, branch(10, 0)).toArray(), Array(10).fill(1), 'maps a Tuple with (10) elements')

  const m = { type: constant('3-Tuple'), nMap: sinon.spy(constant(x)) }

  nMap(3)(identity, identity, identity, m)
  t.ok(m.nMap.calledWith(identity, identity, identity), 'calls nMap on the passed container')

  t.end()
})
