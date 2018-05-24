const test = require('tape')
const sinon = require('sinon')
const fl = require('../core/flNames')
const helpers = require('../test/helpers')
const bindFunc = helpers.bindFunc
const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isFunction = require('./../core/isFunction')
const unit = require('./../core/_unit')
const isObject = require('./../core/isObject')
const isString = require('./../core/isString')

const Tuple = require('./index')

const identity = x => x

test('Tuple core', t => {
  const x = Tuple(3)(0, 0, 0)

  t.ok(isFunction(Tuple), 'is a function')
  t.ok(isObject(x), 'returns an object')

  t.ok(isFunction(x.constructor), 'provides TypeRep on constructor')

  t.ok(isFunction(x.type), 'provides a type function')
  t.ok(isString(x['@@type']), 'provides a @@type string')

  t.end()
})

test('Tuple', t => {
  const f = bindFunc(Tuple)

  const noNum = /Tuple: Tuple size should be a number between 1 and 10/
  t.ok(isFunction(Tuple), 'is a function')

  t.throws(f(undefined), noNum, 'throws with undefined as first arg')
  t.throws(f(null), noNum, 'throws with null as first arg')
  t.throws(f(''), noNum, 'throws with falsey string as first arg')
  t.throws(f('string'), noNum, 'throws with truthy string as first arg')
  t.throws(f(false), noNum, 'throws with false as first arg')
  t.throws(f(true), noNum, 'throws with true as first arg')
  t.throws(f({}), noNum, 'throws with object as first arg')
  t.throws(f([]), noNum, 'throws with array as first arg')
  t.throws(f(unit), noNum, 'throws with function as first arg')
  t.throws(f(-1), noNum, 'throws with a number less than 1')
  t.throws(f(111), noNum, 'throws with a number greater than 10')

  t.equals(Tuple.length, 1, 'constructor has a length of 1')
  t.equals(Tuple(1).length, 1, 'returns a function with correct length (1)')
  t.equals(Tuple(2).length, 2, 'returns a function with correct length (2)')
  t.equals(Tuple(3).length, 3, 'returns a function with correct length (3)')
  t.equals(Tuple(4).length, 4, 'returns a function with correct length (4)')
  t.equals(Tuple(5).length, 5, 'returns a function with correct length (5)')
  t.equals(Tuple(6).length, 6, 'returns a function with correct length (6)')
  t.equals(Tuple(7).length, 7, 'returns a function with correct length (7)')
  t.equals(Tuple(8).length, 8, 'returns a function with correct length (8)')
  t.equals(Tuple(9).length, 9, 'returns a function with correct length (9)')
  t.equals(Tuple(10).length, 10, 'returns a function with correct length (10)')

  t.throws(
    bindFunc(Tuple(3))(1, 2, 3, 4),
    /3-Tuple: Expected 3 values, but got 4/,
    'throws if invalid number of arguments'
  )
  t.doesNotThrow(
    bindFunc(Tuple(3))(1, 2, 3),
    'allows valid number of arguments'
  )
  t.end()
})

test('Tuple fantasy-land api', t => {
  const m = Tuple(1)(0)

  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.map]), 'provides map method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')

  t.end()
})

test('Tuple @@implements', t => {
  const f = Tuple(1)(0)['@@implements']

  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('concat'), true, 'implements concat func')

  t.end()
})

test('Tuple inspect', t => {
  const m = Tuple(2)(0, 'nice')

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Tuple( 0, "nice" )', 'returns inspect string')

  t.end()
})

test('Tuple type', t => {
  const m = Tuple(1)(0)

  t.ok(isFunction(m.type), 'is a function')
  t.equal(m.type(), '1-Tuple', 'returns number of elements and Tuple as type')

  t.end()
})

test('Tuple @@type', t => {
  const m = Tuple(1)( 0)

  t.equal(m['@@type'], 'crocks/Tuple@1', 'returns crocks/Tuple@1 as Monoid Type')

  t.end()
})

test('Tuple project', t => {
  const tuple = Tuple(3)('zalgo', 'is', 'back')

  t.ok(isFunction(tuple.project), 'is a function')

  const project = bindFunc(tuple.project)
  const err = /3-Tuple.project: Index should be an integer between 2 and 3/

  t.throws(project(0), err, 'throws with index less than 2')
  t.throws(project(6), err, 'throws with index less than tuple length')

  t.same(tuple.project(1), 'zalgo', 'provides the first value')
  t.same(tuple.project(2), 'is', 'provides the second value')
  t.same(tuple.project(3), 'back', 'provides the third value')

  t.end()
})

test('Tuple map errors', t => {
  const map = bindFunc(Tuple(4)('zalgo', 'will', 'be', 'back').map)
  const err = /Tuple.map: Function required/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws with object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Tuple map fantasy-land errors', t => {
  const map = bindFunc(Tuple(4)('zalgo', 'will', 'be', 'back')[fl.map])

  const err = /Tuple.fantasy-land\/map: Function required/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws with object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Tuple map functionality', t => {
  const m = Tuple(3)(5, 45, 50)
  const n = m.map(x => x + 5)

  t.equal(m.map(identity).type(), m.type(), 'returns a Tuple')
  t.equal(n.project(1), 5, 'Does not modify first value')
  t.equal(n.project(2), 45, 'Does not modify second value')
  t.equal(n.project(3), 55, 'applies function to third value')

  t.end()
})

test('Tuple map properties (Functor)', t => {
  const m = Tuple(1)(50)

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).project(1), m.project(1), 'identity')
  t.equal(m.map(compose(f, g)).project(1), m.map(g).map(f).project(1), 'composition')

  t.end()
})

test('Tuple mapAll errors', t => {
  const m = Tuple(3)(5, 45, 50)

  const mapAll = bindFunc(m.mapAll)
  const err1 = /3-Tuple.mapAll: Requires 3 functions/
  const err2 = /3-Tuple.mapAll: Functions required for all arguments/

  t.throws(
    mapAll(identity, identity),
    err1,
    'throws with an invalid number of functions'
  )
  t.throws(
    mapAll(identity, 5, identity),
    err2,
    'throws if all arguments are not functions'
  )
  t.end()
})

test('Tuple mapAll functionality', t => {
  const m = Tuple(3)(5, 45, 50)
  const n = m.mapAll(identity, x => x + 5, x => x - 10)

  t.equal(m.map(identity).type(), m.type(), 'returns a Tuple')
  t.equal(n.project(1), 5, 'applies function to first value')
  t.equal(n.project(2), 50, 'applies function to second value')
  t.equal(n.project(3), 40, 'applies function to third value')

  t.end()
})

test('Tuple toArray', t => {
  const m = Tuple(3)(34, 'string', 'bing')

  t.ok(isFunction(m.toArray), 'provides a toArray function')
  t.same(
    m.toArray(),
    [ 34, 'string', 'bing' ],
    'returns an array with the Tuple\'s values'
  )

  t.end()
})

test('Tuple concat functionality', t => {
  const m = Tuple(2)([ 6 ], '2')
  const n = Tuple(2)([ 12 ], '5')

  t.same(m.concat(n).project(1), [ 6, 12 ], 'combines the first Semigroups')
  t.same(m.concat(n).project(2), '25', 'combines the second Semigroups')

  t.end()
})

test('Tuple concat errors', t => {
  const bad = bindFunc(Tuple(3)(0, 0, {}).concat)
  const good = bindFunc(Tuple(3)([], 'string', []).concat)
  const noTuple = /3-Tuple.concat: Tuple of the same length required/
  t.throws(good([]), noTuple, 'throws when Non-Tuple passed')
  t.throws(
    good(Tuple(2)(1, 'string')),
    noTuple,
    'throws when concating different length Tuples'
  )

  const noSemigroups = /3-Tuple.concat: Both Tuples must contain Semigroups of the same type/
  t.throws(
    bad(Tuple(3)([], [], [])),
    noSemigroups,
    'throws when left Tuple does not contain Semigroups'
  )
  t.throws(
    good(Tuple(3)(0, 0, 0)),
    noSemigroups,
    'throws when right Tuple does not contain Semigroups'
  )
  t.throws(
    good(Tuple(3)('string', 'string', [])),
    noSemigroups,
    'throws when Tuples contain different Semigroups'
  )

  t.end()
})

test('Tuple concat fantasy-land errors', t => {
  const bad = bindFunc(Tuple(3)(0, 0, {})[fl.concat])
  const good = bindFunc(Tuple(3)([], 'string', [])[fl.concat])
  const noTuple = /3-Tuple.fantasy-land\/concat: Tuple of the same length required/
  t.throws(good([]), noTuple, 'throws when Non-Tuple passed')
  t.throws(
    good(Tuple(2)(1, 'string')),
    noTuple,
    'throws when concating different length Tuples'
  )

  const noSemigroups = /3-Tuple.fantasy-land\/concat: Both Tuples must contain Semigroups of the same type/
  t.throws(
    bad(Tuple(3)([], [], [])),
    noSemigroups,
    'throws when left Tuple does not contain Semigroups'
  )
  t.throws(
    good(Tuple(3)(0, 0, 0)),
    noSemigroups,
    'throws when right Tuple does not contain Semigroups'
  )
  t.throws(
    good(Tuple(3)('string', 'string', [])),
    noSemigroups,
    'throws when Tuples contain different Semigroups'
  )

  t.end()
})

test('Tuple concat properties (Semigroup)', t => {
  const a = Tuple(2)([ 1 ], '1')
  const b = Tuple(2)([ 2 ], '2')
  const c = Tuple(2)([ 3 ], '3')
  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))
  t.ok(isFunction(Tuple(2)(0, 0).concat), 'is a function')
  t.same(left.toArray(), right.toArray(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns Semigroup of the same type')
  t.end()
})

test('Tuple equals functionality', t => {
  const a = Tuple(2)({ deep: 'equals' }, [ 1 ])
  const b = Tuple(2)({ deep: 'equals' }, [ 1 ])
  const c = Tuple(2)(1, 'space kitten')

  const value = 'yep'
  const nonTuple = { type: 'Tuple...Not' }

  t.equal(a.equals(c), false, 'returns false when 2 Tuple are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Tuple are equal')
  t.equal(a.equals(value), false, 'returns false when passed a simple value')
  t.equal(a.equals(nonTuple), false, 'returns false when passed a non-Tuple')

  t.end()
})

test('Tuple equals properties (Setoid)', t => {
  const a = Tuple(2)(0, 'like')
  const b = Tuple(2)(0, 'like')
  const c = Tuple(2)(1, 'rainbow')
  const d = Tuple(2)(0, 'dislike')

  t.ok(isFunction(Tuple(2)(0, 0).equals), 'provides an equals function')

  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Tuple merge', t => {
  const m = Tuple(3)(1, 2, 3)
  t.ok(isFunction(m.merge), 'provides a merge function')

  const merge = bindFunc(m.merge)
  const err = /3-Tuple.merge: Function required/
  t.throws(merge(undefined), err, 'throws with undefined')
  t.throws(merge(null), err, 'throws with null')
  t.throws(merge(0), err, 'throws with falsey number')
  t.throws(merge(1), err, 'throws with truthy number')
  t.throws(merge(''), err, 'throws with falsey string')
  t.throws(merge('string'), err, 'throws with truthy string')
  t.throws(merge(false), err, 'throws with false')
  t.throws(merge(true), err, 'throws with true')
  t.throws(merge([]), err, 'throws with an array')
  t.throws(merge({}), err, 'throws with object')

  t.doesNotThrow(merge(unit), 'allows a function')

  const fn = sinon.spy((x, y, z) => x + y + z)
  const res = m.merge(fn)

  t.ok(fn.returned(res), 'provides the result of the passed in function')
  t.ok(fn.calledWith(1, 2, 3), 'passes correct values to the function')

  t.end()
})
