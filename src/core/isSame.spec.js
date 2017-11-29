const test = require('tape')

const isFunction = require('./isFunction')

const isSame = require('./isSame')

test('isSame', t => {
  t.ok(isFunction(isSame), 'is a function')

  const obj = { value: 'yes' }
  const ar = [ 1 ]

  t.equals(isSame(obj, obj), true, 'retruns true for same object')
  t.equals(isSame(obj, { value: 'yes' }), false, 'retruns false for different objects')

  t.equals(isSame(ar, ar), true, 'retruns true for same array')
  t.equals(isSame(ar, [ 1 ]), false, 'retruns false for different arrays')

  t.equals(isSame('string', 'string'), true, 'retruns true for strings with same value')
  t.equals(isSame('', 'bubbles'), false, 'retruns false for strings with different values')

  t.equals(isSame(false, false), true, 'retruns true for booleans with same value')
  t.equals(isSame(true, false), false, 'retruns false for booleans with different values')

  t.equals(isSame(1, 1), true, 'retruns true for numbers with same value')
  t.equals(isSame(1, 0), false, 'retruns false for numbers with different values')
  t.equals(isSame(-0, 0), false, 'retruns false for neg zero and zero')
  t.equals(isSame(-0, -0), true, 'retruns true for neg zeros')
  t.equals(isSame(NaN, NaN), true, 'retruns true for two NaNs')

  t.end()
})
