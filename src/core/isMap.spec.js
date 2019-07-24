const test = require('tape')

const isFunction  = require('./isFunction')
const unit = require('./_unit')

const isMap = require('./isMap')

test('isMap predicate function', t => {
  t.ok(isFunction(isMap), 'is a function')

  t.ok(isMap(new Map()), 'returns true when passed a Map')
  t.notOk(isMap([]), 'returns false when passed an array')
  t.notOk(isMap(unit), 'returns false when passed a function')
  t.notOk(isMap(undefined), 'returns false when passed undefined')
  t.notOk(isMap(null), 'returns false when passed null')
  t.notOk(isMap(0), 'returns false when passed a falsey number')
  t.notOk(isMap(1), 'returns false when passed a truthy number')
  t.notOk(isMap(''), 'returns false when passed a falsey string')
  t.notOk(isMap('string'), 'returns false when passed a truthy string')
  t.notOk(isMap(false), 'returns false when passed false')
  t.notOk(isMap(true), 'returns false when passed true')
  t.notOk(isMap({}), 'returns false when passed an object')

  t.end()
})
