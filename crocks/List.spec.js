const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')
const reverseApply = require('../combinators/reverseApply')

const noop = helpers.noop
const bindFunc = helpers.bindFunc

const isFunction = require('../predicates/isFunction')
const isObject = require('../predicates/isObject')

const MockCrock = require('../test/MockCrock')
const Maybe     = require('./Maybe')
const Pred      = require('./Pred')

const List = require('./List')

test('List', t => {
  const m = bindFunc(List)

  t.ok(isFunction(List), 'is a function')
  t.ok(isObject(List([])), 'returns an object')

  t.ok(isFunction(List.of), 'provides an of function')
  t.ok(isFunction(List.fromArray), 'provides a fromArray function')
  t.ok(isFunction(List.type), 'provides a type function')

  t.throws(List, TypeError, 'throws with no parameters')
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
  t.equal(m.inspect(), "List [ 1, true, \"string\" ]", 'returns inspect string')

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
  const a = List([ 'some-thing', ['else', 43], 34 ]).toArray()

  t.same(a, [ 'some-thing', ['else', 43], 34 ], 'provides the wrapped array')

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

  t.throws(cat(undefined), TypeError, 'throws with undefined')
  t.throws(cat(null), TypeError, 'throws with null')
  t.throws(cat(0), TypeError, 'throws with falsey number')
  t.throws(cat(1), TypeError, 'throws with truthy number')
  t.throws(cat(''), TypeError, 'throws with falsey string')
  t.throws(cat('string'), TypeError, 'throws with truthy string')
  t.throws(cat(false), TypeError, 'throws with false')
  t.throws(cat(true), TypeError, 'throws with true')
  t.throws(cat([]), TypeError, 'throws with an array')
  t.throws(cat({}), TypeError, 'throws with an object')
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

  t.throws(filter(undefined), TypeError, 'throws with undefined')
  t.throws(filter(null), TypeError, 'throws with null')
  t.throws(filter(0), TypeError, 'throws with falsey number')
  t.throws(filter(1), TypeError, 'throws with truthy number')
  t.throws(filter(''), TypeError, 'throws with falsey string')
  t.throws(filter('string'), TypeError, 'throws with truthy string')
  t.throws(filter(false), TypeError, 'throws with false')
  t.throws(filter(true), TypeError, 'throws with true')
  t.throws(filter([]), TypeError, 'throws with an array')
  t.throws(filter({}), TypeError, 'throws with an object')

  t.doesNotThrow(filter(noop), 'allows a function')
  t.doesNotThrow(filter(Pred(noop)), 'allows a Pred')

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

  t.doesNotThrow(map(noop), 'allows a function')

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
  t.equal(List.of(0).type(), 'List', 'returns a List')
  t.same(List.of(0).value(), [ 0 ], 'wraps the value passed into List in an array')

  t.end()
})

test('List fromArray', t => {
  const fromArray = bindFunc(List.fromArray)

  t.throws(fromArray(undefined), TypeError, 'throws with undefined')
  t.throws(fromArray(null), TypeError, 'throws with null')
  t.throws(fromArray(0), TypeError, 'throws with falsey number')
  t.throws(fromArray(1), TypeError, 'throws with truthy number')
  t.throws(fromArray(''), TypeError, 'throws with falsey string')
  t.throws(fromArray('string'), TypeError, 'throws with truthy string')
  t.throws(fromArray(false), TypeError, 'throws with false')
  t.throws(fromArray(true), TypeError, 'throws with true')
  t.throws(fromArray({}), TypeError, 'throws with an object')

  t.equal(List.fromArray([0]).type(), 'List', 'returns a List')
  t.same(List.fromArray([0]).value(), [ 0 ], 'wraps the value passed into List in an array')

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
  const bad = bindFunc(x => List.of(x).chain(identity))

  const f = x => List.of(x)

  t.throws(chain(undefined), TypeError, 'throws with undefined')
  t.throws(chain(null), TypeError, 'throws with null')
  t.throws(chain(0), TypeError, 'throw with falsey number')
  t.throws(chain(1), TypeError, 'throws with truthy number')
  t.throws(chain(''), TypeError, 'throws with falsey string')
  t.throws(chain('string'), TypeError, 'throws with truthy string')
  t.throws(chain(false), TypeError, 'throws with false')
  t.throws(chain(true), TypeError, 'throws with true')
  t.throws(chain([]), TypeError, 'throws with an array')
  t.throws(chain({}), TypeError, 'throws with an object')

  t.throws(bad(undefined), TypeError, 'throws when function returns undefined')
  t.throws(bad(null), TypeError, 'throws when function returns null')
  t.throws(bad(0), TypeError, 'throws when function returns falsey number')
  t.throws(bad(1), TypeError, 'throws when function returns truthy number')
  t.throws(bad(''), TypeError, 'throws when function returns falsey string')
  t.throws(bad('string'), TypeError, 'throws when function returns truthy string')
  t.throws(bad(false), TypeError, 'throws when function returns false')
  t.throws(bad(true), TypeError, 'throws when function returns true')
  t.throws(bad([]), TypeError, 'throws when function returns an array')
  t.throws(bad({}), TypeError, 'throws when function returns an object')
  t.throws(bad(noop), TypeError, 'throws when function returns a function')
  t.throws(bad(MockCrock), TypeError, 'throws when function a non-List ADT')

  t.doesNotThrow(chain(f), 'allows a function')

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

  t.throws(seq(undefined), TypeError, 'throws with undefined')
  t.throws(seq(null), TypeError, 'throws with null')
  t.throws(seq(0), TypeError, 'throws falsey with number')
  t.throws(seq(1), TypeError, 'throws truthy with number')
  t.throws(seq(''), TypeError, 'throws falsey with string')
  t.throws(seq('string'), TypeError, 'throws with truthy string')
  t.throws(seq(false), TypeError, 'throws with false')
  t.throws(seq(true), TypeError, 'throws with true')
  t.throws(seq([]), TypeError, 'throws with an array')
  t.throws(seq({}), TypeError, 'throws with an object')
  t.doesNotThrow(seq(MockCrock), 'allows an Applicative returning function')

  t.throws(seqBad(noop), TypeError, 'wrapping non-Applicative throws')

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

  t.throws(trav(undefined, MockCrock), TypeError, 'throws with undefined in first argument')
  t.throws(trav(null, MockCrock), TypeError, 'throws with null in first argument')
  t.throws(trav(0, MockCrock), TypeError, 'throws falsey with number in first argument')
  t.throws(trav(1, MockCrock), TypeError, 'throws truthy with number in first argument')
  t.throws(trav('', MockCrock), TypeError, 'throws falsey with string in first argument')
  t.throws(trav('string', MockCrock), TypeError, 'throws with truthy string in first argument')
  t.throws(trav(false, MockCrock), TypeError, 'throws with false in first argument')
  t.throws(trav(true, MockCrock), TypeError, 'throws with true in first argument')
  t.throws(trav([], MockCrock), TypeError, 'throws with an array in first argument')
  t.throws(trav({}, MockCrock), TypeError, 'throws with an object in first argument')
  t.throws(trav(noop, MockCrock), TypeError, 'throws with non-Appicative returning function in first argument')

  t.throws(trav(MockCrock, undefined), TypeError, 'throws with undefined in second argument')
  t.throws(trav(MockCrock, null), TypeError, 'throws with null in second argument')
  t.throws(trav(MockCrock, 0), TypeError, 'throws falsey with number in second argument')
  t.throws(trav(MockCrock, 1), TypeError, 'throws truthy with number in second argument')
  t.throws(trav(MockCrock, ''), TypeError, 'throws falsey with string in second argument')
  t.throws(trav(MockCrock, 'string'), TypeError, 'throws with truthy string in second argument')
  t.throws(trav(MockCrock, false), TypeError, 'throws with false in second argument')
  t.throws(trav(MockCrock, true), TypeError, 'throws with true in second argument')
  t.throws(trav(MockCrock, []), TypeError, 'throws with an array in second argument')
  t.throws(trav(MockCrock, {}), TypeError, 'throws with an object in second argument')
  t.throws(trav(MockCrock, noop), TypeError, 'throws with non-Appicative returning function in second argument')

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
