const test    = require('tape')
const helpers = require('../test/helpers')

const constant  = require('../combinators/constant')

const isObject    = require('../internal/isObject')
const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const List = require('./List')

test('List', t => {
  const m = bindFunc(List)

  t.ok(isFunction(List), 'is a function')
  t.ok(isObject(List([])), 'returns an object')

  t.ok(isFunction(List.of), 'provides an of function')
  t.ok(isFunction(List.type), 'provides a type function')

  t.equals(List.type, List([]).type, 'static type function matches instance type function')

  t.throws(List, TypeError, 'throws when no parameters are passed')
  t.throws(m(undefined), TypeError, 'throws with undefined')
  t.throws(m(null), TypeError, 'throws with null')
  t.throws(m(0), TypeError, 'throws with falsey number')
  t.throws(m(1), TypeError, 'throws with truthy number')
  t.throws(m(''), TypeError, 'throws with falsey string')
  t.throws(m('string'), TypeError, 'throws with truthy string')
  t.throws(m(false), TypeError, 'throws with false')
  t.throws(m(true), TypeError, 'throws with true')
  t.throws(m({}), TypeError, 'throws with an object')
  t.doesNotThrow(m([]), TypeError, 'allows an array')

  t.end()
})

test('List inspect', t => {
  const m = List([ 1, true, 'string' ])

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect(), "List [ 1, true, string ]", 'returns inspect string')

  t.end()
})

test('List type', t => {
  t.equal(List([]).type(), 'List', 'returns List')
  t.end()
})

test('List value', t => {
  const x = List([ 'some-thing', 34 ]).value()

  t.same(x, [ 'some-thing', 34 ], 'proivdes the wrapped array')

  t.end()
})

test('List equals functionality', t => {
  const a = List([ 'a', 'b' ])
  const b = List([ 'a', 'b' ])
  const c = List([ '1', 'b' ])

  const value = 'yep'
  const nonList = { type: 'List...Not' }

  t.equals(a.equals(c), false, 'returns false when 2 Lists are not equal')
  t.equals(a.equals(b), true, 'returns true when 2 Lists are equal')
  t.equals(a.equals(value), false, 'returns false when passed a simple value')
  t.equals(a.equals(nonList), false, 'returns false when passed a non-List')

  t.end()
})

test('List equals properties (Setoid)', t => {
  const a = List([ 0, 'like' ])
  const b = List([ 0, 'like' ])
  const c = List([ 1, 'rainbow' ])
  const d = List([ 'like', 0 ])

  t.ok(isFunction(List([]).equals), 'provides an equals function')

  t.equals(a.equals(a), true, 'reflexivity')
  t.equals(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equals(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equals(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('List concat properties (Semigoup)', t => {
  const a = List([ 1, '' ])
  const b = List([ 0, null ])
  const c = List([ true, 'string' ])

  const left  = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.same(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns a List')

  t.end()
})

test('List concat functionality', t => {
  const a = List([ 1, 2 ])
  const b = List([ 3, 4 ])

  const notList = { type: constant('List...Not') }

  const cat = bindFunc(a.concat)

  t.throws(cat(undefined), TypeError, 'throws when passed undefined')
  t.throws(cat(null), TypeError, 'throws when passed null')
  t.throws(cat(0), TypeError, 'throws when passed falsey number')
  t.throws(cat(1), TypeError, 'throws when passed truthy number')
  t.throws(cat(''), TypeError, 'throws when passed falsey string')
  t.throws(cat('string'), TypeError, 'throws when passed truthy string')
  t.throws(cat(false), TypeError, 'throws when passed false')
  t.throws(cat(true), TypeError, 'throws when passed true')
  t.throws(cat([]), TypeError, 'throws when passed array')
  t.throws(cat({}), TypeError, 'throws when passed object')
  t.throws(cat(notList), TypeError, 'throws when passed non-List')

  t.same(a.concat(b).value(), [ 1, 2, 3, 4 ], 'concats second to first')
  t.same(b.concat(a).value(), [ 3, 4, 1, 2 ], 'concats first to second')

  t.end()
})

test('List empty properties (Monoid)', t => {
  const m = List([ 1, 2 ])

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left  = m.empty().concat(m)

  t.same(right.value(), m.value(), 'right identity')
  t.same(left.value(), m.value(), 'left identity')

  t.end()
})

test('List empty functionality', t => {
  const x = List([ 0, 1, true ]).empty()

  t.equal(x.type(), 'List', 'provides a List')
  t.same(x.value(), [], 'provides an empty array')

  t.end()
})

test('List reduce errors', t => {
  const reduce = bindFunc(List([ 1, 2 ]).reduce)

  t.throws(reduce(undefined, 0), TypeError, 'throws with undefined in the first argument')
  t.throws(reduce(null, 0), TypeError, 'throws with null in the first argument')
  t.throws(reduce(0, 0), TypeError, 'throws with falsey number in the first argument')
  t.throws(reduce(1, 0), TypeError, 'throws with truthy number in the first argument')
  t.throws(reduce('', 0), TypeError, 'throws with falsey string in the first argument')
  t.throws(reduce('string', 0), TypeError, 'throws with truthy string in the first argument')
  t.throws(reduce(false, 0), TypeError, 'throws with false in the first argument')
  t.throws(reduce(true, 0), TypeError, 'throws with true in the first argument')
  t.throws(reduce({}, 0), TypeError, 'throws with an object in the first argument')
  t.throws(reduce([], 0), TypeError, 'throws with an array in the first argument')

  t.doesNotThrow(reduce(noop, 0), TypeError, 'allows function in the first argument')

  t.end()
})

test('List reduce functionality', t => {
  const f = (y, x) => y + x
  const m = List([ 1, 2, 3 ])

  t.equal(m.reduce(f, 0), 6, 'reduces as expected with a neutral initial value')
  t.equal(m.reduce(f, 10), 16, 'reduces as expected with a non-neutral initial value')

  t.end()
})
