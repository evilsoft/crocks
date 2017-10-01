const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')
const MockCrock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const curry = require('./curry')
const _compose = curry(require('./compose'))
const isFunction = require('./isFunction')
const isObject = require('./isObject')
const unit = require('./_unit')

const Maybe = require('./Maybe')
const Pred = require('../Pred')

const constant = x => () => x
const identity = x => x

const reverseApply =
  x => fn => fn(x)

const List = require('./List')

test('List', t => {
  const f = x => List(x).toArray()

  t.ok(isFunction(List), 'is a function')
  t.ok(isObject(List([])), 'returns an object')

  t.ok(isFunction(List.of), 'provides an of function')
  t.ok(isFunction(List.fromArray), 'provides a fromArray function')
  t.ok(isFunction(List.type), 'provides a type function')

  const err = /List: List must wrap something/
  t.throws(List, err, 'throws with no parameters')

  t.same(f(undefined), [ undefined ], 'wraps value in array when called with undefined')
  t.same(f(null), [ null ], 'wraps value in array when called with null')
  t.same(f(0), [ 0 ], 'wraps value in array when called with falsey number')
  t.same(f(1), [ 1 ], 'wraps value in array when called with truthy number')
  t.same(f(''), [ '' ], 'wraps value in array when called with falsey string')
  t.same(f('string'), [ 'string' ], 'wraps value in array when called with truthy string')
  t.same(f(false), [ false ], 'wraps value in array when called with false')
  t.same(f(true), [ true ], 'wraps value in array when called with true')
  t.same(f({}), [ {} ], 'wraps value in array when called with an Object')
  t.same(f([ 1, 2, 3 ]), [ 1, 2, 3 ], 'Does not wrap an array, just uses it as the list')

  t.end()
})

test('List @@implements', t => {
  const f = List['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')
  t.equal(f('reduce'), true, 'implements reduce func')
  t.equal(f('traverse'), true, 'implements traverse func')

  t.end()
})

test('List fromArray', t => {
  const fromArray = bindFunc(List.fromArray)

  const err = /List.fromArray: Array required/
  t.throws(fromArray(undefined), err, 'throws with undefined')
  t.throws(fromArray(null), err, 'throws with null')
  t.throws(fromArray(0), err, 'throws with falsey number')
  t.throws(fromArray(1), err, 'throws with truthy number')
  t.throws(fromArray(''), err, 'throws with falsey string')
  t.throws(fromArray('string'), err, 'throws with truthy string')
  t.throws(fromArray(false), err, 'throws with false')
  t.throws(fromArray(true), err, 'throws with true')
  t.throws(fromArray({}), err, 'throws with an object')

  const data = [ [ 2, 1 ], 'a' ]

  t.equal(List.fromArray([ 0 ]).type(), 'List', 'returns a List')
  t.same(List.fromArray(data).value(), data, 'wraps the value passed into List in an array')

  t.end()
})

test('List inspect', t => {
  const m = List([ 1, true, 'string' ])

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect(), 'List [ 1, true, "string" ]', 'returns inspect string')

  t.end()
})

test('List type', t => {
  t.equal(List([]).type(), 'List', 'returns List')
  t.end()
})

test('List head', t => {
  const empty = List.empty()
  const one = List.of(1)
  const two = List([ 2, 3 ])

  t.ok(isFunction(two.head), 'Provides a head Function')

  t.equal(empty.head().type(), Maybe.type(), 'empty List returns a Maybe')
  t.equal(one.head().type(), Maybe.type(), 'one element List returns a Maybe')
  t.equal(two.head().type(), Maybe.type(), 'two element List returns a Maybe')

  t.equal(empty.head().option('Nothing'), 'Nothing', 'empty List returns a Nothing')
  t.equal(one.head().option('Nothing'), 1, 'one element List returns a `Just 1`')
  t.equal(two.head().option('Nothing'), 2, 'two element List returns a `Just 2`')

  t.end()
})

test('List tail', t => {
  const empty = List.empty()
  const one = List.of(1)
  const two = List([ 2, 3 ])
  const three = List([ 4, 5, 6 ])

  t.ok(isFunction(two.tail), 'Provides a tail Function')

  t.equal(empty.tail().type(), Maybe.type(), 'empty List returns a Maybe')
  t.equal(one.tail().type(), Maybe.type(), 'one element List returns a Maybe')
  t.equal(two.tail().type(), Maybe.type(), 'two element List returns a Maybe')
  t.equal(three.tail().type(), Maybe.type(), 'three element List returns a Maybe')

  t.equal(empty.tail().option('Nothing'), 'Nothing', 'empty List returns a Nothing')
  t.equal(one.tail().option('Nothing'), 'Nothing', 'one element List returns a `Just 1`')
  t.equal(two.tail().option('Nothing').type(), 'List', 'two element List returns a `Just List`')
  t.same(two.tail().option('Nothing').value(), [ 3 ], 'two element Maybe List contains  `[ 3 ]`')
  t.equal(three.tail().option('Nothing').type(), 'List', 'three element List returns a `Just List`')
  t.same(three.tail().option('Nothing').value(), [ 5, 6 ], 'three element Maybe List contains  `[ 5, 6 ]`')

  t.end()
})

test('List cons', t => {
  const list = List.of('guy')
  const consed = list.cons('hello')

  t.ok(isFunction(list.cons), 'provides a cons function')

  t.notSame(list.value(), consed.value(), 'keeps old list intact')
  t.same(consed.value(), [ 'hello', 'guy' ], 'returns a list with the element pushed to front')

  t.end()
})

test('List value', t => {
  const x = List([ 'some-thing', 34 ]).value()

  t.same(x, [ 'some-thing', 34 ], 'provides the wrapped array')

  t.end()
})

test('List toArray', t => {
  const data = [ 'some-thing', [ 'else', 43 ], 34 ]
  const a = List(data).toArray()

  t.same(a, data, 'provides the wrapped array')

  t.end()
})

test('List equals functionality', t => {
  const a = List([ 'a', 'b' ])
  const b = List([ 'a', 'b' ])
  const c = List([ '1', 'b' ])

  const value = 'yep'
  const nonList = { type: 'List...Not' }

  t.equal(a.equals(c), false, 'returns false when 2 Lists are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Lists are equal')
  t.equal(a.equals(value), false, 'returns false when passed a simple value')
  t.equal(a.equals(nonList), false, 'returns false when passed a non-List')

  t.end()
})

test('List equals properties (Setoid)', t => {
  const a = List([ 0, 'like' ])
  const b = List([ 0, 'like' ])
  const c = List([ 1, 'rainbow' ])
  const d = List([ 'like', 0 ])

  t.ok(isFunction(List([]).equals), 'provides an equals function')

  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('List concat properties (Semigroup)', t => {
  const a = List([ 1, '' ])
  const b = List([ 0, null ])
  const c = List([ true, 'string' ])

  const left = a.concat(b).concat(c)
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

  const err = /List.concat: List required/
  t.throws(cat(undefined), err, 'throws with undefined')
  t.throws(cat(null), err, 'throws with null')
  t.throws(cat(0), err, 'throws with falsey number')
  t.throws(cat(1), err, 'throws with truthy number')
  t.throws(cat(''), err, 'throws with falsey string')
  t.throws(cat('string'), err, 'throws with truthy string')
  t.throws(cat(false), err, 'throws with false')
  t.throws(cat(true), err, 'throws with true')
  t.throws(cat([]), err, 'throws with an array')
  t.throws(cat({}), err, 'throws with an object')
  t.throws(cat(notList), err, 'throws when passed non-List')

  t.same(a.concat(b).value(), [ 1, 2, 3, 4 ], 'concats second to first')
  t.same(b.concat(a).value(), [ 3, 4, 1, 2 ], 'concats first to second')

  t.end()
})

test('List empty properties (Monoid)', t => {
  const m = List([ 1, 2 ])

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

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

  const err = /List.reduce: Function required for first argument/
  t.throws(reduce(undefined, 0), err, 'throws with undefined in the first argument')
  t.throws(reduce(null, 0), err, 'throws with null in the first argument')
  t.throws(reduce(0, 0), err, 'throws with falsey number in the first argument')
  t.throws(reduce(1, 0), err, 'throws with truthy number in the first argument')
  t.throws(reduce('', 0), err, 'throws with falsey string in the first argument')
  t.throws(reduce('string', 0), err, 'throws with truthy string in the first argument')
  t.throws(reduce(false, 0), err, 'throws with false in the first argument')
  t.throws(reduce(true, 0), err, 'throws with true in the first argument')
  t.throws(reduce({}, 0), err, 'throws with an object in the first argument')
  t.throws(reduce([], 0), err, 'throws with an array in the first argument')

  t.end()
})

test('List reduce functionality', t => {
  const f = (y, x) => y + x
  const m = List([ 1, 2, 3 ])

  t.equal(m.reduce(f, 0), 6, 'reduces as expected with a neutral initial value')
  t.equal(m.reduce(f, 10), 16, 'reduces as expected with a non-neutral initial value')

  t.end()
})

test('List fold errors', t => {
  const f = bindFunc(x => List(x).fold())

  const noSemi = /List.fold: List must contain Semigroups of the same type/
  t.throws(f(undefined), noSemi, 'throws when contains single undefined')
  t.throws(f(null), noSemi, 'throws when contains single null')
  t.throws(f(0), noSemi, 'throws when contains single falsey number')
  t.throws(f(1), noSemi, 'throws when contains single truthy number')
  t.throws(f(false), noSemi, 'throws when contains single false')
  t.throws(f(true), noSemi, 'throws when contains single true')
  t.throws(f({}), noSemi, 'throws when contains a single object')
  t.throws(f(unit), noSemi, 'throws when contains a single function')

  const empty = /List.fold: List must contain at least one Semigroup/
  t.throws(f([]), empty, 'throws when empty')

  const diff = /List.fold: List must contain Semigroups of the same type/
  t.throws(f([ [], '' ]), diff, 'throws when empty')

  t.end()
})

test('List fold functionality', t => {
  const f = x => List(x).fold()

  t.same(f([ [ 1 ], [ 2 ] ]), [ 1, 2 ], 'combines and extracts semigroups')
  t.equals(f('lucky'), 'lucky', 'extracts a single semigroup')

  t.end()
})

test('List filter errors', t => {
  const filter = bindFunc(List([ 0 ]).filter)

  const err = /List.filter: Pred or predicate function required/
  t.throws(filter(undefined), err, 'throws with undefined')
  t.throws(filter(null), err, 'throws with null')
  t.throws(filter(0), err, 'throws with falsey number')
  t.throws(filter(1), err, 'throws with truthy number')
  t.throws(filter(''), err, 'throws with falsey string')
  t.throws(filter('string'), err, 'throws with truthy string')
  t.throws(filter(false), err, 'throws with false')
  t.throws(filter(true), err, 'throws with true')
  t.throws(filter([]), err, 'throws with an array')
  t.throws(filter({}), err, 'throws with an object')

  t.end()
})

test('List filter functionality', t => {
  const m = List([ 4, 5, 10, 34, 'string' ])

  const bigNum = x => typeof x === 'number' && x > 10
  const justStrings = x => typeof x === 'string'

  const bigNumPred = Pred(bigNum)
  const justStringsPred = Pred(justStrings)

  t.same(m.filter(bigNum).value(), [ 34 ], 'filters for bigNums with function')
  t.same(m.filter(justStrings).value(), [ 'string' ], 'filters for strings with function')

  t.same(m.filter(bigNumPred).value(), [ 34 ], 'filters for bigNums with Pred')
  t.same(m.filter(justStringsPred).value(), [ 'string' ], 'filters for strings with Pred')

  t.end()
})

test('List reject errors', t => {
  const reject = bindFunc(List([ 0 ]).reject)

  const err = /List.reject: Pred or predicate function required/
  t.throws(reject(undefined), err, 'throws with undefined')
  t.throws(reject(null), err, 'throws with null')
  t.throws(reject(0), err, 'throws with falsey number')
  t.throws(reject(1), err, 'throws with truthy number')
  t.throws(reject(''), err, 'throws with falsey string')
  t.throws(reject('string'), err, 'throws with truthy string')
  t.throws(reject(false), err, 'throws with false')
  t.throws(reject(true), err, 'throws with true')
  t.throws(reject([]), err, 'throws with an array')
  t.throws(reject({}), err, 'throws with an object')

  t.end()
})

test('List reject functionality', t => {
  const m = List([ 4, 5, 10, 34, 'string' ])

  const bigNum = x => typeof x === 'number' && x > 10
  const justStrings = x => typeof x === 'string'

  const bigNumPred = Pred(bigNum)
  const justStringsPred = Pred(justStrings)

  t.same(m.reject(bigNum).value(), [ 4, 5, 10, 'string' ], 'rejects bigNums with function')
  t.same(m.reject(justStrings).value(), [ 4, 5, 10, 34 ], 'rejects strings with function')

  t.same(m.reject(bigNumPred).value(), [ 4, 5, 10, 'string' ], 'rejects bigNums with Pred')
  t.same(m.reject(justStringsPred).value(), [ 4, 5, 10, 34 ], 'rejects strings with Pred')

  t.end()
})

test('List map errors', t => {
  const map = bindFunc(List([]).map)

  const err = /List.map: Function required/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws with an object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('List map functionality', t => {
  const spy = sinon.spy(identity)
  const xs = [ 42 ]

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
  t.same(m.map(_compose(f, g)).value(), m.map(g).map(f).value(), 'composition')

  t.end()
})

test('List ap errors', t => {
  const left = bindFunc(x => List([ x ]).ap(List([ 0 ])))

  const noFunc = /List.ap: Wrapped values must all be functions/
  t.throws(left([ undefined ]), noFunc, 'throws when wrapped value is undefined')
  t.throws(left([ null ]), noFunc, 'throws when wrapped value is null')
  t.throws(left([ 0 ]), noFunc, 'throws when wrapped value is a falsey number')
  t.throws(left([ 1 ]), noFunc, 'throws when wrapped value is a truthy number')
  t.throws(left([ '' ]), noFunc, 'throws when wrapped value is a falsey string')
  t.throws(left([ 'string' ]), noFunc, 'throws when wrapped value is a truthy string')
  t.throws(left([ false ]), noFunc, 'throws when wrapped value is false')
  t.throws(left([ true ]), noFunc, 'throws when wrapped value is true')
  t.throws(left([ [] ]), noFunc, 'throws when wrapped value is an array')
  t.throws(left([ {} ]), noFunc, 'throws when wrapped value is an object')
  t.throws(left([  unit, 'string' ]), noFunc, 'throws when wrapped values are not all functions')

  const ap = bindFunc(x => List([ unit ]).ap(x))

  const noList = /List.ap: List required/
  t.throws(ap(undefined), noList, 'throws with undefined')
  t.throws(ap(null), noList, 'throws with null')
  t.throws(ap(0), noList, 'throws with falsey number')
  t.throws(ap(1), noList, 'throws with truthy number')
  t.throws(ap(''), noList, 'throws with falsey string')
  t.throws(ap('string'), noList, 'throws with truthy string')
  t.throws(ap(false), noList, 'throws with false')
  t.throws(ap(true), noList, 'throws with true')
  t.throws(ap([]), noList, 'throws with an array')
  t.throws(ap({}), noList, 'throws with an object')

  t.end()
})

test('List ap properties (Apply)', t => {
  const m = List([ identity ])

  const a = m.map(_compose).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(List([]).ap), 'provides an ap function')
  t.ok(isFunction(List([]).map), 'implements the Functor spec')

  t.same(a.ap(List([ 3 ])).value(), b.ap(List([ 3 ])).value(), 'composition')

  t.end()
})

test('List of', t => {
  t.equal(List.of, List([]).of, 'List.of is the same as the instance version')
  t.equal(List.of(0).type(), 'List', 'returns a List')
  t.same(List.of(0).value(), [ 0 ], 'wraps the value passed into List in an array')

  t.end()
})

test('List of properties (Applicative)', t => {
  const m = List([ identity ])

  t.ok(isFunction(List([]).of), 'provides an of function')
  t.ok(isFunction(List([]).ap), 'implements the Apply spec')

  t.same(m.ap(List([ 3 ])).value(), [ 3 ], 'identity')
  t.same(m.ap(List.of(3)).value(), List.of(identity(3)).value(), 'homomorphism')

  const a = x => m.ap(List.of(x))
  const b = x => List.of(reverseApply(x)).ap(m)

  t.same(a(3).value(), b(3).value(), 'interchange')

  t.end()
})

test('List chain errors', t => {
  const chain = bindFunc(List([ 0 ]).chain)
  const bad = bindFunc(x => List.of(x).chain(identity))

  const noFunc = /List.chain: Function required/
  t.throws(chain(undefined), noFunc, 'throws with undefined')
  t.throws(chain(null), noFunc, 'throws with null')
  t.throws(chain(0), noFunc, 'throw with falsey number')
  t.throws(chain(1), noFunc, 'throws with truthy number')
  t.throws(chain(''), noFunc, 'throws with falsey string')
  t.throws(chain('string'), noFunc, 'throws with truthy string')
  t.throws(chain(false), noFunc, 'throws with false')
  t.throws(chain(true), noFunc, 'throws with true')
  t.throws(chain([]), noFunc, 'throws with an array')
  t.throws(chain({}), noFunc, 'throws with an object')

  const noList = /List.chain: Function must return a List/
  t.throws(bad(undefined), noList, 'throws when function returns undefined')
  t.throws(bad(null), noList, 'throws when function returns null')
  t.throws(bad(0), noList, 'throws when function returns falsey number')
  t.throws(bad(1), noList, 'throws when function returns truthy number')
  t.throws(bad(''), noList, 'throws when function returns falsey string')
  t.throws(bad('string'), noList, 'throws when function returns truthy string')
  t.throws(bad(false), noList, 'throws when function returns false')
  t.throws(bad(true), noList, 'throws when function returns true')
  t.throws(bad([]), noList, 'throws when function returns an array')
  t.throws(bad({}), noList, 'throws when function returns an object')
  t.throws(bad(unit), noList, 'throws when function returns a function')
  t.throws(bad(MockCrock), noList, 'throws when function a non-List ADT')

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

test('List sequence errors', t => {
  const seq = bindFunc(List.of(MockCrock(2)).sequence)
  const seqBad = bindFunc(List.of(0).sequence)

  const err = /List.sequence: Applicative Function required/
  t.throws(seq(undefined), err, 'throws with undefined')
  t.throws(seq(null), err, 'throws with null')
  t.throws(seq(0), err, 'throws falsey with number')
  t.throws(seq(1), err, 'throws truthy with number')
  t.throws(seq(''), err, 'throws falsey with string')
  t.throws(seq('string'), err, 'throws with truthy string')
  t.throws(seq(false), err, 'throws with false')
  t.throws(seq(true), err, 'throws with true')
  t.throws(seq([]), err, 'throws with an array')
  t.throws(seq({}), err, 'throws with an object')
  t.doesNotThrow(seq(MockCrock), 'allows an Applicative returning function')

  const noAppl = /List.sequence: Must wrap Applicatives/
  t.throws(seqBad(unit), noAppl, 'wrapping non-Applicative throws')

  t.end()
})

test('List sequence functionality', t => {
  const x = 'string'
  const m = List.of(MockCrock(x)).sequence(MockCrock.of)

  t.equal(m.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(m.value().type(), 'List', 'Provides an inner type of List')
  t.same(m.value().value(), [ x ], 'inner List contains original inner value')
  t.end()
})

test('List traverse errors', t => {
  const trav = bindFunc(List.of(2).traverse)

  const noFunc = /List.traverse: Applicative returning functions required for both arguments/
  t.throws(trav(undefined, MockCrock), noFunc, 'throws with undefined in first argument')
  t.throws(trav(null, MockCrock), noFunc, 'throws with null in first argument')
  t.throws(trav(0, MockCrock), noFunc, 'throws falsey with number in first argument')
  t.throws(trav(1, MockCrock), noFunc, 'throws truthy with number in first argument')
  t.throws(trav('', MockCrock), noFunc, 'throws falsey with string in first argument')
  t.throws(trav('string', MockCrock), noFunc, 'throws with truthy string in first argument')
  t.throws(trav(false, MockCrock), noFunc, 'throws with false in first argument')
  t.throws(trav(true, MockCrock), noFunc, 'throws with true in first argument')
  t.throws(trav([], MockCrock), noFunc, 'throws with an array in first argument')
  t.throws(trav({}, MockCrock), noFunc, 'throws with an object in first argument')

  t.throws(trav(MockCrock, undefined), noFunc, 'throws with undefined in second argument')
  t.throws(trav(MockCrock, null), noFunc, 'throws with null in second argument')
  t.throws(trav(MockCrock, 0), noFunc, 'throws falsey with number in second argument')
  t.throws(trav(MockCrock, 1), noFunc, 'throws truthy with number in second argument')
  t.throws(trav(MockCrock, ''), noFunc, 'throws falsey with string in second argument')
  t.throws(trav(MockCrock, 'string'), noFunc, 'throws with truthy string in second argument')
  t.throws(trav(MockCrock, false), noFunc, 'throws with false in second argument')
  t.throws(trav(MockCrock, true), noFunc, 'throws with true in second argument')
  t.throws(trav(MockCrock, []), noFunc, 'throws with an array in second argument')
  t.throws(trav(MockCrock, {}), noFunc, 'throws with an object in second argument')

  const noAppl = /List.traverse: Both functions must return an Applicative/
  t.throws(trav(unit, MockCrock), noAppl, 'throws with non-Appicative returning function in first argument')
  t.throws(trav(MockCrock, unit), noAppl, 'throws with non-Appicative returning function in second argument')

  t.doesNotThrow(trav(MockCrock, MockCrock), 'allows Applicative returning functions')

  t.end()
})

test('List traverse functionality', t => {
  const x = 'string'
  const f = x => MockCrock(x)
  const m = List.of(x).traverse(f, MockCrock.of)

  t.equal(m.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(m.value().type(), 'List', 'Provides an inner type of List')
  t.same(m.value().value(), [ x ], 'inner List contains original inner value')
  t.end()
})
