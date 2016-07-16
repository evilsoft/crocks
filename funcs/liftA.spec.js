const test    = require('tape')
const helpers = require('../test/helpers')

const Identity = require('../crocks/Identity')

const identity    = require('../combinators/identity')
const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc

const liftA = require('./liftA')

test('liftA', t => {
  const fn  = bindFunc(liftA)
  const m   = Identity(0)

  t.ok(isFunction(liftA), 'is a function')

  t.throws(fn(undefined, m), TypeError, 'throws when first arg is undefined')
  t.throws(fn(null, m), TypeError, 'throws when first arg is null')
  t.throws(fn(0, m), TypeError, 'throws when first arg is falsey number')
  t.throws(fn(1, m), TypeError, 'throws when first arg is truthy number')
  t.throws(fn('', m), TypeError, 'throws when first arg is falsey string')
  t.throws(fn('string', m), TypeError, 'throws when first arg is truthy string')
  t.throws(fn(false, m), TypeError, 'throws when first arg is false')
  t.throws(fn(true, m), TypeError, 'throws when first arg is true')
  t.throws(fn({}, m), TypeError, 'throws when first arg is an object')
  t.throws(fn([], m), TypeError, 'throws when first arg is an array')

  t.throws(fn(identity, undefined), TypeError, 'throws when second arg is undefined')
  t.throws(fn(identity, null), TypeError, 'throws when second arg is null')
  t.throws(fn(identity, 0), TypeError, 'throws when second arg is falsey number')
  t.throws(fn(identity, 1), TypeError, 'throws when second arg is truthy number')
  t.throws(fn(identity, ''), TypeError, 'throws when second arg is falsey string')
  t.throws(fn(identity, 'string'), TypeError, 'throws when second arg is truthy string')
  t.throws(fn(identity, false), TypeError, 'throws when second arg is false')
  t.throws(fn(identity, true), TypeError, 'throws when second arg is true')
  t.throws(fn(identity, {}), TypeError, 'throws when second arg is an object')
  t.throws(fn(identity, []), TypeError, 'throws when second arg is an array')
  t.throws(fn(identity, identity), TypeError, 'throws when second arg is function')

  const result = liftA(identity, m)

  t.equal(result.type(), m.type(), 'returns an Apply of the same type of second argument')
  t.ok(result.equals(m), 'with identity, result === m')

  t.end()
})
