import test from 'tape'

import isFunction from './isFunction'

const identity = x => x

import isSymbol from './isSymbol'

test('isSymbol core', t => {
  t.ok(isFunction(isSymbol))

  t.equal(isSymbol(undefined), false, 'returns false for undefined')
  t.equal(isSymbol(null), false, 'returns false for null')
  t.equal(isSymbol(0), false, 'returns false for falsey number')
  t.equal(isSymbol(1), false, 'returns false for truthy number')
  t.equal(isSymbol(false), false, 'returns false for false')
  t.equal(isSymbol(true), false, 'returns false for true')
  t.equal(isSymbol({}), false, 'returns false for an object')
  t.equal(isSymbol([]), false, 'returns false for an array')
  t.equal(isSymbol(identity), false, 'returns false for function')
  t.equal(isSymbol(Symbol), false, 'returns false for symbol constructor function')

  t.equal(isSymbol(Symbol()), true, 'returns true for empty symbol')
  t.equal(isSymbol(Symbol(42)), true, 'returns true for symbol with value')

  t.end()
})
