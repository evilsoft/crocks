const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const fl = require('../core/flNames')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x

const mock = x => Object.assign({}, {
  map: unit,
  alt: sinon.spy(),
  type: constant('Alt')
}, x)

const alt = require('./alt')

test('alt pointfree', t => {
  const a = bindFunc(alt)
  const m = mock({ alt: unit })

  t.ok(isFunction(alt), 'is a function')

  const err = /alt: Both arguments must be Alts of the same type/
  t.throws(a(undefined, m), err, 'throws if first arg is undefined')
  t.throws(a(null, m), err, 'throws if first arg is null')
  t.throws(a(0, m), err, 'throws if first arg is a falsey number')
  t.throws(a(1, m), err, 'throws if first arg is a truthy number')
  t.throws(a('', m), err, 'throws if first arg is a falsey string')
  t.throws(a('string', m), err, 'throws if first arg is a truthy string')
  t.throws(a(false, m), err, 'throws if first arg is false')
  t.throws(a(true, m), err, 'throws if first arg is true')
  t.throws(a([], m), err, 'throws if first arg is an array')
  t.throws(a({}, m), err, 'throws if first arg is an object')

  t.throws(a(m, undefined), err, 'throws if second arg is undefined')
  t.throws(a(m, null), err, 'throws if second arg is null')
  t.throws(a(m, 0), err, 'throws if second arg is a falsey number')
  t.throws(a(m, 1), err, 'throws if second arg is a truthy number')
  t.throws(a(m, ''), err, 'throws if second arg is a falsey string')
  t.throws(a(m, 'string'), err, 'throws if second arg is a truthy string')
  t.throws(a(m, false), err, 'throws if second arg is false')
  t.throws(a(m, true), err, 'throws if second arg is true')
  t.throws(a(m, []), err, 'throws if second arg is an array')
  t.throws(a(m, {}), err, 'throws if second arg is an object')

  t.end()
})

test('alt with Alt', t => {
  const x = 'result'
  const s = mock({ alt: sinon.spy(constant(x)) })
  const p = mock({ alt: sinon.spy(unit) })

  const result = alt(p, s)

  t.ok(s.alt.calledWith(p), 'calls alt on second argument passing in the first')
  t.ok(s.alt.calledOn(s), 'binds alt to second argument')
  t.equal(result, x, 'returns the result of alt on second argument')

  t.end()
})

test('alt with Alt (fantasy-land)', t => {
  const x = 'result'
  const s = mock({ [fl.alt]: sinon.spy(constant(x)) })
  const p = mock({ [fl.alt]: sinon.spy(unit) })

  const result = alt(p, s)

  t.ok(s[fl.alt].calledWith(p), 'calls fantasy-land/alt on second argument passing in the first')
  t.ok(s[fl.alt].calledOn(s), 'binds fantasy-land/alt to second argument')
  t.equal(result, x, 'returns the result of fantasy-land/alt on second argument')
  t.notOk(s.alt.called, 'does not call alt on second argument')

  t.end()
})
