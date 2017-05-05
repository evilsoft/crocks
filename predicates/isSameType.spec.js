const test = require('tape')
const helpers = require('../test/helpers')

const isFunction = require('./isFunction')
const noop = helpers.noop

const isSameType = require('./isSameType')

test('isSameType predicate function', t => {
  t.ok(isFunction(isSameType), 'is a function')

  t.end()
})

test('isSameType (ADTs)', t => {
  const first = { type: () => 'first' }
  const second = { type: () => 'second' }

  t.equal(isSameType(first, first), true, 'reports true when they are the same')
  t.equal(isSameType(first, second), false, 'reports false when they are the different containers')
  t.equal(isSameType(first, []), false, 'reports false when one is not a container')

  t.end()
})

test('isSameType (Nils)', t => {
  t.equal(isSameType(undefined, undefined), true, 'reports true when both are undefined')
  t.equal(isSameType(null, null), true, 'reports true when both are null')

  t.equal(isSameType(undefined, null), false, 'reports false with undefined and null')
  t.equal(isSameType(undefined, 0), false, 'reports false with undefined and falsey number')
  t.equal(isSameType(undefined, 1), false, 'reports false with undefined and truthy number')
  t.equal(isSameType(undefined, ''), false, 'reports false with undefined and falsey string')
  t.equal(isSameType(undefined, 'string'), false, 'reports false with undefined and truthy string')
  t.equal(isSameType(undefined, false), false, 'reports false with undefined and false')
  t.equal(isSameType(undefined, true), false, 'reports false with undefined and true')
  t.equal(isSameType(undefined, []), false, 'reports false with undefined and array')
  t.equal(isSameType(undefined, {}), false, 'reports false with undefined and an object')
  t.equal(isSameType(undefined, noop), false, 'reports false with undefined and a function')

  t.equal(isSameType(null, undefined), false, 'reports false with null and undefined')
  t.equal(isSameType(0, undefined), false, 'reports false with falsey number and undefined')
  t.equal(isSameType(1, undefined), false, 'reports false with truthy number and undefined')
  t.equal(isSameType('', undefined), false, 'reports false with falsey string and undefined')
  t.equal(isSameType('string', undefined), false, 'reports false with truthy string and undefined')
  t.equal(isSameType(false, undefined), false, 'reports false with false and undefined')
  t.equal(isSameType(true, undefined), false, 'reports false with true and undefined')
  t.equal(isSameType([], undefined), false, 'reports false with array and undefined')
  t.equal(isSameType({}, undefined), false, 'reports false with an object and undefined')
  t.equal(isSameType(noop, undefined), false, 'reports false with a function and undefined')

  t.equal(isSameType(null, undefined), false, 'reports false null and undefined')
  t.equal(isSameType(null, 0), false, 'reports false with null and falsey number')
  t.equal(isSameType(null, 1), false, 'reports false with null and truthy number')
  t.equal(isSameType(null, ''), false, 'reports false with null and falsey string')
  t.equal(isSameType(null, 'string'), false, 'reports false with null and truthy string')
  t.equal(isSameType(null, false), false, 'reports false with null and false')
  t.equal(isSameType(null, true), false, 'reports false with null and true')
  t.equal(isSameType(null, []), false, 'reports false with null and array')
  t.equal(isSameType(null, {}), false, 'reports false with null and an object')
  t.equal(isSameType(null, noop), false, 'reports false with null and a function')

  t.equal(isSameType(null, undefined), false, 'reports false undefined and null')
  t.equal(isSameType(0, null), false, 'reports false with falsey number and null')
  t.equal(isSameType(1, null), false, 'reports false with truthy number and null')
  t.equal(isSameType('', null), false, 'reports false with falsey string and null')
  t.equal(isSameType('string', null), false, 'reports false with truthy string and null')
  t.equal(isSameType(false, null), false, 'reports false with false and null')
  t.equal(isSameType(true, null), false, 'reports false with true and null')
  t.equal(isSameType([], null), false, 'reports false with array and null')
  t.equal(isSameType({}, null), false, 'reports false with an object and null')
  t.equal(isSameType(noop, null), false, 'reports false with a function and null')

  t.end()
})

test('isSameType (Numbers)', t => {
  t.equal(isSameType(Number, 0), true, 'reports true with Number and falsey number')
  t.equal(isSameType(Number, 1), true, 'reports true with Number and truthy number')
  t.equal(isSameType(0, Number), true, 'reports true with falsey number and Number')
  t.equal(isSameType(1, Number), true, 'reports true with truthy number and Number')

  t.equal(isSameType(0, 1), true, 'reports true with falsey number and truthy number')
  t.equal(isSameType(1, 0), true, 'reports true with truthy number and falsey number')

  t.equal(isSameType(Number, ''), false, 'reports false with Number and falsey string')
  t.equal(isSameType(Number, 'string'), false, 'reports false with Number and truthy string')
  t.equal(isSameType(Number, false), false, 'reports false with Number and false')
  t.equal(isSameType(Number, true), false, 'reports false with Number and true')
  t.equal(isSameType(Number, {}), false, 'reports false with Number and object')
  t.equal(isSameType(Number, []), false, 'reports false with Number and array')

  t.equal(isSameType('', Number), false, 'reports false with falsey string and Number')
  t.equal(isSameType('string', Number), false, 'reports false with truthy string and Number')
  t.equal(isSameType(false, Number), false, 'reports false with false and Number')
  t.equal(isSameType(true, Number), false, 'reports false with true and Number')
  t.equal(isSameType({}, Number), false, 'reports false with object and Number')
  t.equal(isSameType([], Number), false, 'reports false with array and Number')

  t.equal(isSameType(0, ''), false, 'reports false with falsey number and falsey string')
  t.equal(isSameType(0, 'string'), false, 'reports false with falsey number and truthy string')
  t.equal(isSameType(0, false), false, 'reports false with falsey number and false')
  t.equal(isSameType(0, true), false, 'reports false with falsey number and true')
  t.equal(isSameType(0, {}), false, 'reports false with falsey number and object')
  t.equal(isSameType(0, []), false, 'reports false with falsey number and array')
  t.equal(isSameType(0, noop), false, 'reports false with falsey number and function')

  t.equal(isSameType('', 0), false, 'reports false with falsey string and falsey number')
  t.equal(isSameType('string', 0), false, 'reports false with truthy string and falsey number')
  t.equal(isSameType(false, 0), false, 'reports false with false and falsey number')
  t.equal(isSameType(true, 0), false, 'reports false with true and falsey number')
  t.equal(isSameType({}, 0), false, 'reports false with object and falsey number')
  t.equal(isSameType([], 0), false, 'reports false with array and falsey number')
  t.equal(isSameType(noop, 0), false, 'reports false with function and falsey number')

  t.equal(isSameType(1, ''), false, 'reports false with truthy number and falsey string')
  t.equal(isSameType(1, 'string'), false, 'reports false with truthy number and truthy string')
  t.equal(isSameType(1, false), false, 'reports false with truthy number and false')
  t.equal(isSameType(1, true), false, 'reports false with truthy number and true')
  t.equal(isSameType(1, {}), false, 'reports false with truthy number and object')
  t.equal(isSameType(1, []), false, 'reports false with truthy number and array')
  t.equal(isSameType(1, noop), false, 'reports false with truthy number and function')

  t.equal(isSameType('', 1), false, 'reports false with falsey string and truthy number')
  t.equal(isSameType('string', 1), false, 'reports false with truthy string and truthy number')
  t.equal(isSameType(false, 1), false, 'reports false with false and truthy number')
  t.equal(isSameType(true, 1), false, 'reports false with true and truthy number')
  t.equal(isSameType({}, 1), false, 'reports false with object and truthy number')
  t.equal(isSameType([], 1), false, 'reports false with array and truthy number')
  t.equal(isSameType(noop, 1), false, 'reports false with function and truthy number')

  t.end()
})

test('isSameType (Strings)', t => {
  t.equal(isSameType(String, ''), true, 'reports true with String and falsey string')
  t.equal(isSameType(String, 'string'), true, 'reports true with String and truthy string')
  t.equal(isSameType('', String), true, 'reports true with falsey string and String')
  t.equal(isSameType('string', String), true, 'reports true with truthy string and String')

  t.equal(isSameType('', 'string'), true, 'reports true with falsey string and truthy string')
  t.equal(isSameType('string', ''), true, 'reports true with truthy string and falsey string')

  t.equal(isSameType(String, 0), false, 'reports false with String and falsey number')
  t.equal(isSameType(String, 1), false, 'reports false with String and truthy number')
  t.equal(isSameType(String, false), false, 'reports false with String and false')
  t.equal(isSameType(String, true), false, 'reports false with String and true')
  t.equal(isSameType(String, {}), false, 'reports false with String and object')
  t.equal(isSameType(String, []), false, 'reports false with String and array')

  t.equal(isSameType(0, String), false, 'reports false with falsey number and String')
  t.equal(isSameType(0, String), false, 'reports false with truthy number and String')
  t.equal(isSameType(false, String), false, 'reports false with false and String')
  t.equal(isSameType(true, String), false, 'reports false with true and String')
  t.equal(isSameType({}, String), false, 'reports false with object and String')
  t.equal(isSameType([], String), false, 'reports false with array and String')

  t.equal(isSameType('', false), false, 'reports false with falsey string and false')
  t.equal(isSameType('', true), false, 'reports false with falsey string and true')
  t.equal(isSameType('', {}), false, 'reports false with falsey string and object')
  t.equal(isSameType('', []), false, 'reports false with falsey string and array')
  t.equal(isSameType('', noop), false, 'reports false with falsey string and function')

  t.equal(isSameType(false, ''), false, 'reports false with false and falsey string')
  t.equal(isSameType(true, ''), false, 'reports false with true and falsey string')
  t.equal(isSameType({}, ''), false, 'reports false with object and falsey string')
  t.equal(isSameType([], ''), false, 'reports false with array and falsey string')
  t.equal(isSameType(noop, ''), false, 'reports false with function and falsey string')

  t.equal(isSameType('string', false), false, 'reports false with truthy string and false')
  t.equal(isSameType('string', true), false, 'reports false with truthy string and true')
  t.equal(isSameType('string', {}), false, 'reports false with truthy string and object')
  t.equal(isSameType('string', []), false, 'reports false with truthy string and array')
  t.equal(isSameType('string', noop), false, 'reports false with truthy string and function')

  t.equal(isSameType(false, 'string'), false, 'reports false with false and truthy string')
  t.equal(isSameType(true, 'string'), false, 'reports false with true and truthy string')
  t.equal(isSameType({}, 'string'), false, 'reports false with object and truthy string')
  t.equal(isSameType([], 'string'), false, 'reports false with array and truthy string')
  t.equal(isSameType(noop, 'string'), false, 'reports false with function and truthy string')

  t.end()
})

test('isSameType (Booleans)', t => {
  t.equal(isSameType(Boolean, false), true, 'reports true with Boolean and false')
  t.equal(isSameType(Boolean, true), true, 'reports true with Boolean and true')
  t.equal(isSameType(false, Boolean), true, 'reports true with false and Boolean')
  t.equal(isSameType(true, Boolean), true, 'reports true with true and Boolean')

  t.equal(isSameType(false, true), true, 'reports true with false and true')
  t.equal(isSameType(true, false), true, 'reports true with true and false')
  t.equal(isSameType(true, true), true, 'reports true with true and true')
  t.equal(isSameType(false, false), true, 'reports true with false and false')

  t.equal(isSameType(Boolean, 0), false, 'reports false with Boolean and falsey number')
  t.equal(isSameType(Boolean, 1), false, 'reports false with Boolean and truthy number')
  t.equal(isSameType(Boolean, ''), false, 'reports false with Boolean and falsey string')
  t.equal(isSameType(Boolean, 'string'), false, 'reports false with Boolean and truthy string')
  t.equal(isSameType(Boolean, {}), false, 'reports false with Boolean and object')
  t.equal(isSameType(Boolean, []), false, 'reports false with Boolean and array')

  t.equal(isSameType(0, Boolean), false, 'reports false with falsey number and Boolean')
  t.equal(isSameType(1, Boolean), false, 'reports false with truthy number and Boolean')
  t.equal(isSameType('', Boolean), false, 'reports false with falsey string and Boolean')
  t.equal(isSameType('string', Boolean), false, 'reports false with truthy string and Boolean')
  t.equal(isSameType({}, Boolean), false, 'reports false with object and Boolean')
  t.equal(isSameType([], Boolean), false, 'reports false with array and Boolean')

  t.equal(isSameType(false, {}), false, 'reports false with false string and object')
  t.equal(isSameType(false, []), false, 'reports false with false string and array')
  t.equal(isSameType(false, noop), false, 'reports false with false string and function')

  t.equal(isSameType({}, false), false, 'reports false with object and false string')
  t.equal(isSameType([], false), false, 'reports false with array and false string')
  t.equal(isSameType(noop, false), false, 'reports false with function and false string')

  t.equal(isSameType(true, {}), false, 'reports false with true and object')
  t.equal(isSameType(true, []), false, 'reports false with true and array')
  t.equal(isSameType(true, noop), false, 'reports false with true and function')

  t.equal(isSameType({}, true), false, 'reports false with object and true')
  t.equal(isSameType([], true), false, 'reports false with array and true')
  t.equal(isSameType(noop, true), false, 'reports false with function and true')

  t.end()
})

test('isSameType (Objects)', t => {
  t.equal(isSameType(Object, {}), true, 'reports true with Object and object')
  t.equal(isSameType({}, Object), true, 'reports true with object and Object')

  t.equal(isSameType({}, {}), true, 'reports true with object and object')

  t.equal(isSameType(Object, 0), false, 'reports false with Object and falsey number')
  t.equal(isSameType(Object, 1), false, 'reports false with Object and truthy number')
  t.equal(isSameType(Object, ''), false, 'reports false with Object and falsey string')
  t.equal(isSameType(Object, 'string'), false, 'reports false with Object and truthy string')
  t.equal(isSameType(Object, false), false, 'reports false with Object and false')
  t.equal(isSameType(Object, true), false, 'reports false with Object and true')
  t.equal(isSameType(Object, []), false, 'reports false with Object and array')

  t.equal(isSameType(0, Object), false, 'reports false with falsey number and Object')
  t.equal(isSameType(1, Object), false, 'reports false with truthy number and Object')
  t.equal(isSameType('', Object), false, 'reports false with falsey string and Object')
  t.equal(isSameType('string', Object), false, 'reports false with truthy string and Object')
  t.equal(isSameType(false, Object), false, 'reports false with false and Object')
  t.equal(isSameType(true, Object), false, 'reports false with true and Object')
  t.equal(isSameType([], Object), false, 'reports false with array and Object')

  t.equal(isSameType({}, []), false, 'reports false with object and array')
  t.equal(isSameType({}, noop), false, 'reports false with object and function')

  t.equal(isSameType([], {}), false, 'reports false with array and object')
  t.equal(isSameType(noop, {}), false, 'reports false with noop and object')

  t.end()
})

test('isSameType (Arrays)', t => {
  t.equal(isSameType(Array, []), true, 'reports true with Array and array')
  t.equal(isSameType([], Array), true, 'reports true with array and Array')

  t.equal(isSameType([], []), true, 'reports true with array and array')

  t.equal(isSameType(Array, 0), false, 'reports false with Array and falsey number')
  t.equal(isSameType(Array, 1), false, 'reports false with Array and truthy number')
  t.equal(isSameType(Array, ''), false, 'reports false with Array and falsey string')
  t.equal(isSameType(Array, 'string'), false, 'reports false with Array and truthy string')
  t.equal(isSameType(Array, false), false, 'reports false with Array and false')
  t.equal(isSameType(Array, true), false, 'reports false with Array and true')
  t.equal(isSameType(Array, {}), false, 'reports false with Array and object')

  t.equal(isSameType(0, Array), false, 'reports false with falsey number and Array')
  t.equal(isSameType(1, Array), false, 'reports false with truthy number and Array')
  t.equal(isSameType('', Array), false, 'reports false with falsey string and Array')
  t.equal(isSameType('string', Array), false, 'reports false with truthy string and Array')
  t.equal(isSameType(false, Array), false, 'reports false with false and Array')
  t.equal(isSameType(true, Array), false, 'reports false with true and Array')
  t.equal(isSameType({}, Array), false, 'reports false with object and Array')

  t.equal(isSameType(noop, []), false, 'reports false with function and array')
  t.equal(isSameType([], noop), false, 'reports false with array and function')

  t.end()
})

test('isSameType (Functions)', t => {
  t.equal(isSameType(Function, noop), true, 'reports true with Function and function')
  t.equal(isSameType(noop, Function), true, 'reports true with function and Function')

  t.equal(isSameType(noop, x => x), true, 'reports true with function and function')

  t.equal(isSameType(Function, 0), false, 'reports false with Function and falsey number')
  t.equal(isSameType(Function, 1), false, 'reports false with Function and truthy number')
  t.equal(isSameType(Function, ''), false, 'reports false with Function and falsey string')
  t.equal(isSameType(Function, 'string'), false, 'reports false with Function and truthy string')
  t.equal(isSameType(Function, false), false, 'reports false with Function and false')
  t.equal(isSameType(Function, true), false, 'reports false with Function and true')
  t.equal(isSameType(Function, {}), false, 'reports false with Function and object')
  t.equal(isSameType(Function, []), false, 'reports false with Function and array')

  t.equal(isSameType(0, Function), false, 'reports false with falsey number and Function')
  t.equal(isSameType(1, Function), false, 'reports false with truthy number and Function')
  t.equal(isSameType('', Function), false, 'reports false with falsey string and Function')
  t.equal(isSameType('string', Function), false, 'reports false with truthy string and Function')
  t.equal(isSameType(false, Function), false, 'reports false with false string and Function')
  t.equal(isSameType(true, Function), false, 'reports false with true and Function')
  t.equal(isSameType({}, Function), false, 'reports false with object and Function')
  t.equal(isSameType([], Function), false, 'reports false with array and Function')

  t.equal(isSameType(false, {}), false, 'reports false with false string and object')
  t.equal(isSameType(false, []), false, 'reports false with false string and array')

  t.equal(isSameType({}, false), false, 'reports false with object and false string')
  t.equal(isSameType([], false), false, 'reports false with array and false string')

  t.equal(isSameType(true, {}), false, 'reports false with true and object')
  t.equal(isSameType(true, []), false, 'reports false with true and array')

  t.equal(isSameType({}, true), false, 'reports false with object and true')
  t.equal(isSameType([], true), false, 'reports false with array and true')

  t.end()
})
