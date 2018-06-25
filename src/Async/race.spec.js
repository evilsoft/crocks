const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Async = require('.')
const isFunction = require('../core/isFunction')

const race = require('./race')

const unit = () => undefined

test('race pointfree', t => {
  const r = bindFunc(race)

  const m = Async(unit)
  const n = Async(unit)

  t.ok(isFunction(race), 'is a function')

  const err = /race: Both arguments must be Asyncs/
  t.throws(r(undefined, m), err, 'throws if first arg is undefined')
  t.throws(r(null, m), err, 'throws if first arg is null')
  t.throws(r(0, m), err, 'throws if arg first is a falsey number')
  t.throws(r(1, m), err, 'throws if arg first is a truthy number')
  t.throws(r('', m), err, 'throws if arg first is a falsey string')
  t.throws(r('string', m), err, 'throws if first arg is a truthy string')
  t.throws(r(false, m), err, 'throws if first arg is false')
  t.throws(r(true, m), err, 'throws if first arg is true')
  t.throws(r({}, m), err, 'throws if first arg is an object')
  t.throws(r([], m), err, 'throws if first arg is an array')

  t.throws(r(m, undefined), err, 'throws if second arg is undefined')
  t.throws(r(m, null), err, 'throws if second arg is null')
  t.throws(r(m, 0), err, 'throws if second arg is a falsey number')
  t.throws(r(m, 1), err, 'throws if second arg is a truthy number')
  t.throws(r(m, ''), err, 'throws if second arg is a falsey string')
  t.throws(r(m, 'string'), err, 'throws if second arg is a truthy string')
  t.throws(r(m, false), err, 'throws if second arg is false')
  t.throws(r(m, true), err, 'throws if second arg is true')
  t.throws(r(m, {}), err, 'throws if second arg is an object')
  t.throws(r(m, []), err, 'throws if second arg is an array')

  m.race = sinon.spy()

  race(n, m)

  t.ok(m.race.calledWith(n), 'calls race on second async, passing the first')

  t.end()
})
