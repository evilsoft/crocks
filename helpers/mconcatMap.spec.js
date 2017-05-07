const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc
const noop = helpers.noop

const isFunction = require('../predicates/isFunction')

const Last = require('../test/LastMonoid')

const mconcatMap = require('./mconcatMap')

test('mconcatMap', t => {
  const mc = bindFunc(mconcatMap)

  t.ok(isFunction(mconcatMap), 'is a function')

  t.throws(mc(undefined, noop, []), TypeError, 'throws when first arg is undefined')
  t.throws(mc(null, noop, []), TypeError, 'throws when first arg is null')
  t.throws(mc(0, noop, []), TypeError, 'throws when first arg is falsey number')
  t.throws(mc(1, noop, []), TypeError, 'throws when first arg is truthy number')
  t.throws(mc('', noop, []), TypeError, 'throws when first arg is falsey string')
  t.throws(mc('string', noop, []), TypeError, 'throws when first arg is truthy string')
  t.throws(mc(false, noop, []), TypeError, 'throws when first arg is false')
  t.throws(mc(true, noop, []), TypeError, 'throws when first arg is true')
  t.throws(mc({}, noop, []), TypeError, 'throws when first arg is an object')
  t.throws(mc([], noop, []), TypeError, 'throws when first arg is an array')

  t.throws(mc(Last, undefined, []), TypeError, 'throws when second arg is undefined')
  t.throws(mc(Last, null, []), TypeError, 'throws when second arg is null')
  t.throws(mc(Last, 0, []), TypeError, 'throws when second arg is falsey number')
  t.throws(mc(Last, 1, []), TypeError, 'throws when second arg is truthy number')
  t.throws(mc(Last, '', []), TypeError, 'throws when second arg is falsey string')
  t.throws(mc(Last, 'string', []), TypeError, 'throws when second arg is truthy string')
  t.throws(mc(Last, false, []), TypeError, 'throws when second arg is false')
  t.throws(mc(Last, true, []), TypeError, 'throws when second arg is true')
  t.throws(mc(Last, {}, []), TypeError, 'throws when second arg is an object')
  t.throws(mc(Last, [], []), TypeError, 'throws when second arg is an array')

  t.throws(mc(Last, noop, undefined), TypeError, 'throws when third arg is undefined')
  t.throws(mc(Last, noop, null), TypeError, 'throws when third arg is null')
  t.throws(mc(Last, noop, 0), TypeError, 'throws when arg third is falsey number')
  t.throws(mc(Last, noop, 1), TypeError, 'throws when arg third is truthy number')
  t.throws(mc(Last, noop, ''), TypeError, 'throws when arg third is falsey string')
  t.throws(mc(Last, noop, 'string'), TypeError, 'throws when third arg is truthy string')
  t.throws(mc(Last, noop, false), TypeError, 'throws when third arg is false')
  t.throws(mc(Last, noop, true), TypeError, 'throws when third arg is true')
  t.throws(mc(Last, noop, {}), TypeError, 'throws when third arg is an object')

  t.doesNotThrow(mc(Last, noop, [ 1, 2, 3 ]), 'allows a populated array as second argument')

  const addOne = x => x + 1
  const nothing = mconcatMap(Last, addOne, [])
  const something = mconcatMap(Last, addOne, [ 1, 2, 3 ])

  t.equal(nothing.value(), Last.empty().value(), 'returns the empty value when passed an empty array')
  t.equal(something.value(), 4, 'returns the last value by lifting and calling concat on each after running through map function')

  t.end()
})
