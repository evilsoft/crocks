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

  mapAll(identity)(m)
  t.ok(m.mapAll.called, 'calls mapAll on the passed container')

  t.end()
})
