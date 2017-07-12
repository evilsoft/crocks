const test = require('tape')
const Last = require('../../test/LastMonoid')
const helpers = require('../../test/helpers')

const bindFunc = helpers.bindFunc

const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const mconcatMap = require('./mconcatMap')

test('mconcatMap helper', t => {
  const mc = bindFunc(mconcatMap)

  t.ok(isFunction(mconcatMap), 'is a function')

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

  t.doesNotThrow(mc(Last, unit, []), 'does not throw with Monoid, function and foldable')

  t.end()
})
