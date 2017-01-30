const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isArray = require('../predicates/isArray')
const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')
const identity = require('../combinators/identity')

const MockCrock = require('../test/MockCrock')

const traverse = require('./traverse')

test('traverse pointfree', t => {
  const trav = bindFunc(traverse)

  const x = 'super sweet'
  const m = { traverse: sinon.spy(constant(x)) }

  t.ok(isFunction(traverse), 'is a function')

  t.throws(trav(undefined, noop, m), 'throws if first arg is undefined')
  t.throws(trav(null, noop, m), 'throws if first arg is null')
  t.throws(trav(0, noop, m), 'throws if first arg is a falsey number')
  t.throws(trav(1, noop, m), 'throws if first arg is a truthy number')
  t.throws(trav('', noop, m), 'throws if first arg is a falsey string')
  t.throws(trav('string', noop, m), 'throws if first arg is a truthy string')
  t.throws(trav(false, noop, m), 'throws if first arg is false')
  t.throws(trav(true, noop, m), 'throws if first arg is true')
  t.throws(trav([], noop, m), 'throws if first arg is an array')
  t.throws(trav({}, noop, m), 'throws if first arg is an object')

  t.throws(trav(noop, undefined, m), 'throws if second arg is undefined')
  t.throws(trav(noop, null, m), 'throws if second arg is null')
  t.throws(trav(noop, 0, m), 'throws if second arg is a falsey number')
  t.throws(trav(noop, 1, m), 'throws if second arg is a truthy number')
  t.throws(trav(noop, '', m), 'throws if second arg is a falsey string')
  t.throws(trav(noop, 'string', m), 'throws if second arg is a truthy string')
  t.throws(trav(noop, false, m), 'throws if second arg is false')
  t.throws(trav(noop, true, m), 'throws if second arg is true')
  t.throws(trav(noop, [], m), 'throws if second arg is an array')
  t.throws(trav(noop, {}, m), 'throws if second arg is an object')

  t.throws(trav(noop, noop, undefined), 'throws if third arg is undefined')
  t.throws(trav(noop, noop, null), 'throws if third arg is null')
  t.throws(trav(noop, noop, 0), 'throws if third arg is a falsey number')
  t.throws(trav(noop, noop, 1), 'throws if third arg is a truthy number')
  t.throws(trav(noop, noop, ''), 'throws if third arg is a falsey string')
  t.throws(trav(noop, noop, 'string'), 'throws if third arg is a truthy string')
  t.throws(trav(noop, noop, false), 'throws if third arg is false')
  t.throws(trav(noop, noop, true), 'throws if third arg is true')
  t.throws(trav(noop, noop, {}), 'throws if third arg is an object')

  t.throws(trav(constant(undefined), MockCrock.of, [ 5 ]), 'throws if first function returns undefined')
  t.throws(trav(constant(null), MockCrock.of, [ 5 ]), 'throws if first function returns null')
  t.throws(trav(constant(0), MockCrock.of, [ 5 ]), 'throws if first function returns falsey number')
  t.throws(trav(constant(1), MockCrock.of, [ 5 ]), 'throws if first function returns truthy number')
  t.throws(trav(constant(''), MockCrock.of, [ 5 ]), 'throws if first function returns a falsey string')
  t.throws(trav(constant('string'), MockCrock.of, [ 5 ]), 'throws if first function returns a truthy string')
  t.throws(trav(constant(false), MockCrock.of, [ 5 ]), 'throws if first function returns false')
  t.throws(trav(constant(true), MockCrock.of, [ 5 ]), 'throws if first function returns true')
  t.throws(trav(constant({}), MockCrock.of, [ 5 ]), 'throws if first function returns object')
  t.throws(trav(constant([]), MockCrock.of, [ 5 ]), 'throws if first function returns an array')
  t.throws(trav(constant(noop), MockCrock.of, [ 5 ]), 'throws if first function returns a function')

  t.throws(trav(MockCrock.of, identity, [ undefined ]), 'throws if first function returns undefined')
  t.throws(trav(MockCrock.of, identity, [ null ]), 'throws if first function returns null')
  t.throws(trav(MockCrock.of, identity, [ 0 ]), 'throws if first function returns falsey number')
  t.throws(trav(MockCrock.of, identity, [ 1 ]), 'throws if first function returns truthy number')
  t.throws(trav(MockCrock.of, identity, [ '' ]), 'throws if first function returns a falsey string')
  t.throws(trav(MockCrock.of, identity, [ 'string' ]), 'throws if first function returns a truthy string')
  t.throws(trav(MockCrock.of, identity, [ false ]), 'throws if first function returns false')
  t.throws(trav(MockCrock.of, identity, [ true ]), 'throws if first function returns true')
  t.throws(trav(MockCrock.of, identity, [ {} ]), 'throws if first function returns object')
  t.throws(trav(MockCrock.of, identity, [ [] ]), 'throws if first function returns an array')
  t.throws(trav(MockCrock.of, identity, [ noop ]), 'throws if first function returns a function')

  t.doesNotThrow(trav(noop, noop, m), 'allows two functions and a Traverable')
  t.doesNotThrow(trav(noop, noop, []), 'allows two functions and an Array')
  t.doesNotThrow(trav(MockCrock.of, MockCrock.of, [ 1, 2, 3 ]), 'allows two applicative returning functions and an Array ')

  t.end()
})

test('traverse with Traversable', t => {
  const x = 'super sweet'
  const m = { traverse: sinon.spy(constant(x)) }

  const f = sinon.spy()
  const g = sinon.spy()
  const res = traverse(f, g, m)

  t.ok(m.traverse.calledWith(f, g), 'calls traverse on Traversable, passing the functions')
  t.equal(res, x, 'returns the result of traverse on Traversable')

  t.end()
})

test('traverse with Array', t => {
  const f = sinon.spy(x => MockCrock(x + 2))

  const outer = traverse(MockCrock.of, f, [ 12, 23 ])
  const inner = outer.value()

  t.equal(outer.type(), 'MockCrock', 'outer container is a MockCrock')
  t.ok(isArray(inner), 'inner container is an Array')
  t.same((inner), [ 14, 25 ], 'mapping/lifting function applied to every element')

  t.end()
})
