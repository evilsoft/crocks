const test = require('tape')
const helpers = require('../../test/helpers')
const Last = require('../../test/LastMonoid')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')

const mconcat = require('./mconcat')

test('mconcat helper', t => {
  const mc = bindFunc(mconcat)

  t.ok(isFunction(mconcat), 'is a function')

  t.throws(mc(undefined, []), TypeError, 'throws when first arg is undefined')
  t.throws(mc(null, []), TypeError, 'throws when first arg is null')
  t.throws(mc(0, []), TypeError, 'throws when first arg is falsey number')
  t.throws(mc(1, []), TypeError, 'throws when first arg is truthy number')
  t.throws(mc('', []), TypeError, 'throws when first arg is falsey string')
  t.throws(mc('string', []), TypeError, 'throws when first arg is truthy string')
  t.throws(mc(false, []), TypeError, 'throws when first arg is false')
  t.throws(mc(true, []), TypeError, 'throws when first arg is true')
  t.throws(mc({}, []), TypeError, 'throws when first arg is an object')
  t.throws(mc([], []), TypeError, 'throws when first arg is an array')

  t.throws(mc(Last, undefined), TypeError, 'throws when second arg is undefined')
  t.throws(mc(Last, null), TypeError, 'throws when second arg is null')
  t.throws(mc(Last, 0), TypeError, 'throws when second arg is falsey number')
  t.throws(mc(Last, 1), TypeError, 'throws when second arg is truthy number')
  t.throws(mc(Last, ''), TypeError, 'throws when second arg is falsey string')
  t.throws(mc(Last, 'string'), TypeError, 'throws when second arg is truthy string')
  t.throws(mc(Last, false), TypeError, 'throws when second arg is false')
  t.throws(mc(Last, true), TypeError, 'throws when second arg is true')
  t.throws(mc(Last, {}), TypeError, 'throws when second arg is an object')

  t.doesNotThrow(mc(Last, [ 1, 2, 3 ]), 'allows a populated array as second argument')

  const nothing = mconcat(Last, [])
  const something = mconcat(Last, [ 1, 2, 3 ])

  t.equal(nothing.value(), Last.empty().value(), 'returns the empty value when passed an empty array')
  t.equal(something.value(), 3, 'returns the last value by lifting and calling concat on each')

  t.end()
})
