const test = require('tape')
const helpers = require('../test/helpers')

const Identity = require('../crocks/Identity')

const bindFunc = helpers.bindFunc

const isFunction = require('../predicates/isFunction')

const identity = require('../combinators/identity')

const liftA2 = require('./liftA2')

test('liftA2', t => {
  const fn = bindFunc(liftA2)
  const m1 = Identity(4)
  const m2 = Identity(8)

  const add = x => y => x + y

  t.ok(isFunction(liftA2), 'is a function')

  t.throws(fn(undefined, m1, m2), TypeError, 'throws when first arg is undefined')
  t.throws(fn(null, m1, m2), TypeError, 'throws when first arg is null')
  t.throws(fn(0, m1, m2), TypeError, 'throws when first arg is falsey number')
  t.throws(fn(1, m1, m2), TypeError, 'throws when first arg is truthy number')
  t.throws(fn('', m1, m2), TypeError, 'throws when first arg is falsey string')
  t.throws(fn('string', m1, m2), TypeError, 'throws when first arg is truthy string')
  t.throws(fn(false, m1, m2), TypeError, 'throws when first arg is false')
  t.throws(fn(true, m1, m2), TypeError, 'throws when first arg is true')
  t.throws(fn({}, m1, m2), TypeError, 'throws when first arg is an object')
  t.throws(fn([], m1, m2), TypeError, 'throws when first arg is an array')

  t.throws(fn(add, undefined, m2), TypeError, 'throws when second arg is undefined')
  t.throws(fn(add, null, m2), TypeError, 'throws when second arg is null')
  t.throws(fn(add, 0, m2), TypeError, 'throws when second arg is falsey number')
  t.throws(fn(add, 1, m2), TypeError, 'throws when second arg is truthy number')
  t.throws(fn(add, '', m2), TypeError, 'throws when second arg is falsey string')
  t.throws(fn(add, 'string', m2), TypeError, 'throws when second arg is truthy string')
  t.throws(fn(add, false, m2), TypeError, 'throws when second arg is false')
  t.throws(fn(add, true, m2), TypeError, 'throws when second arg is true')
  t.throws(fn(add, {}, m2), TypeError, 'throws when second arg is an object')
  t.throws(fn(add, [], m2), TypeError, 'throws when second arg is an array')
  t.throws(fn(add, identity, m2), TypeError, 'throws when second arg is function')

  t.throws(fn(add, m1, undefined), TypeError, 'throws when second arg is undefined')
  t.throws(fn(add, m1, null), TypeError, 'throws when second arg is null')
  t.throws(fn(add, m1, 0), TypeError, 'throws when second arg is falsey number')
  t.throws(fn(add, m1, 1), TypeError, 'throws when second arg is truthy number')
  t.throws(fn(add, m1, ''), TypeError, 'throws when second arg is falsey string')
  t.throws(fn(add, m1, 'string'), TypeError, 'throws when second arg is truthy string')
  t.throws(fn(add, m1, false), TypeError, 'throws when second arg is false')
  t.throws(fn(add, m1, true), TypeError, 'throws when second arg is true')
  t.throws(fn(add, m1, {}), TypeError, 'throws when second arg is an object')
  t.throws(fn(add, m1, []), TypeError, 'throws when second arg is an array')
  t.throws(fn(add, m1, identity), TypeError, 'throws when second arg is function')

  const result = liftA2(add, m1, m2)

  t.equal(result.type(), m1.type(), 'returns an Apply of the same type of second argument')
  t.ok(result.equals(Identity(12)), '4 + 8 === 12, result === 12')

  t.end()
})
