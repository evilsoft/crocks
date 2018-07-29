import test from 'tape'

import isFunction from './isFunction'

const identity = x => x

import isDate from './isDate'

test('isDate core', t => {
  t.ok(isFunction(isDate))

  t.equal(isDate(undefined), false, 'returns false for undefined')
  t.equal(isDate(null), false, 'returns false for null')
  t.equal(isDate(0), false, 'returns false for falsey number')
  t.equal(isDate(1), false, 'returns false for truthy number')
  t.equal(isDate(false), false, 'returns false for false')
  t.equal(isDate(true), false, 'returns false for true')
  t.equal(isDate({}), false, 'returns false for an object')
  t.equal(isDate([]), false, 'returns false for an array')
  t.equal(isDate(identity), false, 'returns false for function')

  t.equal(isDate(new Date(undefined)), false, 'returns false for invalid date')

  t.equal(isDate(new Date()), true, 'returns true for new Date')
  t.equal(isDate(new Date('2018/12')), true, 'returns true from parsed date')

  t.end()
})
