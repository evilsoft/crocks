const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const Last = require('../test/LastMonoid')
const MockCrock = require('../test/MockCrock')

const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isFunction  = require('../core/isFunction')
const isString = require('../core/isString')
const unit = require('../core/_unit')

const fl = require('../core/flNames')

const Const = require('.')

const identity = x => x

const applyTo =
  x => fn => fn(x)

test('Const', t => {
  const C = Const(Array)

  t.ok(isFunction(Const), 'is a function')
  t.ok(isFunction(C), 'returns an constructor function')

  t.ok(isFunction(C.empty), 'provides an empty function')
  t.ok(isFunction(C.of), 'provides an empty of')

  t.ok(isFunction(C.type), 'provides a type function')
  t.ok(isString(C['@@type']), 'provides a @@type string')

  t.equals(C([]).constructor, C, 'provides TypeRep on constructor')

  const fn = bindFunc(Const)
  const err = /Const: TypeRep required for construction/

  t.throws(fn(undefined), err, 'Type Constructor throws with undefined')
  t.throws(fn(null), err, 'Type Constructor throws with null')
  t.throws(fn(NaN), err, 'Type Constructor throws with NaN')
  t.throws(fn(false), err, 'Type Constructor throws with false')
  t.throws(fn(true), err, 'Type Constructor throws with true')
  t.throws(fn(0), err, 'Type Constructor throws with falsey Number')
  t.throws(fn(1), err, 'Type Constructor throws with truthy Number')
  t.throws(fn(''), err, 'Type Constructor throws with falsey String')
  t.throws(fn('string'), err, 'Type Constructor throws with truthy String')
  t.throws(fn({}), err, 'Type Constructor throws with Object')
  t.throws(fn([]), err, 'Type Constructor throws with Array')

  t.end()
})

test('Const construction', t => {
  const num = bindFunc(Const(Number))
  const numErr = /Const\(Number\): Number required/

  t.throws(num(undefined), numErr, 'Instance Constructor for Number throws with undefined')
  t.throws(num(null), numErr, 'Instance Constructor for Number throws with null')
  t.throws(num(false), numErr, 'Instance Constructor for Number throws with false')
  t.throws(num(true), numErr, 'Instance Constructor for Number throws with true')
  t.throws(num(''), numErr, 'Instance Constructor for Number throws with falsey String')
  t.throws(num('string'), numErr, 'Instance Constructor for Number throws with truthy String')
  t.throws(num({}), numErr, 'Instance Constructor for Number throws with Object')
  t.throws(num([]), numErr, 'Instance Constructor for Number throws with Array')

  t.doesNotThrow(num(0), 'Instance Constructor for Number does not throw with falsey Number')
  t.doesNotThrow(num(1), 'Instance Constructor for Number does not throw with truthy Number')

  const str = bindFunc(Const(String))
  const strErr = /Const\(String\): String required/

  t.throws(str(undefined), strErr, 'Instance Constructor for String throws with undefined')
  t.throws(str(null), strErr, 'Instance Constructor for String throws with null')
  t.throws(str(false), strErr, 'Instance Constructor for String throws with false')
  t.throws(str(true), strErr, 'Instance Constructor for String throws with true')
  t.throws(str(0), strErr, 'Instance Constructor for String throws with falsey Number')
  t.throws(str(1), strErr, 'Instance Constructor for String throws with truthy Number')
  t.throws(str({}), strErr, 'Instance Constructor for String throws with Object')
  t.throws(str([]), strErr, 'Instance Constructor for String throws with Array')

  t.doesNotThrow(str(''), 'Instance Constructor for String does not throw with falsey String')
  t.doesNotThrow(str('string'), 'Instance Constructor for String does not throw with truthy String')
  t.end()
})

test('Const fantasy-land api', t => {
  const M = Const(Boolean)

  t.ok(isFunction(M[fl.empty]), 'provides empty method on constructor')
  t.ok(isFunction(M[fl.of]), 'provides of method on constructor')

  const m = M(true)

  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')
  t.ok(isFunction(m[fl.empty]), 'provides empty method on instance')
  t.ok(isFunction(m[fl.map]), 'provides map method on instance')
  t.ok(isFunction(m[fl.of]), 'provides of method on instance')

  t.end()
})

test('Const @@implements', t => {
  const f = Const(String)['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('empty'), true, 'implements empty func')
  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')

  t.end()
})

test('Const inspect', t => {
  const m = Const(Number)(0)
  const n = Const(Last)(Last(0))

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Const(Number) 0', 'returns inspect string with fixed type')
  t.equal(n.inspect(), `Const(${Last.type()}) Last 0`, 'returns inspect string with fixed type for ADTs')

  t.end()
})

test('Const type', t => {
  const Num = Const(Number)
  const Arr = Const(Array)
  const Mon = Const(Last)

  t.ok(isFunction(Num(0).type), 'provides a type function')
  t.equal(Num(0).type(), 'Const(Number)', 'type returns Const(Number) for Number')
  t.equal(Arr([]).type(), 'Const(Array)', 'type returns Const(Array) for Array')
  t.equal(Mon(Last(null)).type(), `Const(${Last.type()})`, 'type uses result of type for inner type name')

  t.end()
})

test('Const @@type', t => {
  const Obj = Const(Object)
  const Bool = Const(Boolean)
  const Mon = Const(Last)

  t.equal(Obj({})['@@type'], Obj['@@type'], 'static and instance versions are the same')

  t.equal(Obj['@@type'], 'crocks/Const(Object)@3', 'type returns crocks/Const(Object)@3 for Object context')
  t.equal(Bool['@@type'], 'crocks/Const(Boolean)@3', 'type returns crocks/Const(Boolean)@3 for Boolean context')
  t.equal(Mon['@@type'], 'crocks/Const(Last)@3', 'type returns crocks/Const(Last)@3 using the result of type on the context')

  t.end()
})

test('Const valueOf', t => {
  const x = 'some value'
  const m = Const(String)(x)

  t.ok(isFunction(m.valueOf), 'is a function')
  t.equal(m.valueOf(), x,'valueOf returns the wrapped value' )

  t.end()
})

test('Const equals functionality', t => {
  const Num = Const(Number)
  const a = Num(0)
  const b = Num(0)
  const c = Num(1)

  const value = 0
  const nonConst = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Consts are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Consts are equal')
  t.equal(a.equals(value), false, 'returns false when passed a simple value')
  t.equal(a.equals(nonConst), false, 'returns false when passed a non-Const')

  t.end()
})

test('Const equals properties (Setoid)', t => {
  const Obj = Const(Object)

  const a = Obj({ a: true })
  const b = Obj({ a: true })
  const c = Obj({ a: true, b: 'not' })
  const d = Obj({ a: true })

  t.ok(isFunction(Obj({}).equals), 'provides an equals function')
  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Const concat functionality', t => {
  const Mon = Const(String)

  const a = Mon('a')
  const b = Mon('b')

  const notConst = MockCrock()
  const nonMon = Const(Number)(45)

  const cat = bindFunc(a.concat)
  const err = /Const\(String\).concat: Const\(String\) required/
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
  t.throws(cat(notConst), err, 'throws when passed non-Const')
  t.throws(cat(nonMon), err, 'throws when passed Const of different type')

  const nonCat = bindFunc(nonMon.concat)
  const semiErr = /Const\(Number\).concat: Must be fixed to a Semigroup/
  t.throws(nonCat(nonMon), semiErr, 'throws pointed to non-Semigroup')

  t.equal(a.concat(b).valueOf(), 'ab', 'reports ab')
  t.equal(b.concat(a).valueOf(), 'ba', 'reports ba')

  t.end()
})

test('Const concat fantasy-land errors', t => {
  const Mon = Const(Array)

  const a = Mon([ 'a' ])

  const notConst = MockCrock()
  const nonMon = Const(Boolean)(true)

  const cat = bindFunc(a[fl.concat])

  const err = /Const\(Array\).fantasy-land\/concat: Const\(Array\) required/
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
  t.throws(cat(notConst), err, 'throws when passed non-Const')
  t.throws(cat(nonMon), err, 'throws when passed Const of different type')

  const nonCat = bindFunc(nonMon[fl.concat])
  const semiErr = /Const\(Boolean\).fantasy-land\/concat: Must be fixed to a Semigroup/
  t.throws(nonCat(nonMon), semiErr, 'throws pointed to non-Semigroup')

  t.end()
})

test('Const concat properties (Semigroup)', t => {
  const Arr = Const(Array)
  const a = Arr([ 1 ])
  const b = Arr([ 2 ])
  const c = Arr([ 3 ])

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.same(left.valueOf(), right.valueOf(), 'associativity')
  t.same(a.concat(b).type(), a.type(), 'returns a Const')

  t.end()
})

test('Const empty errors', t => {
  const nonMon = bindFunc(Const(Number).empty)

  const monErr = /Const\(Number\).empty: Must be fixed to a Monoid/
  t.throws(nonMon(nonMon), monErr, 'throws when pointed to non-Monoid')

  t.end()
})

test('Const empty fantasy-land errors', t => {
  const nonMon = bindFunc(Const(Boolean)[fl.empty])

  const monErr = /Const\(Boolean\).fantasy-land\/empty: Must be fixed to a Monoid/
  t.throws(nonMon(nonMon), monErr, 'throws when pointed to non-Monoid')

  t.end()
})

test('Const empty properties (Monoid)', t => {
  const m = Const(Array)([ 1, 2 ])

  t.ok(isFunction(m.concat), 'provides a concat function')
  t.ok(isFunction(m.empty), 'provides an empty function')

  const right = m.concat(m.empty())
  const left = m.empty().concat(m)

  t.same(right.valueOf(), m.valueOf(), 'right identity')
  t.same(left.valueOf(), m.valueOf(), 'left identity')

  t.end()
})

test('Const map errors', t => {
  const map = bindFunc(Const(Number)(0).map)

  const err = /Const\(Number\).map: Function required/
  t.throws(map(undefined), err, 'throws when passed undefined')
  t.throws(map(null), err, 'throws when passed null')
  t.throws(map(0), err, 'throws when passed falsey number')
  t.throws(map(1), err, 'throws when passed truthy number')
  t.throws(map(''), err, 'throws when passed falsey string')
  t.throws(map('string'), err, 'throws when passed truthy string')
  t.throws(map(false), err, 'throws when passed false')
  t.throws(map(true), err, 'throws when passed true')
  t.throws(map([]), err, 'throws when passed an array')
  t.throws(map({}), err, 'throws when passed an object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Const map fantasy-land errors', t => {
  const map = bindFunc(Const(String)('0')[fl.map])

  const err = /Const\(String\).fantasy-land\/map: Function required/
  t.throws(map(undefined), err, 'throws when passed undefined')
  t.throws(map(null), err, 'throws when passed null')
  t.throws(map(0), err, 'throws when passed falsey number')
  t.throws(map(1), err, 'throws when passed truthy number')
  t.throws(map(''), err, 'throws when passed falsey string')
  t.throws(map('string'), err, 'throws when passed truthy string')
  t.throws(map(false), err, 'throws when passed false')
  t.throws(map(true), err, 'throws when passed true')
  t.throws(map([]), err, 'throws when passed an array')
  t.throws(map({}), err, 'throws when passed an object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Const map functionality', t => {
  const spy = sinon.spy(identity)
  const x = 42

  const m = Const(Number)(x).map(spy)

  t.equal(m.type(), 'Const(Number)', 'returns a Const(Number)')
  t.notOk(spy.called, 'does not call the mapping function')
  t.equal(m.valueOf(), x, 'returns the original Const value')

  t.end()
})

test('Const map properties (Functor)', t => {
  const m = Const(Boolean)(false)

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).valueOf(), m.valueOf(), 'identity')
  t.equal(m.map(compose(f, g)).valueOf(), m.map(g).map(f).valueOf(), 'composition')

  t.end()
})

test('Const ap errors', t => {
  const m = MockCrock('joy')
  const nonMon = Const(Object)({ a: 45 })

  const ap = bindFunc(Const(String)('nice').ap)
  const err = /Const\(String\).ap: Const\(String\) required/
  t.throws(ap(undefined), err, 'throws when passed undefined')
  t.throws(ap(null), err, 'throws when passed null')
  t.throws(ap(0), err, 'throws when passed a falsey number')
  t.throws(ap(1), err, 'throws when passed a truthy number')
  t.throws(ap(''), err, 'throws when passed a falsey string')
  t.throws(ap('string'), err, 'throws when passed a truthy string')
  t.throws(ap(false), err, 'throws when passed false')
  t.throws(ap(true), err, 'throws when passed true')
  t.throws(ap([]), err, 'throws when passed an array')
  t.throws(ap({}), err, 'throws when passed an object')
  t.throws(ap(m), err, 'throws when container types differ')
  t.throws(ap(nonMon), err, 'throws when passed Const of different type')

  const nonCat = bindFunc(nonMon.ap)
  const semiErr = /Const\(Object\).ap: Must be fixed to a Semigroup/
  t.throws(nonCat(nonMon), semiErr, 'throws when pointed to non-Semigroup')

  t.end()
})

test('Const ap properties (Apply)', t => {
  const Arr = Const(Array)
  const m = Arr([ 1, 2, 3 ])

  const a = m.map(compose).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(m.map), 'implements the Functor spec')
  t.ok(isFunction(m.ap), 'provides an ap function')

  t.same(a.ap(Arr([ 4 ])).valueOf(), b.ap(Arr([ 4 ])).valueOf(), 'composition')

  t.end()
})

test('Const of errors', t => {
  const fn =
    bindFunc(Const(Number).of)

  const err = /Const\(Number\).of: Must be fixed to a Monoid/
  t.throws(fn(2), err, 'throws when not pointed to a Monoid')

  t.end()
})

test('Const of fantasy-land errors', t => {
  const fn =
    bindFunc(Const(Boolean)[fl.of])

  const err = /Const\(Boolean\).fantasy-land\/of: Must be fixed to a Monoid/
  t.throws(fn('matters not'), err, 'throws when not pointed to a Monoid')

  t.end()
})

test('Const of functionality', t => {
  const M = Const(Array)

  t.equal(M.of(0).type(), 'Const(Array)', 'returns a Const of Array')
  t.same(M.of(0).valueOf(), [], 'ignores value and returns empty Array')

  t.end()
})

test('Const of properties (Applicative)', t => {
  const Mon = Const(String)
  const m = Mon.of(identity)
  const j = Mon('value')

  t.ok(isFunction(j.of), 'provides an of function')
  t.ok(isFunction(j.ap), 'implements the Apply spec')

  t.equal(m.ap(j).valueOf().valueOf(), 'value', 'identity')

  t.equals(
    m.ap(Mon.of(3)).valueOf().valueOf(),
    Mon.of(identity(3)).valueOf().valueOf(),
    'homomorphism'
  )

  const a = x => m.ap(Mon.of(x)).valueOf()
  const b = x => Mon.of(applyTo(x)).ap(m).valueOf()

  t.equal(a(3).valueOf(), b(3).valueOf(), 'interchange')

  t.end()
})
