const test = require('tape')
const sinon = require('sinon')

const isFunction = require('./isFunction')
const equals = require('./equals')

test('equals', t => {
  t.ok(isFunction(equals), 'is a function')

  t.end()
})

test('equals primatives', t => {
  t.equals(equals(false, false), true, 'returns true when booleans are equal')
  t.equals(equals(false, true), false, 'returns false when booleans are not equal')

  t.equals(equals(0, 0), true, 'returns true when numbers are equal')
  t.equals(equals(34, 0), false, 'returns false when numbers are not equal')

  t.equals(equals('green', 'green'), true, 'returns true when strings are equal')
  t.equals(equals('purple', ''), false, 'returns false when strings are not equal')
  t.end()
})

test('equals adts', t => {
  const value = 'value'
  const spy = sinon.spy(() => value)

  const adt = () =>
    ({ type: () => 'ADT', equals: spy })

  const one = adt()
  const two = adt()
  const result = equals(one, two)

  t.ok(spy.calledWith(two), 'calls equals on first, passing in second')
  t.equals(result, value, 'returns the result of first equals')

  t.end()
})

test('equals Arrays', t => {
  const one = [ 1, 3, 10 ]
  const two = [ 1, 3, 10 ]
  const diff = [ 1, 3, 110 ]

  const nestedOne = [ 1, [ 3, 10 ] ]
  const nestedTwo = [ 1, [ 3, 10 ] ]
  const nestedDiff = [ [ 1, 4, 5 ] ]

  t.equals(equals(one, two), true, 'returns true when both arrays match')
  t.equals(equals(diff, two), false, 'returns false when both arrays do not match')

  t.equals(equals(nestedOne, nestedTwo), true, 'returns true when both nested arrays match')
  t.equals(equals(nestedDiff, nestedOne), false, 'returns false when both nested arrays do not match')

  t.end()
})

test('equals Dates', t => {
  const one = new Date(333)
  const two = new Date(333)
  const diff = new Date(34)

  t.equals(equals(one, two), true, 'returns true when dates match')
  t.equals(equals(diff, two), false, 'returns false when dates differ')

  const badOne = new Date('Soo Bad')
  const badTwo = new Date('Soo Bad Again')

  t.equals(equals(badOne, badTwo), true, 'returns true with 2 bad dates')

  t.end()
})

test('equals Errors', t => {
  const one = new Error('some error')
  const two = new Error('some error')
  const type = new TypeError('some error')
  const diff = new Error('another error')

  t.equals(equals(one, two), true, 'returns true when type and message match')
  t.equals(equals(type, two), false, 'returns false when type and message do not match')
  t.equals(equals(one, diff), false, 'returns false when messages do not match')

  t.end()
})

test('equals Objects', t => {
  const one = { nice: true, number: 45 }
  const two = { nice: true, number: 45 }
  const diff = { nice: false, number: 56 }

  const more = { nice: false, number: 45, color: 'blue' }
  const less = { nice: false }

  const nestedOne = { nice: true, obj: { string: 'great' } }
  const nestedTwo = { nice: true, obj: { string: 'great' } }
  const nestedDiff = { nice: true, obj: { string: 'sad' } }

  t.equals(equals(one, two), true, 'returns true when Objects match')
  t.equals(equals(one, diff), false, 'returns false when Objects values differ')

  t.equals(equals(nestedOne, nestedTwo), true, 'returns true when Objects nested values match')
  t.equals(equals(nestedTwo, nestedDiff), false, 'returns false when Objects nested values differ')

  t.equals(equals(one, more), false, 'returns false when an Object has more keys')
  t.equals(equals(less, two), false, 'returns false when an Object has less keys')

  t.end()
})

test('equals RegExp', t => {
  t.equals(equals(/.*/, /.*/), true, 'returns true when regexp match')
  t.equals(equals(/.*?/, /.*/), false, 'returns false when regexp do not match')

  t.equals(equals(/.*/i, /.*/i), true, 'returns true when regexp ignoreCase flags match')
  t.equals(equals(/.*/, /.*/i), false, 'returns false when regexp ignoreCase flags do not match')

  t.equals(equals(/.*/g, /.*/g), true, 'returns true when regexp global flags match')
  t.equals(equals(/.*/, /.*/g), false, 'returns false when regexp global flags do not match')

  t.equals(equals(/.*/m, /.*/m), true, 'returns true when regexp multilne flags match')
  t.equals(equals(/.*/, /.*/m), false, 'returns false when regexp multilne flags do not match')

  t.equals(equals(/.*/u, /.*/u), true, 'returns true when regexp unicode flags match')
  t.equals(equals(/.*/, /.*/u), false, 'returns false when regexp unicode flags do not match')

  t.end()
})

test('equals special cases', t => {
  t.equals(equals(NaN, NaN), true, 'returns true when NaNs are passed')

  t.equals(equals(undefined, undefined), true, 'returns true when undefineds are passed')
  t.equals(equals(null, null), true, 'returns true when undefineds are passed')

  t.equals(equals(undefined, NaN), false, 'returns false when NaN and undefined is passed')
  t.equals(equals(undefined, null), false, 'returns false when null and undefined is passed')

  t.end()
})
