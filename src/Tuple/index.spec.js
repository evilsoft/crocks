import test from 'tape'
import sinon from 'sinon'
import fl from '../core/flNames'
import { bindFunc } from '../test/helpers'

import curry from '../core/curry'
import _compose from '../core/compose'
const compose = curry(_compose)
import isFunction from './../core/isFunction'
import unit from './../core/_unit'
import isObject from './../core/isObject'
import isString from './../core/isString'

import Tuple from '.'

const identity = x => x

test('Tuple core', t => {
  const x = Tuple(3)(0, 0, 0)

  t.ok(isFunction(Tuple), 'is a function')
  t.ok(isString(Tuple(3)['@@type']), 'provides a @@type string on the instance constructor')
  t.ok(isFunction(Tuple(3).type), 'provides a type function on the instance constructor')

  t.ok(isObject(x), 'returns an object')
  t.ok(isFunction(x.constructor), 'provides TypeRep on instance')
  t.ok(isFunction(x.type), 'provides a type function on the instance')
  t.ok(isString(x['@@type']), 'provides a @@type string on the instance')

  t.end()
})

test('Tuple', t => {
  const f = bindFunc(Tuple)

  const noNum = /Tuple: First argument must be an integer/
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
  t.equals(Tuple(11).length, 11, 'returns a function with correct length (11+)')

  t.same(Tuple(1)(0).toArray(), [ 0 ], 'returns a Tuple with (1) element')
  t.same(Tuple(2)(0, 0).toArray(), [ 0, 0 ], 'returns a Tuple with (2) elements')
  t.same(Tuple(3)(0, 0, 0).toArray(), [ 0, 0, 0 ], 'returns a Tuple with (3) elements')
  t.same(Tuple(4)(0, 0, 0, 0).toArray(), [ 0, 0, 0, 0 ], 'returns a Tuple with (4) elements')
  t.same(Tuple(5)(0, 0, 0, 0, 0).toArray(), [ 0, 0, 0, 0, 0 ], 'returns a Tuple with (5) elements')
  t.same(Tuple(6)(0, 0, 0, 0, 0, 0).toArray(), [ 0, 0, 0, 0, 0, 0 ], 'returns a Tuple with (6) elements')
  t.same(Tuple(7)(0, 0, 0, 0, 0, 0, 0).toArray(), [ 0, 0, 0, 0, 0, 0, 0 ], 'returns a Tuple with (7) elements')
  t.same(Tuple(8)(0, 0, 0, 0, 0, 0, 0, 0).toArray(), [ 0, 0, 0, 0, 0, 0, 0, 0 ], 'returns a Tuple with (8) elements')
  t.same(Tuple(9)(0, 0, 0, 0, 0, 0, 0, 0, 0).toArray(), [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 'returns a Tuple with (9) elements')
  t.same(Tuple(10)(0, 0, 0, 0, 0, 0, 0, 0, 0, 0).toArray(), [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 'returns a Tuple with (10) elements')
  t.same(Tuple(11)(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0).toArray(), [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 'returns a Tuple with (11+) elements')

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
  const f = Tuple(1)['@@implements']

  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('concat'), true, 'implements concat func')

  t.end()
})

test('Tuple inspect', t => {
  const m = Tuple(1)(0)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')

  t.same(Tuple(1)(0).inspect(), '1-Tuple( 0 )', 'returns inspect string for a Tuple with (1) element')
  t.same(Tuple(2)(0, 0).inspect(), '2-Tuple( 0, 0 )', 'returns inspect string for a Tuple with (2) elements')
  t.same(Tuple(3)(0, 0, 0).inspect(), '3-Tuple( 0, 0, 0 )', 'returns inspect string for a Tuple with (3) elements')
  t.same(Tuple(4)(0, 0, 0, 0).inspect(), '4-Tuple( 0, 0, 0, 0 )', 'returns inspect string for a Tuple with (4) elements')
  t.same(Tuple(5)(0, 0, 0, 0, 0).inspect(), '5-Tuple( 0, 0, 0, 0, 0 )', 'returns inspect string for a Tuple with (5) elements')
  t.same(Tuple(6)(0, 0, 0, 0, 0, 0).inspect(), '6-Tuple( 0, 0, 0, 0, 0, 0 )', 'returns inspect string for a Tuple with (6) elements')
  t.same(Tuple(7)(0, 0, 0, 0, 0, 0, 0).inspect(), '7-Tuple( 0, 0, 0, 0, 0, 0, 0 )', 'returns inspect string for a Tuple with (7) elements')
  t.same(Tuple(8)(0, 0, 0, 0, 0, 0, 0, 0).inspect(), '8-Tuple( 0, 0, 0, 0, 0, 0, 0, 0 )', 'returns inspect string for a Tuple with (8) elements')
  t.same(Tuple(9)(0, 0, 0, 0, 0, 0, 0, 0, 0).inspect(), '9-Tuple( 0, 0, 0, 0, 0, 0, 0, 0, 0 )', 'returns inspect string for a Tuple with (9) elements')
  t.same(Tuple(10)(0, 0, 0, 0, 0, 0, 0, 0, 0, 0).inspect(), '10-Tuple( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 )', 'returns inspect string for a Tuple with (10) elements')
  t.same(Tuple(11)(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0).inspect(), '11-Tuple( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 )', 'returns inspect string for a Tuple with (11+) elements')

  t.end()
})

test('Tuple type', t => {
  t.ok(isFunction(Tuple(1)(0).type), 'is a function')

  t.same(Tuple(1)(0).type(), '1-Tuple', 'returns 1-Tuple as the type for a Tuple with (1) element')
  t.same(Tuple(2)(0, 0).type(), '2-Tuple', 'returns 2-Tuple as the type for a Tuple with (2) elements')
  t.same(Tuple(3)(0, 0, 0).type(), '3-Tuple', 'returns 3-Tuple as the type for a Tuple with (3) elements')
  t.same(Tuple(4)(0, 0, 0, 0).type(), '4-Tuple', 'returns 4-Tuple as the type for a Tuple with (4) elements')
  t.same(Tuple(5)(0, 0, 0, 0, 0).type(), '5-Tuple', 'returns 5-Tuple as the type for a Tuple with (5) elements')
  t.same(Tuple(6)(0, 0, 0, 0, 0, 0).type(), '6-Tuple', 'returns 6-Tuple as the type for a Tuple with (6) elements')
  t.same(Tuple(7)(0, 0, 0, 0, 0, 0, 0).type(), '7-Tuple', 'returns 7-Tuple as the type for a Tuple with (7) elements')
  t.same(Tuple(8)(0, 0, 0, 0, 0, 0, 0, 0).type(), '8-Tuple', 'returns 8-Tuple as the type for a Tuple with (8) elements')
  t.same(Tuple(9)(0, 0, 0, 0, 0, 0, 0, 0, 0).type(), '9-Tuple', 'returns 9-Tuple as the type for a Tuple with (9) elements')
  t.same(Tuple(10)(0, 0, 0, 0, 0, 0, 0, 0, 0, 0).type(), '10-Tuple', 'returns 10-Tuple as the type for a Tuple with (10) elements')
  t.same(Tuple(11)(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0).type(), '11-Tuple', 'returns 11-Tuple as the type for a Tuple with (11+) elements')
  t.end()
})

test('Tuple @@type', t => {
  const m = Tuple(1)( 0)

  t.equal(m['@@type'], 'crocks/1-Tuple@1', 'returns crocks/1-Tuple@1 as Monoid Type')

  t.end()
})

test('Tuple project', t => {
  const tuple = Tuple(11)(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)

  t.ok(isFunction(tuple.project), 'is a function')

  const project = bindFunc(tuple.project)
  const err = /11-Tuple.project: Index should be an integer between 1 and 11/

  t.throws(project(0), err, 'throws with index less than 1')
  t.throws(project(12), err, 'throws with index more than tuple length')

  t.same(tuple.project(1), 0, 'provides the first value')
  t.same(tuple.project(2), 0, 'provides the second value')
  t.same(tuple.project(3), 0, 'provides the third value')
  t.same(tuple.project(4), 0, 'provides the fourth value')
  t.same(tuple.project(5), 0, 'provides the fifth value')
  t.same(tuple.project(6), 0, 'provides the sixth value')
  t.same(tuple.project(7), 0, 'provides the seventh value')
  t.same(tuple.project(8), 0, 'provides the eight value')
  t.same(tuple.project(9), 0, 'provides the ninth value')
  t.same(tuple.project(10), 0, 'provides the tenth value')
  t.same(tuple.project(11), 0, 'provides the eleventh value')

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

test('Tuple length functionality', t => {
  const a = Tuple(2)({ deep: 'equals' }, [ 1 ])
  const b = Tuple(3)({ deep: 'equals' }, [ 1 ], 8)
  const c = Tuple(4)(1, 'space kitten', 'rainbow', 'unicorn')
  const d = Tuple(2)
  const e = Tuple(3)
  const f = Tuple(4)

  t.equal(a.tupleLength(), 2, 'returns tuple length when length is 2')
  t.equal(b.tupleLength(), 3, 'returns tuple length when length is 3')
  t.equal(c.tupleLength(), 4, 'returns tuple length when length is 4')
  t.equal(d.tupleLength(), 2, 'returns tuple length when length is 2 and Tuple contains no data')
  t.equal(e.tupleLength(), 3, 'returns tuple length when length is 3 and Tuple contains no data')
  t.equal(f.tupleLength(), 4, 'returns tuple length when length is 4 and Tuple contains no data')

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
