const test = require('tape')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Last = require('../test/LastMonoid')
const isFunction = require('./core/isFunction')
const unit = require('./core/unit')

const mreduceMap = require('./mreduceMap')

test('mreduceMap helper', t => {
  const mc = bindFunc(mreduceMap)

  t.ok(isFunction(mreduceMap), 'is a function')

  t.throws(mc(undefined, unit, []), TypeError, 'throws when first arg is undefined')
  t.throws(mc(null, unit, []), TypeError, 'throws when first arg is null')
  t.throws(mc(0, unit, []), TypeError, 'throws when first arg is falsey number')
  t.throws(mc(1, unit, []), TypeError, 'throws when first arg is truthy number')
  t.throws(mc('', unit, []), TypeError, 'throws when first arg is falsey string')
  t.throws(mc('string', unit, []), TypeError, 'throws when first arg is truthy string')
  t.throws(mc(false, unit, []), TypeError, 'throws when first arg is false')
  t.throws(mc(true, unit, []), TypeError, 'throws when first arg is true')
  t.throws(mc({}, unit, []), TypeError, 'throws when first arg is an object')
  t.throws(mc([], unit, []), TypeError, 'throws when first arg is an array')

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

  t.throws(mc(Last, unit, undefined), TypeError, 'throws when third arg is undefined')
  t.throws(mc(Last, unit, null), TypeError, 'throws when third arg is null')
  t.throws(mc(Last, unit, 0), TypeError, 'throws when arg third is falsey number')
  t.throws(mc(Last, unit, 1), TypeError, 'throws when arg third is truthy number')
  t.throws(mc(Last, unit, ''), TypeError, 'throws when arg third is falsey string')
  t.throws(mc(Last, unit, 'string'), TypeError, 'throws when third arg is truthy string')
  t.throws(mc(Last, unit, false), TypeError, 'throws when third arg is false')
  t.throws(mc(Last, unit, true), TypeError, 'throws when third arg is true')
  t.throws(mc(Last, unit, {}), TypeError, 'throws when third arg is an object')

  t.doesNotThrow(mc(Last, unit, [ 1, 2, 3 ]), 'allows a populated array as second argument')

  const addOne = x => x + 1
  const nothing = mreduceMap(Last, addOne, [])
  const something = mreduceMap(Last, addOne, [ 1, 2, 3 ])

  t.equal(nothing, Last.empty().value(), 'returns the empty value when passed an empty array')
  t.equal(something, 4, 'returns the last value by lifting and calling concat on each after running through map function')

  t.end()
})
