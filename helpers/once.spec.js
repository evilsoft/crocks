const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const identity = require('../combinators/identity')

const once = require('./once')

test('once', t => {
  const f = bindFunc(once)

  t.ok(isFunction(once), 'is a function')

  t.throws(f(undefined), 'throws with undefined')
  t.throws(f(null), 'throws with null')
  t.throws(f(0), 'throws with falsey number')
  t.throws(f(1), 'throws with truthy number')
  t.throws(f(''), 'throws with falsey string')
  t.throws(f('string'), 'throws with truthy string')
  t.throws(f(false), 'throws with false')
  t.throws(f(true), 'throws with true')
  t.throws(f({}), 'throws with an object')
  t.throws(f([]), 'throws with an array')

  t.doesNotThrow(f(noop), 'allows a function')

  const inner = sinon.spy(identity)
  const fn = once(inner)
  const x = 'smiles'

  t.equals(fn(x), x, 'returns first value')
  t.equals(fn('another'), x, 'caches original value')
  t.ok(inner.calledOnce, 'only calls wrapped function once')

  t.end()
})
