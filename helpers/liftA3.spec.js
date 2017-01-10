const test = require('tape')
const helpers = require('../test/helpers')

const Identity = require('../crocks/Identity')

const isFunction = require('../internal/isFunction')
const bindFunc = helpers.bindFunc
const identity = require('../combinators/identity')

const liftA3 = require('./liftA3')

test('liftA3', t => {
  const fn = bindFunc(liftA3)
  const m1 = Identity(23)
  const m2 = Identity(5)
  const m3 = Identity(19)

  const add = x => y => z => x + y + z

  t.ok(isFunction(liftA3), 'is a function')

  t.throws(fn(undefined, m1, m2, m3), TypeError, 'throws when first arg is undefined')
  t.throws(fn(null, m1, m2, m3), TypeError, 'throws when first arg is null')
  t.throws(fn(0, m1, m2, m3), TypeError, 'throws when first arg is falsey number')
  t.throws(fn(1, m1, m2, m3), TypeError, 'throws when first arg is truthy number')
  t.throws(fn('', m1, m2, m3), TypeError, 'throws when first arg is falsey string')
  t.throws(fn('string', m1, m2, m3), TypeError, 'throws when first arg is truthy string')
  t.throws(fn(false, m1, m2, m3), TypeError, 'throws when first arg is false')
  t.throws(fn(true, m1, m2, m3), TypeError, 'throws when first arg is true')
  t.throws(fn({}, m1, m2, m3), TypeError, 'throws when first arg is an object')
  t.throws(fn([], m1, m2, m3), TypeError, 'throws when first arg is an array')

  t.throws(fn(add, undefined, m2, m3), TypeError, 'throws when second arg is undefined')
  t.throws(fn(add, null, m2, m3), TypeError, 'throws when second arg is null')
  t.throws(fn(add, 0, m2, m3), TypeError, 'throws when second arg is falsey number')
  t.throws(fn(add, 1, m2, m3), TypeError, 'throws when second arg is truthy number')
  t.throws(fn(add, '', m2, m3), TypeError, 'throws when second arg is falsey string')
  t.throws(fn(add, 'string', m2, m3), TypeError, 'throws when second arg is truthy string')
  t.throws(fn(add, false, m2, m3), TypeError, 'throws when second arg is false')
  t.throws(fn(add, true, m2, m3), TypeError, 'throws when second arg is true')
  t.throws(fn(add, {}, m2, m3), TypeError, 'throws when second arg is an object')
  t.throws(fn(add, [], m2, m3), TypeError, 'throws when second arg is an array')
  t.throws(fn(add, identity, m2, m3), TypeError, 'throws when second arg is function')

  t.throws(fn(add, m1, undefined, m3), TypeError, 'throws when second arg is undefined')
  t.throws(fn(add, m1, null, m3), TypeError, 'throws when second arg is null')
  t.throws(fn(add, m1, 0, m3), TypeError, 'throws when second arg is falsey number')
  t.throws(fn(add, m1, 1, m3), TypeError, 'throws when second arg is truthy number')
  t.throws(fn(add, m1, '', m3), TypeError, 'throws when second arg is falsey string')
  t.throws(fn(add, m1, 'string', m3), TypeError, 'throws when second arg is truthy string')
  t.throws(fn(add, m1, false, m3), TypeError, 'throws when second arg is false')
  t.throws(fn(add, m1, true, m3), TypeError, 'throws when second arg is true')
  t.throws(fn(add, m1, {}, m3), TypeError, 'throws when second arg is an object')
  t.throws(fn(add, m1, [], m3), TypeError, 'throws when second arg is an array')
  t.throws(fn(add, m1, identity, m3), TypeError, 'throws when second arg is function')

  const result = liftA3(add, m1, m2, m3)

  t.equal(result.type(), m1.type(), 'returns an Apply of the same type of second argument')
  t.ok(result.equals(Identity(47)), '23 + 5 + 19 === 47, result === 12')

  t.end()
})
