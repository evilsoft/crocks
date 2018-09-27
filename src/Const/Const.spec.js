const test = require('tape')
const sinon = require('sinon')
const MockCrock = require('../test/MockCrock')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isFunction  = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')
const unit = require('../core/_unit')

const fl = require('../core/flNames')

const laws = require('../test/laws')
const equals = require('../core/equals')

const Const = require('.')

const identity = x => x

test('Const', t => {
  const m = Const(0)

  t.ok(isFunction(Const), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Const.type), 'provides a type function')
  t.ok(isString(Const['@@type']), 'provides a @@type string')

  t.equals(Const(true).constructor, Const, 'provides TypeRep on constructor')

  t.throws(Const, TypeError, 'throws with no parameters')

  t.end()
})

test('Const fantasy-land api', t => {
  const m = Const('always')

  t.ok(isFunction(m[fl.equals]), 'provides equals method on instance')
  t.ok(isFunction(m[fl.concat]), 'provides concat method on instance')
  t.ok(isFunction(m[fl.map]), 'provides map method on instance')
  t.ok(isFunction(m[fl.chain]), 'provides chain method on instance')

  t.end()
})

test('Const @@implements', t => {
  const f = Const['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')

  t.end()
})

test('Const inspect', t => {
  const m = Const(0)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect, m.toString, 'toString is the same function as inspect')
  t.equal(m.inspect(), 'Const 0', 'returns inspect string')

  t.end()
})

test('Const type', t => {
  const m = Const(0)

  t.ok(isFunction(m.type), 'provides a type function')
  t.equal(m.type(), 'Const', 'type returns Const')

  t.end()
})

test('Const @@type', t => {
  const m = Const(0)

  t.equal(m['@@type'], Const['@@type'], 'static and instance versions are the same')
  t.equal(m['@@type'], 'crocks/Const@2', 'type returns crocks/Const@2')

  t.end()
})

test('Const valueOf', t => {
  const x = 'some value'
  const m = Const(x)

  t.ok(isFunction(m.valueOf), 'is a function')
  t.equal(m.valueOf(), x,'valueOf returns the wrapped value' )

  t.end()
})

test('Const equals functionality', t => {
  const a = Const(0)
  const b = Const(0)
  const c = Const(1)

  const value = 0
  const nonConst = MockCrock(value)

  t.equal(a.equals(c), false, 'returns false when 2 Consts are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Consts are equal')
  t.equal(a.equals(value), false, 'returns false when passed a simple value')
  t.equal(a.equals(nonConst), false, 'returns false when passed a non-Const')

  t.end()
})

test('Const equals properties (Setoid)', t => {
  const a = Const({ a: true })
  const b = Const({ a: true })
  const c = Const({ a: true, b: 'not' })
  const d = Const({ a: true })

  t.ok(isFunction(Const(0).equals), 'provides an equals function')
  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Const concat properties (Semigroup)', t => {
  const a = Const(0)
  const b = Const(true)
  const c = Const('')

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(left.valueOf(), right.valueOf(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns a Const')

  t.end()
})

test('Const concat functionality', t => {
  const a = Const(89)
  const b = Const(false)

  const notConst = MockCrock()

  const cat = bindFunc(a.concat)

  const err = /Const.concat: Const required/
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

  t.equal(a.concat(b).valueOf(), 89, 'reports first Const - a')
  t.equal(b.concat(a).valueOf(), false, 'reports first Const - b')

  t.end()
})

test('Const concat fantasy-land errors', t => {
  const a = Const(89)
  const notConst = MockCrock()

  const cat = bindFunc(a[fl.concat])

  const err = /Const.fantasy-land\/concat: Const required/
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

  t.end()
})

test('Const map errors', t => {
  const map = bindFunc(Const(0).map)

  const err = /Const.map: Function required/
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

  t.doesNotThrow(map(unit))

  t.end()
})

test('Const map fantasy-land errors', t => {
  const map = bindFunc(Const(0)[fl.map])

  const err = /Const.fantasy-land\/map: Function required/
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

  t.doesNotThrow(map(unit))

  t.end()
})

test('Const map functionality', t => {
  const spy = sinon.spy(x => x + 2)
  const x = 42

  const m = Const(x).map(spy)

  t.equal(m.type(), 'Const', 'returns a Const')
  t.notOk(spy.called, 'does not call the mapping function')
  t.equal(m.valueOf(), x, 'returns the original Const')

  t.end()
})

test('Const map properties (Functor)', t => {
  const m = Const(10)

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).valueOf(), m.valueOf(), 'identity')
  t.equal(m.map(compose(f, g)).valueOf(), m.map(g).map(f).valueOf(), 'composition')

  t.end()
})

test('Const ap errors', t => {
  const m = MockCrock('joy')
  const ap = bindFunc(Const(32).ap)

  const err = /Const.ap: Const required/
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

  t.end()
})

test('Const ap properties (Apply)', t => {
  const m = Const({ some: 'thing' })

  const a = m.map(compose).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(Const(0).map), 'implements the Functor spec')
  t.ok(isFunction(Const(0).ap), 'provides an ap function')

  t.same(a.ap(Const(3)).valueOf(), b.ap(Const(3)).valueOf(), 'composition')

  t.end()
})

test('Const chain errors', t => {
  const chain = bindFunc(Const(0).chain)

  const err = /Const.chain: Function required/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws with null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  t.doesNotThrow(chain(unit), 'allows a function, of any kind')

  t.end()
})

test('Const chain fantasy-land errors', t => {
  const chain = bindFunc(Const(0)[fl.chain])

  const err = /Const.fantasy-land\/chain: Function required/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws with null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  t.doesNotThrow(chain(unit), 'allows a function, of any kind')

  t.end()
})

test('Const chain properties (Chain)', t => {
  t.ok(isFunction(Const(0).chain), 'provides a chain function')
  t.ok(isFunction(Const(0).ap), 'implements the Apply spec')

  const f = x => Const(x + 2)
  const g = x => Const(x + 10)

  const a = x => Const(x).chain(f).chain(g)
  const b = x => Const(x).chain(y => f(y).chain(g))

  t.equal(a(10).valueOf(), b(10).valueOf(), 'assosiativity')

  t.end()
})

const logEquals = (a, b) => {
  // console.log('Now comparing:', typeof a.valueOf(), typeof b.valueOf())
  return equals(a, b)
}

test('Const applyTo properties (Apply)', t => {
  const apply = laws['fl/apply'](Const)

  t.ok(apply.composition(logEquals, Const.of(x => x * 3), Const.of(x => x + 4), Const.of(5)), 'composition')

  t.end()
})

test('Const applyTo properties (Applicative)', t => {
  const applicative = laws['fl/applicative'](Const)

  t.ok(applicative.identity(logEquals, 5), 'identity')
  t.ok(applicative.homomorphism(logEquals, x => x * 3, 18), 'homomorphism')
  t.ok(applicative.interchange(logEquals, Const.of(x => x +10), 23), 'interchange')

  t.end()
})
