const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x
const identity = x => x

const mapAll = require('./mapAll')

test('mapAll pointfree', t => {
  const f = bindFunc(mapAll)
  const g = bindFunc(mapAll(identity))
  const x = () => 'result'
  const m = { mapAll: sinon.spy(constant(x)) }

  t.ok(isFunction(mapAll), 'is a function')

  const err = /mapAll: All arguments must be Functions/
  t.throws(f(undefined), err, 'throws if passed undefined')
  t.throws(f(null), err, 'throws if passed null')
  t.throws(f(0), err, 'throws if passed a falsey number')
  t.throws(f(1), err, 'throws if passed a truthy number')
  t.throws(f(''), err, 'throws if passed a falsey string')
  t.throws(f('string'), err, 'throws if passed a truthy string')
  t.throws(f(false), err, 'throws if passed false')
  t.throws(f(true), err, 'throws if passed true')
  t.throws(f([]), err, 'throws if passed an array')
  t.throws(f({}), err, 'throws if passed an object')

  t.ok(isFunction(f(unit)), 'returns a function when passed a single function')
  t.ok(isFunction(f(unit, unit, unit)), 'returns a function when passed multiple functions')

  const err1 = /mapAll: Tuple required/
  t.throws(g(undefined), err1, 'throws if passed undefined')
  t.throws(g(null), err1, 'throws if passed null')
  t.throws(g(0), err1, 'throws if passed a falsey number')
  t.throws(g(1), err1, 'throws if passed a truthy number')
  t.throws(g(''), err1, 'throws if passed a falsey string')
  t.throws(g('string'), err1, 'throws if passed a truthy string')
  t.throws(g(false), err1, 'throws if passed false')
  t.throws(g(true), err1, 'throws if passed true')
  t.throws(g([]), err1, 'throws if passed an array')
  t.throws(g({}), err1, 'throws if passed an object')
  t.throws(g(unit), err1, 'throws if passed a function')

  mapAll(identity)(m)

  t.ok(m.mapAll.called, 'calls mapAll on the passed container')

  t.end()
})
