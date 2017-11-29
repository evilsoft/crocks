const test = require('tape')

const isFunction = require('./isFunction')

const type = require('./type')

const adt = { type: () => 'Type' }
const fn = x => x

test('type', t => {
  t.ok(isFunction(type, 'is a function'))

  t.equals(type(9), 'Number', 'returns Number for a Number')
  t.equals(type(true), 'Boolean', 'returns Boolean for a Boolean')
  t.equals(type('nice'), 'String', 'returns String for a String')
  t.equals(type([]), 'Array', 'returns Array for an Array')
  t.equals(type({}), 'Object', 'returns Object for an Object')
  t.equals(type(null), 'Null', 'returns Null for null')
  t.equals(type(undefined), 'Undefined', 'returns Undefined for undefined')
  t.equals(type(adt), 'Type', 'returns the result of calling type on an adt')
  t.equals(type(fn), 'Function', 'returns Function for a function')

  t.end()
})
