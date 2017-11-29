const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x
const identity = x => x

const coalesce = require('./coalesce')

test('coalesce pointfree', t => {
  const m = bindFunc(coalesce)
  const f = { coalesce: unit }

  t.ok(isFunction(coalesce), 'is a function')

  t.throws(m(undefined, unit, f), 'throws if first arg is undefined')
  t.throws(m(null, unit, f), 'throws if first arg is null')
  t.throws(m(0, unit, f), 'throws if first arg is a falsey number')
  t.throws(m(1, unit, f), 'throws if first arg is a truthy number')
  t.throws(m('', unit, f), 'throws if first arg is a falsey string')
  t.throws(m('string', unit, f), 'throws if first arg is a truthy string')
  t.throws(m(false, unit, f), 'throws if first arg is false')
  t.throws(m(true, unit, f), 'throws if first arg is true')
  t.throws(m([], unit, f), 'throws if first arg is an array')
  t.throws(m({}, unit, f), 'throws if first arg is an object')

  t.throws(m(unit, undefined, f), 'throws if second arg is undefined')
  t.throws(m(unit, null, f), 'throws if second arg is null')
  t.throws(m(unit, 0, f), 'throws if second arg is a falsey number')
  t.throws(m(unit, 1, f), 'throws if second arg is a truthy number')
  t.throws(m(unit, '', f), 'throws if second arg is a falsey string')
  t.throws(m(unit, 'string', f), 'throws if second arg is a truthy string')
  t.throws(m(unit, false, f), 'throws if second arg is false')
  t.throws(m(unit, true, f), 'throws if second arg is true')
  t.throws(m(unit, [], f), 'throws if second arg is an array')
  t.throws(m(unit, {}, f), 'throws if second arg is an object')

  t.throws(m(unit, unit, undefined), 'throws if third arg is undefined')
  t.throws(m(unit, unit, null), 'throws if third arg is null')
  t.throws(m(unit, unit, 0), 'throws if third arg is a falsey number')
  t.throws(m(unit, unit, 1), 'throws if third arg is a truthy number')
  t.throws(m(unit, unit, ''), 'throws if third arg is a falsey string')
  t.throws(m(unit, unit, 'string'), 'throws if third arg is a truthy string')
  t.throws(m(unit, unit, false), 'throws if third arg is false')
  t.throws(m(unit, unit, true), 'throws if third arg is true')
  t.throws(m(unit, unit, {}), 'throws if third arg is an object')

  t.end()
})

test('coalesce sum type', t => {
  const x = 'result'
  const m = { coalesce: sinon.spy(constant(x)) }

  const result = coalesce(identity, identity, m)

  t.ok(m.coalesce.calledWith(identity, identity), 'calls coalesce on sum types, passing the functions')
  t.equal(result, x, 'returns the result of the call to coalesce')

  t.end()
})
