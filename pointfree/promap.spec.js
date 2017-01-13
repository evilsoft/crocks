const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const identity = require('../combinators/identity')

const promap = require('./promap')

test('promap pointfree', t => {
  const m = bindFunc(promap)
  const f = { promap: noop }

  t.ok(isFunction(promap), 'is a function')

  t.throws(m(undefined, noop, f), 'throws if first arg is undefined')
  t.throws(m(null, noop, f), 'throws if first arg is null')
  t.throws(m(0, noop, f), 'throws if first arg is a falsey number')
  t.throws(m(1, noop, f), 'throws if first arg is a truthy number')
  t.throws(m('', noop, f), 'throws if first arg is a falsey string')
  t.throws(m('string', noop, f), 'throws if first arg is a truthy string')
  t.throws(m(false, noop, f), 'throws if first arg is false')
  t.throws(m(true, noop, f), 'throws if first arg is true')
  t.throws(m([], noop, f), 'throws if first arg is an array')
  t.throws(m({}, noop, f), 'throws if first arg is an object')

  t.throws(m(noop, undefined, f), 'throws if second arg is undefined')
  t.throws(m(noop, null, f), 'throws if second arg is null')
  t.throws(m(noop, 0, f), 'throws if second arg is a falsey number')
  t.throws(m(noop, 1, f), 'throws if second arg is a truthy number')
  t.throws(m(noop, '', f), 'throws if second arg is a falsey string')
  t.throws(m(noop, 'string', f), 'throws if second arg is a truthy string')
  t.throws(m(noop, false, f), 'throws if second arg is false')
  t.throws(m(noop, true, f), 'throws if second arg is true')
  t.throws(m(noop, [], f), 'throws if second arg is an array')
  t.throws(m(noop, {}, f), 'throws if second arg is an object')

  t.throws(m(noop, noop, undefined), 'throws if third arg is undefined')
  t.throws(m(noop, noop, null), 'throws if third arg is null')
  t.throws(m(noop, noop, 0), 'throws if third arg is a falsey number')
  t.throws(m(noop, noop, 1), 'throws if third arg is a truthy number')
  t.throws(m(noop, noop, ''), 'throws if third arg is a falsey string')
  t.throws(m(noop, noop, 'string'), 'throws if third arg is a truthy string')
  t.throws(m(noop, noop, false), 'throws if third arg is false')
  t.throws(m(noop, noop, true), 'throws if third arg is true')
  t.throws(m(noop, noop, {}), 'throws if third arg is an object')

  t.end()
})

test('promap profunctor', t => {
  const m = { promap: sinon.spy(noop) }

  promap(identity)(identity, m)

  t.ok(m.promap.calledWith(identity, identity), 'calls promap on profunctor, passing the function')

  t.end()
})

test('promap function composition', t => {
  const left = sinon.spy(x => x + 2)
  const right = sinon.spy(x => x * 10)

  const comp = promap(left, right, identity)
  const result = comp(5)

  t.ok(isFunction(comp), 'returns a function')
  t.ok(left.calledBefore(right), 'calls the left function first')

  t.ok(right.calledWith(left.returnValues[0]), 'result of left is passed to the right')
  t.equal(result, right.returnValues[0], 'result of right is returned')

  t.end()
})
