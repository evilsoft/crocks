const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')
const MockCrock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const curry = require('./curry')
const _compose = curry(require('./compose'))
const isFunction = require('./isFunction')
const isObject = require('./isObject')
const isSameType = require('./isSameType')
const isString = require('./isString')
const unit = require('./_unit')

const fl = require('./flNames')

const Maybe = require('./Maybe')
const Pred = require('./Pred')

const constant = x => () => x
const identity = x => x

const applyTo =
  x => fn => fn(x)

const List = require('./List')

test('List', t => {
  const f = x => List(x).toArray()

  t.ok(isFunction(List), 'is a function')
  t.ok(isObject(List([])), 'returns an object')

  t.equals(List([]).constructor, List, 'provides TypeRep on constructor')

  t.ok(isFunction(List.of), 'provides an of function')
  t.ok(isFunction(List.fromArray), 'provides a fromArray function')
  t.ok(isFunction(List.type), 'provides a type function')
  t.ok(isString(List['@@type']), 'provides a @@type string')

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

test('List fantasy-land api', t => {
  const m = List('value')

  t.ok(isFunction(List[fl.empty]), 'provides empty function on constructor')
  t.ok(isFunction(List[fl.of]), 'provides of function on constructor')

  t.ok(isFunction(m[fl.of]), 'provides of method on instance')
  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')
  t.ok(isFunction(m[fl.map]), 'provides map method on instance')
  t.ok(isFunction(m[fl.chain]), 'provides chain method on instance')
  t.ok(isFunction(m[fl.reduce]), 'provides reduce method on instance')
  t.ok(isFunction(m[fl.filter]), 'provides filter method on instance')

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

  t.ok(isSameType(List, List.fromArray([ 0 ])), 'returns a List')
  t.same(List.fromArray(data).valueOf(), data, 'wraps the value passed into List in an array')

  t.end()
})

test('List inspect', t => {
  const m = List([ 1, true, 'string' ])

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'List [ 1, true, "string" ]', 'returns inspect string')

  t.end()
})

test('List type', t => {
  const m = List([])

  t.ok(isFunction(m.type), 'is a function')

  t.equal(m.type, List.type, 'static and instance versions are the same')
  t.equal(m.type(), 'List', 'returns List')

  t.end()
})

test('List @@type', t => {
  const m = List([])

  t.equal(m['@@type'], List['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/List@4', 'returns crocks/List@4')

  t.end()
})

test('List head', t => {
  const empty = List.empty()
  const one = List.of(1)
  const two = List([ 2, 3 ])

  t.ok(isFunction(two.head), 'Provides a head Function')

  t.ok(isSameType(Maybe, empty.head()), 'empty List returns a Maybe')
  t.ok(isSameType(Maybe, one.head()), 'one element List returns a Maybe')
  t.ok(isSameType(Maybe, two.head()), 'two element List returns a Maybe')

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
  t.same(two.tail().option('Nothing').valueOf(), [ 3 ], 'two element Maybe List contains  `[ 3 ]`')
  t.equal(three.tail().option('Nothing').type(), 'List', 'three element List returns a `Just List`')
  t.same(three.tail().option('Nothing').valueOf(), [ 5, 6 ], 'three element Maybe List contains  `[ 5, 6 ]`')

  t.end()
})

test('List cons', t => {
  const list = List.of('guy')
  const consed = list.cons('hello')

  t.ok(isFunction(list.cons), 'provides a cons function')

  t.notSame(list.valueOf(), consed.valueOf(), 'keeps old list intact')
  t.same(consed.valueOf(), [ 'hello', 'guy' ], 'returns a list with the element pushed to front')

  t.end()
})

test('List valueOf', t => {
  const x = List([ 'some-thing', 34 ]).valueOf()

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
  t.same(left.valueOf(), right.valueOf(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns a List')

  t.end()
})

test('List concat errors', t => {
  const a = List([ 1, 2 ])

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

  t.end()
})

test('List concat fantasy-land errors', t => {
  const a = List([ 1, 2 ])

  const notList = { type: constant('List...Not') }

  const cat = bindFunc(a[fl.concat])

  const err = /List.fantasy-land\/concat: List required/
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

  t.end()
})

test('List concat functionality', t => {
  const a = List([ 1, 2 ])
  const b = List([ 3, 4 ])

  t.same(a.concat(b).valueOf(), [ 1, 2, 3, 4 ], 'concats second to first')
  t.same(b.concat(a).valueOf(), [ 3, 4, 1, 2 ], 'concats first to second')

  t.end()
})

test('List empty properties (Monoid)', t => {
  const m = List([ 1, 2 ])

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.same(right.valueOf(), m.valueOf(), 'right identity')
  t.same(left.valueOf(), m.valueOf(), 'left identity')

  t.end()
})

test('List empty functionality', t => {
  const x = List([ 0, 1, true ]).empty()

  t.equal(x.type(), 'List', 'provides a List')
  t.same(x.valueOf(), [], 'provides an empty array')

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

test('List reduce fantasy-land errors', t => {
  const reduce = bindFunc(List([ 1, 2 ])[fl.reduce])

  const err = /List.fantasy-land\/reduce: Function required for first argument/
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

test('List reduceRight errors', t => {
  const reduce = bindFunc(List([ 1, 2 ]).reduceRight)

  const err = /List.reduceRight: Function required for first argument/
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

test('List reduceRight functionality', t => {
  const f = (y, x) => y.concat(x)
  const m = List([ '1', '2', '3' ])

  t.equal(m.reduceRight(f, '4'), '4321', 'reduces as expected')

  t.end()
})

test('List fold errors', t => {
  const f = bindFunc(x => List(x).fold())

  const noSemi = /^TypeError: List.fold: List must contain Semigroups of the same type/
  t.throws(f(undefined), noSemi, 'throws when contains single undefined')
  t.throws(f(null), noSemi, 'throws when contains single null')
  t.throws(f(0), noSemi, 'throws when contains single falsey number')
  t.throws(f(1), noSemi, 'throws when contains single truthy number')
  t.throws(f(false), noSemi, 'throws when contains single false')
  t.throws(f(true), noSemi, 'throws when contains single true')
  t.throws(f({}), noSemi, 'throws when contains a single object')
  t.throws(f(unit), noSemi, 'throws when contains a single function')

  const empty = /^TypeError: List.fold: List must contain at least one Semigroup/
  t.throws(f([]), empty, 'throws when empty')

  const diff = /^TypeError: List.fold: List must contain Semigroups of the same type/
  t.throws(f([ [], '' ]), diff, 'throws when empty')

  t.end()
})

test('List fold functionality', t => {
  const f = x => List(x).fold()

  t.same(f([ [ 1 ], [ 2 ] ]), [ 1, 2 ], 'combines and extracts semigroups')
  t.equals(f('lucky'), 'lucky', 'extracts a single semigroup')

  t.end()
})

test('List foldMap errors', t => {
  const noFunc = bindFunc(fn => List([ 1 ]).foldMap(fn))

  const funcErr = /^TypeError: List.foldMap: Semigroup returning function required/
  t.throws(noFunc(undefined), funcErr, 'throws with undefined')
  t.throws(noFunc(null), funcErr, 'throws with null')
  t.throws(noFunc(0), funcErr, 'throws with falsey number')
  t.throws(noFunc(1), funcErr, 'throws with truthy number')
  t.throws(noFunc(false), funcErr, 'throws with false')
  t.throws(noFunc(true), funcErr, 'throws with true')
  t.throws(noFunc(''), funcErr, 'throws with falsey string')
  t.throws(noFunc('string'), funcErr, 'throws with truthy string')
  t.throws(noFunc({}), funcErr, 'throws with an object')
  t.throws(noFunc([]), funcErr, 'throws with an array')

  const fn = bindFunc(x => List(x).foldMap(identity))

  const emptyErr = /^TypeError: List.foldMap: List must not be empty/
  t.throws(fn([]), emptyErr, 'throws when passed an empty List')

  const notSameSemi = /^TypeError: List.foldMap: Provided function must return Semigroups of the same type/
  t.throws(fn([ 0 ]), notSameSemi, 'throws when function does not return a Semigroup')

  t.throws(fn([ '', 0 ]), notSameSemi, 'throws when not all returned values are Semigroups')
  t.throws(fn([ '', [] ]), notSameSemi, 'throws when different semigroups are returned')

  t.end()
})

test('List foldMap functionality', t => {
  const fold = xs =>
    List(xs).foldMap(x => x.toString())

  t.same(fold([ 1, 2 ]), '12', 'combines and extracts semigroups')
  t.same(fold([ 3 ]), '3', 'extracts a single semigroup')

  t.end()
})

test('List filter fantasy-land errors', t => {
  const filter = bindFunc(List([ 0 ])[fl.filter])

  const err = /List.fantasy-land\/filter: Pred or predicate function required/

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

  t.same(m.filter(bigNum).valueOf(), [ 34 ], 'filters for bigNums with function')
  t.same(m.filter(justStrings).valueOf(), [ 'string' ], 'filters for strings with function')

  t.same(m.filter(bigNumPred).valueOf(), [ 34 ], 'filters for bigNums with Pred')
  t.same(m.filter(justStringsPred).valueOf(), [ 'string' ], 'filters for strings with Pred')

  t.end()
})

test('List filter properties (Filterable)', t => {
  const m = List([ 2, 6, 10, 25, 9, 28 ])
  const n = List([ 'string', 'party' ])

  const isEven = x => x % 2 === 0
  const isBig = x => x >= 10

  const left = m.filter(x => isBig(x) && isEven(x)).valueOf()
  const right = m.filter(isBig).filter(isEven).valueOf()

  t.same(left, right , 'distributivity')
  t.same(m.filter(() => true).valueOf(), m.valueOf(), 'identity')
  t.same(m.filter(() => false).valueOf(), n.filter(() => false).valueOf(), 'annihilation')

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

  t.same(m.reject(bigNum).valueOf(), [ 4, 5, 10, 'string' ], 'rejects bigNums with function')
  t.same(m.reject(justStrings).valueOf(), [ 4, 5, 10, 34 ], 'rejects strings with function')

  t.same(m.reject(bigNumPred).valueOf(), [ 4, 5, 10, 'string' ], 'rejects bigNums with Pred')
  t.same(m.reject(justStringsPred).valueOf(), [ 4, 5, 10, 34 ], 'rejects strings with Pred')

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

test('List map fantasy-land errors', t => {
  const map = bindFunc(List([])[fl.map])

  const err = /List.fantasy-land\/map: Function required/
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
  t.same(m.valueOf(), xs, 'returns the result of the map inside of new List')

  t.end()
})

test('List map properties (Functor)', t => {
  const m = List([ 49 ])

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.same(m.map(identity).valueOf(), m.valueOf(), 'identity')
  t.same(m.map(_compose(f, g)).valueOf(), m.map(g).map(f).valueOf(), 'composition')

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

  t.same(a.ap(List([ 3 ])).valueOf(), b.ap(List([ 3 ])).valueOf(), 'composition')

  t.end()
})

test('List of', t => {
  t.equal(List.of, List([]).of, 'List.of is the same as the instance version')
  t.equal(List.of(0).type(), 'List', 'returns a List')
  t.same(List.of(0).valueOf(), [ 0 ], 'wraps the value passed into List in an array')

  t.end()
})

test('List of properties (Applicative)', t => {
  const m = List([ identity ])

  t.ok(isFunction(List([]).of), 'provides an of function')
  t.ok(isFunction(List([]).ap), 'implements the Apply spec')

  t.same(m.ap(List([ 3 ])).valueOf(), [ 3 ], 'identity')
  t.same(m.ap(List.of(3)).valueOf(), List.of(identity(3)).valueOf(), 'homomorphism')

  const a = x => m.ap(List.of(x))
  const b = x => List.of(applyTo(x)).ap(m)

  t.same(a(3).valueOf(), b(3).valueOf(), 'interchange')

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

test('List chain fantasy-land errors', t => {
  const chain = bindFunc(List([ 0 ])[fl.chain])
  const bad = bindFunc(x => List.of(x)[fl.chain](identity))

  const noFunc = /List.fantasy-land\/chain: Function required/
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

  const noList = /List.fantasy-land\/chain: Function must return a List/
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

  t.same(a(10).valueOf(), b(10).valueOf(), 'assosiativity')

  t.end()
})

test('List chain properties (Monad)', t => {
  t.ok(isFunction(List([]).chain), 'implements the Chain spec')
  t.ok(isFunction(List([]).of), 'implements the Applicative spec')

  const f = x => List([ x ])

  t.same(List.of(3).chain(f).valueOf(), f(3).valueOf(), 'left identity')
  t.same(f(3).chain(List.of).valueOf(), f(3).valueOf(), 'right identity')

  t.end()
})

test('List sequence errors', t => {
  const seq = bindFunc(List.of(MockCrock(2)).sequence)
  const seqBad = bindFunc(List.of(0).sequence)

  const err = /List.sequence: Applicative TypeRep or Apply returning function required/
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

  const noAppl = /List.sequence: Must wrap Applys of the same type/
  t.throws(seqBad(unit), noAppl, 'wrapping non-Apply throws')

  t.end()
})

test('List sequence with Apply function', t => {
  const x = 'string'
  const fn = x => MockCrock(x)
  const m = List.of(MockCrock(x)).sequence(fn)

  t.ok(isSameType(MockCrock, m), 'Provides an outer type of MockCrock')
  t.ok(isSameType(List, m.valueOf()), 'Provides an inner type of List')
  t.same(m.valueOf().valueOf(), [ x ], 'inner List contains original inner value')

  const ar = x => [ x ]
  const arM = List.of([ x ]).sequence(ar)

  t.ok(isSameType(Array, arM), 'Provides an outer type of Array')
  t.ok(isSameType(List, arM[0]), 'Provides an inner type of List')
  t.same(arM[0].valueOf(), [ x ], 'inner List contains original inner value')

  t.end()
})

test('List sequence with Applicative TypeRep', t => {
  const x = 'string'
  const m = List.of(MockCrock(x)).sequence(MockCrock)

  t.ok(isSameType(MockCrock, m), 'Provides an outer type of MockCrock')
  t.ok(isSameType(List, m.valueOf()), 'Provides an inner type of List')
  t.same(m.valueOf().valueOf(), [ x ], 'inner List contains original inner value')

  const ar = List.of([ x ]).sequence(Array)

  t.ok(isSameType(Array, ar), 'Provides an outer type of Array')
  t.ok(isSameType(List, ar[0]), 'Provides an inner type of List')
  t.same(ar[0].valueOf(), [ x ], 'inner List contains original inner value')

  t.end()
})

test('List traverse errors', t => {
  const trav = bindFunc(List.of(2).traverse)

  const first = /List.traverse: Applicative TypeRep or Apply returning function required for first argument/
  t.throws(trav(undefined, MockCrock), first, 'throws with undefined in first argument')
  t.throws(trav(null, MockCrock), first, 'throws with null in first argument')
  t.throws(trav(0, MockCrock), first, 'throws falsey with number in first argument')
  t.throws(trav(1, MockCrock), first, 'throws truthy with number in first argument')
  t.throws(trav('', MockCrock), first, 'throws falsey with string in first argument')
  t.throws(trav('string', MockCrock), first, 'throws with truthy string in first argument')
  t.throws(trav(false, MockCrock), first, 'throws with false in first argument')
  t.throws(trav(true, MockCrock), first, 'throws with true in first argument')
  t.throws(trav([], MockCrock), first, 'throws with an array in first argument')
  t.throws(trav({}, MockCrock), first, 'throws with an object in first argument')

  const second = /List.traverse: Apply returning functions required for second argument/
  t.throws(trav(MockCrock, undefined), second, 'throws with undefined in second argument')
  t.throws(trav(MockCrock, null), second, 'throws with null in second argument')
  t.throws(trav(MockCrock, 0), second, 'throws falsey with number in second argument')
  t.throws(trav(MockCrock, 1), second, 'throws truthy with number in second argument')
  t.throws(trav(MockCrock, ''), second, 'throws falsey with string in second argument')
  t.throws(trav(MockCrock, 'string'), second, 'throws with truthy string in second argument')
  t.throws(trav(MockCrock, false), second, 'throws with false in second argument')
  t.throws(trav(MockCrock, true), second, 'throws with true in second argument')
  t.throws(trav(MockCrock, []), second, 'throws with an array in second argument')
  t.throws(trav(MockCrock, {}), second, 'throws with an object in second argument')

  const noAppl = /List.traverse: Both functions must return an Apply of the same type/
  t.throws(trav(unit, MockCrock), noAppl, 'throws with non-Appicative returning function in first argument')
  t.throws(trav(MockCrock, unit), noAppl, 'throws with non-Appicative returning function in second argument')

  t.end()
})

test('List traverse with Apply function', t => {
  const x = 'string'
  const res = 'result'
  const f = x => MockCrock(x)
  const fn = m => constant(m(res))

  const m = List.of(x).traverse(f, fn(MockCrock))

  t.ok(isSameType(MockCrock, m), 'Provides an outer type of MockCrock')
  t.ok(isSameType(List, m.valueOf()), 'Provides an inner type of List')
  t.same(m.valueOf().valueOf(), [ res ], 'inner List contains transformed value')

  const ar = x => [ x ]
  const arM = List.of(x).traverse(ar, fn(ar))

  t.ok(isSameType(Array, arM), 'Provides an outer type of Array')
  t.ok(isSameType(List, arM[0]), 'Provides an inner type of List')
  t.same(arM[0].valueOf(), [ res ], 'inner List contains transformed value')

  t.end()
})

test('List traverse with Applicative TypeRep', t => {
  const x = 'string'
  const res = 'result'
  const fn = m => constant(m(res))

  const m = List.of(x).traverse(MockCrock, fn(MockCrock))

  t.ok(isSameType(MockCrock, m), 'Provides an outer type of MockCrock')
  t.ok(isSameType(List, m.valueOf()), 'Provides an inner type of List')
  t.same(m.valueOf().valueOf(), [ res ], 'inner List contains transformed value')

  const ar = x => [ x ]
  const arM = List.of(x).traverse(Array, fn(ar))

  t.ok(isSameType(Array, arM), 'Provides an outer type of Array')
  t.ok(isSameType(List, arM[0]), 'Provides an inner type of List')
  t.same(arM[0].valueOf(), [ res ], 'inner List contains transformed value')

  t.end()
})
