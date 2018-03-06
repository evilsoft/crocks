const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')
const MockCrock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const unit = require('../core/_unit')

const constant = x => () => x

const traverse = require('./traverse')

test('traverse pointfree', t => {
  const trav = bindFunc(traverse)

  const x = 'super sweet'
  const m = { traverse: sinon.spy(constant(x)) }

  t.ok(isFunction(traverse), 'is a function')

  const err = /traverse: Applicative TypeRep or Apply returning function required for first argument/
  t.throws(trav(undefined, unit, m), err, 'throws if first arg is undefined')
  t.throws(trav(null, unit, m), err, 'throws if first arg is null')
  t.throws(trav(0, unit, m), err, 'throws if first arg is a falsey number')
  t.throws(trav(1, unit, m), err, 'throws if first arg is a truthy number')
  t.throws(trav('', unit, m), err, 'throws if first arg is a falsey string')
  t.throws(trav('string', unit, m), err, 'throws if first arg is a truthy string')
  t.throws(trav(false, unit, m), err, 'throws if first arg is false')
  t.throws(trav(true, unit, m), err, 'throws if first arg is true')
  t.throws(trav([], unit, m), err, 'throws if first arg is an array')
  t.throws(trav({}, unit, m), err, 'throws if first arg is an object')

  const noFunc = /traverse: Apply returning function required for second argument/
  t.throws(trav(unit, undefined, m), noFunc, 'throws if second arg is undefined')
  t.throws(trav(unit, null, m), noFunc, 'throws if second arg is null')
  t.throws(trav(unit, 0, m), noFunc, 'throws if second arg is a falsey number')
  t.throws(trav(unit, 1, m), noFunc, 'throws if second arg is a truthy number')
  t.throws(trav(unit, '', m), noFunc, 'throws if second arg is a falsey string')
  t.throws(trav(unit, 'string', m), noFunc, 'throws if second arg is a truthy string')
  t.throws(trav(unit, false, m), noFunc, 'throws if second arg is false')
  t.throws(trav(unit, true, m), noFunc, 'throws if second arg is true')
  t.throws(trav(unit, [], m), noFunc, 'throws if second arg is an array')
  t.throws(trav(unit, {}, m), noFunc, 'throws if second arg is an object')

  const noTrav = /traverse: Traversable or Array required for third argument/
  t.throws(trav(unit, unit, undefined), noTrav, 'throws if third arg is undefined')
  t.throws(trav(unit, unit, null), noTrav, 'throws if third arg is null')
  t.throws(trav(unit, unit, 0), noTrav, 'throws if third arg is a falsey number')
  t.throws(trav(unit, unit, 1), noTrav, 'throws if third arg is a truthy number')
  t.throws(trav(unit, unit, ''), noTrav, 'throws if third arg is a falsey string')
  t.throws(trav(unit, unit, 'string'), noTrav, 'throws if third arg is a truthy string')
  t.throws(trav(unit, unit, false), noTrav, 'throws if third arg is false')
  t.throws(trav(unit, unit, true), noTrav, 'throws if third arg is true')
  t.throws(trav(unit, unit, {}), noTrav, 'throws if third arg is an object')

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
  const inner = outer.valueOf()

  t.ok(isSameType(MockCrock, outer), 'outer container is a MockCrock')
  t.ok(isArray(inner), 'inner container is an Array')
  t.same(inner, [ 14, 25 ], 'mapping/lifting function applied to every element')

  t.end()
})
