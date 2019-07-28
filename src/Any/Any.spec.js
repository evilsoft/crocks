const test = require('tape')
const helpers = require('../test/helpers')
const laws = require('../test/laws')

const bindFunc = helpers.bindFunc

const equals = require('../core/equals')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')

const fl = require('../core/flNames')

const Any = require('.')

const constant = x => () => x
const identity = x => x

test('Any', t => {
  const a = bindFunc(Any)

  t.ok(isFunction(Any), 'is a function')
  t.ok(isObject(Any(false)), 'returns an object')

  t.equals(Any(true).constructor, Any, 'provides TypeRep on constructor')

  t.ok(isFunction(Any.empty), 'provides an empty function')
  t.ok(isFunction(Any.type), 'provides a type function')
  t.ok(isString(Any['@@type']), 'provides a @@type string')

  const err = /Any: Non-function value required/
  t.throws(Any, err, 'throws with nothing')
  t.throws(a(identity), err, 'throws with a function')

  t.doesNotThrow(a(undefined), 'allows undefined')
  t.doesNotThrow(a(null), 'allows null')
  t.doesNotThrow(a(0), 'allows a falsey number')
  t.doesNotThrow(a(1), 'allows a truthy number')
  t.doesNotThrow(a(''), 'allows a falsey string')
  t.doesNotThrow(a('string'), 'allows a truthy string')
  t.doesNotThrow(a(false), 'allows false')
  t.doesNotThrow(a(true), 'allows true')
  t.doesNotThrow(a([]), 'allows an array')
  t.doesNotThrow(a({}), 'allows an object')

  t.end()
})

test('Any fantasy-land api', t => {
  const m = Any(true)

  t.ok(isFunction(Any[fl.empty]), 'provides empty function on constructor')

  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')

  t.end()
})

test('Any @@implements', t => {
  const f = Any['@@implements']

  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals')

  t.end()
})

test('Any inspect', t => {
  const m = Any(1)

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Any true', 'returns inspect string')

  t.end()
})

test('Any valueOf', t => {
  t.ok(isFunction(Any(0).valueOf), 'is a function')

  t.equal(Any(undefined).valueOf(), false, 'reports false for undefined')
  t.equal(Any(null).valueOf(), false, 'reports false for null')
  t.equal(Any(0).valueOf(), false, 'reports false for falsey number')
  t.equal(Any(1).valueOf(), true, 'reports true for truthy number')
  t.equal(Any('').valueOf(), false, 'reports false for falsey number')
  t.equal(Any('string').valueOf(), true, 'reports true for truthy string')
  t.equal(Any(false).valueOf(), false, 'reports false for false')
  t.equal(Any(true).valueOf(), true, 'reports true for true')
  t.equal(Any([]).valueOf(), true, 'reports true for an array')
  t.equal(Any({}).valueOf(), true, 'reports true for an object')

  t.end()
})

test('Any type', t => {
  t.ok(isFunction(Any(0).type), 'is a function')

  t.equal(Any(0).type, Any.type, 'static and instance versions are the same')
  t.equal(Any(0).type(), 'Any', 'reports Any')

  t.end()
})

test('Any @@type', t => {
  t.equal(Any['@@type'], Any(0)['@@type'], 'static and instance versions are the same')
  t.equal(Any(0)['@@type'], 'crocks/Any@2', 'reports crocks/Any@2')

  t.end()
})

test('Any equals properties (Setoid)', t => {
  const a = Any(true)
  const b = Any(true)
  const c = Any(true)
  const d = Any(false)

  const equals = laws.Setoid('equals')

  t.ok(isFunction(a.equals), 'provides an equals function')

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Any fantasy-land equals properties (Setoid)', t => {
  const a = Any(true)
  const b = Any(true)
  const c = Any(true)
  const d = Any(false)

  const equals = laws.Setoid(fl.equals)

  t.ok(isFunction(a[fl.equals]), 'provides an equals function')

  t.ok(equals.reflexivity(a), 'reflexivity')
  t.ok(equals.symmetry(a, b), 'symmetry (equal)')
  t.ok(equals.symmetry(a, d), 'symmetry (!equal)')
  t.ok(equals.transitivity(a, b, c), 'transitivity (equal)')
  t.ok(equals.transitivity(a, d, c), 'transitivity (!equal)')

  t.end()
})

test('Any concat functionality', t => {
  const a = Any(true)
  const b = Any(false)

  const notAny = { type: constant('Any...Not') }

  const cat = bindFunc(a.concat)

  const err = /Any.concat: Any required/
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
  t.throws(cat(notAny), err, 'throws with non-Any')

  t.equal(a.concat(b).valueOf(), true, 'true to false reports true')
  t.equal(a.concat(a).valueOf(), true, 'true to true reports true')
  t.equal(b.concat(b).valueOf(), false, 'false to false reports false')

  t.end()
})

test('Any concat fantasy-land errors', t => {
  const a = Any(true)

  const notAny = { type: constant('Any...Not') }

  const cat = bindFunc(a[fl.concat])

  const err = /Any.fantasy-land\/concat: Any required/
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
  t.throws(cat(notAny), err, 'throws with non-Any')

  t.end()
})

test('Any concat properties (Semigroup)', t => {
  const a = Any(0)
  const b = Any(true)
  const c = Any('')

  const concat = laws.Semigroup(equals, 'concat')

  t.ok(isFunction(a.concat), 'provides a concat function')

  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Any fantasy-land concat properties (Semigroup)', t => {
  const a = Any(10)
  const b = Any(true)
  const c = Any('string')

  const concat = laws.Semigroup(equals, fl.concat)

  t.ok(isFunction(a[fl.concat]), 'provides a concat function')
  t.ok(concat.associativity(a, b, c), 'associativity')

  t.end()
})

test('Any empty properties (Monoid)', t => {
  const m = Any(true)

  const empty = laws.Monoid(equals, 'empty', 'concat')

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.constructor.empty), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Any fantasy-land empty properties (Monoid)', t => {
  const m = Any(true)

  const empty = laws.Monoid(equals, fl.empty, fl.concat)

  t.ok(isFunction(m[fl.concat]), 'provides a concat function')
  t.ok(isFunction(m.constructor[fl.empty]), 'provides an empty function on constructor')

  t.ok(empty.leftIdentity(m), 'left identity')
  t.ok(empty.rightIdentity(m), 'right identity')

  t.end()
})

test('Any empty functionality', t => {
  const x = Any(0).empty()

  t.equal(x.type(), 'Any', 'provides an Any')
  t.equal(x.valueOf(), false, 'wraps a false value')

  t.end()
})
