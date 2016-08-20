const test    = require('tape')
const sinon   = require('sinon')
const helpers = require('../test/helpers')

const constant      = require('../combinators/constant')
const identity      = require('../combinators/identity')
const composeB      = require('../combinators/composeB')
const reverseApply  = require('../combinators/reverseApply')

const isObject    = require('../internal/isObject')
const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const Last = require('../test/LastMonoid')

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

test('List filter errors', t => {
  const filter = bindFunc(List([ 0 ]).filter)

  t.throws(filter(undefined), TypeError, 'throws when passed undefined')
  t.throws(filter(null), TypeError, 'throws when passed null')
  t.throws(filter(0), TypeError, 'throws when passed a falsey number')
  t.throws(filter(1), TypeError, 'throws when passed a truthy number')
  t.throws(filter(''), TypeError, 'throws when passed a falsey string')
  t.throws(filter('string'), TypeError, 'throws when passed a truthy string')
  t.throws(filter(false), TypeError, 'throws when passed false')
  t.throws(filter(true), TypeError, 'throws when passed true')
  t.throws(filter(null), TypeError, 'throws when passed null')
  t.throws(filter(undefined), TypeError, 'throws when passed undefined')
  t.throws(filter([]), TypeError, 'throws when passed an array')
  t.throws(filter({}), TypeError, 'throws when passed an object')

  t.doesNotThrow(filter(noop), 'does not throw when passed a function')

  t.end()
})

test('List filter functionality', t => {
  const m = List([ 4, 5, 10, 34, 'string' ])

  const bigNum      = x => typeof x === 'number' && x > 10
  const justStrings = x => typeof x === 'string'

  t.same(m.filter(bigNum).value(), [ 34 ], 'filters for bigNums')
  t.same(m.filter(justStrings).value(), [ 'string' ], 'filters for strings')

  t.end()
})

test('List map errors', t => {
  const map = bindFunc(List([]).map)

  t.throws(map(undefined), TypeError, 'throws with undefined')
  t.throws(map(null), TypeError, 'throws with null')
  t.throws(map(0), TypeError, 'throws with falsey number')
  t.throws(map(1), TypeError, 'throws with truthy number')
  t.throws(map(''), TypeError, 'throws with falsey string')
  t.throws(map('string'), TypeError, 'throws with truthy string')
  t.throws(map(false), TypeError, 'throws with false')
  t.throws(map(true), TypeError, 'throws with true')
  t.throws(map([]), TypeError, 'throws with an array')
  t.throws(map({}), TypeError, 'throws with an object')

  t.doesNotThrow(map(noop))

  t.end()
})

test('List map functionality', t => {
  const spy = sinon.spy(identity)
  const xs  = [ 42 ]

  const m = List(xs).map(spy)

  t.equal(m.type(), 'List', 'returns a List')
  t.equal(spy.called, true, 'calls mapping function')
  t.same(m.value(), xs, 'returns the result of the map inside of new List')

  t.end()
})

test('List map properties (Functor)', t => {
  const m = List([ 49 ])

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.same(m.map(identity).value(), m.value(), 'identity')
  t.same(m.map(composeB(f, g)).value(), m.map(g).map(f).value(), 'composition')

  t.end()
})

test('List ap errors', t => {
  const ap = bindFunc(List([ noop ]).ap)

  t.throws(List([ undefined ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is undefined')
  t.throws(List([ null ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is null')
  t.throws(List([ 0 ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is a falsey number')
  t.throws(List([ 1 ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is a truthy number')
  t.throws(List([ '' ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is a falsey string')
  t.throws(List([ 'string' ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is a truthy string')
  t.throws(List([ false ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is false')
  t.throws(List([ true ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is true')
  t.throws(List([ [] ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is an array')
  t.throws(List([ {} ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped value is an object')
  t.throws(List([ noop, 'string' ]).ap.bind(null, List([ 0 ])), TypeError, 'throws when wrapped values are not all functions')


  t.throws(ap(undefined), TypeError, 'throws with undefined')
  t.throws(ap(null), TypeError, 'throws with null')
  t.throws(ap(0), TypeError, 'throws with falsey number')
  t.throws(ap(1), TypeError, 'throws with truthy number')
  t.throws(ap(''), TypeError, 'throws with falsey string')
  t.throws(ap('string'), TypeError, 'throws with truthy string')
  t.throws(ap(false), TypeError, 'throws with false')
  t.throws(ap(true), TypeError, 'throws with true')
  t.throws(ap([]), TypeError, 'throws with an array')
  t.throws(ap({}), TypeError, 'throws with an object')

  t.doesNotThrow(ap(List([ 45 ])), 'allows a List when functions are wrapped')

  t.end()
})

test('List ap properties (Apply)', t => {
  const m = List([ identity ])

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(List([]).ap), 'provides an ap function')
  t.ok(isFunction(List([]).map), 'implements the Functor spec')

  t.same(a.ap(List([ 3 ])).value(), b.ap(List([ 3 ])).value(), 'composition')

  t.end()
})

test('List of', t => {
  t.equal(List.of, List([]).of, 'List.of is the same as the instance version')
  t.equal(List.of(0).type(), 'List', 'returns an Identity')
  t.same(List.of(0).value(), [ 0 ], 'wraps the value passed into List into an array')

  t.end()
})

test('List of properties (Applicative)', t => {
  const m = List([ identity ])

  t.ok(isFunction(List([]).of), 'provides an of function')
  t.ok(isFunction(List([]).ap), 'implements the Apply spec')

  t.same(m.ap(List([3])).value(), [ 3 ], 'identity')
  t.same(m.ap(List.of(3)).value(), List.of(identity(3)).value(), 'homomorphism')

  const a = x => m.ap(List.of(x))
  const b = x => List.of(reverseApply(x)).ap(m)

  t.same(a(3).value(), b(3).value(), 'interchange')

  t.end()
})

test('List chain errors', t => {
  const chain = bindFunc(List([ 0 ]).chain)
  const f = x => List.of(x)

  t.throws(chain(undefined), TypeError, 'throws when passed undefined')
  t.throws(chain(null), TypeError, 'throws when passed null')
  t.throws(chain(0), TypeError, 'throws when passed a falsey number')
  t.throws(chain(1), TypeError, 'throws when passed a truthy number')
  t.throws(chain(''), TypeError, 'throws when passed a falsey string')
  t.throws(chain('string'), TypeError, 'throws when passed a truthy string')
  t.throws(chain(false), TypeError, 'throws when passed false')
  t.throws(chain(true), TypeError, 'throws when passed true')
  t.throws(chain(null), TypeError, 'throws when passed null')
  t.throws(chain(undefined), TypeError, 'throws when passed undefined')
  t.throws(chain([]), TypeError, 'throws when passed an array')
  t.throws(chain({}), TypeError, 'throws when passed an object')

  t.doesNotThrow(chain(f), 'does not throw when passed a function')

  t.end()
})

test('List chain properties (Chain)', t => {
  t.ok(isFunction(List([]).chain), 'provides a chain function')
  t.ok(isFunction(List([]).ap), 'implements the Apply spec')

  const f = x => List.of(x + 2)
  const g = x => List.of(x + 10)

  const a = x => List.of(x).chain(f).chain(g)
  const b = x => List.of(x).chain(y => f(y).chain(g))

  t.same(a(10).value(), b(10).value(), 'assosiativity')

  t.end()
})

test('List chain properties (Monad)', t => {
  t.ok(isFunction(List([]).chain), 'implements the Chain spec')
  t.ok(isFunction(List([]).of), 'implements the Applicative spec')

  const f = x => List([ x ])

  t.same(List.of(3).chain(f).value(), f(3).value(), 'left identity')
  t.same(f(3).chain(List.of).value(), f(3).value(), 'right identity')

  t.end()
})
