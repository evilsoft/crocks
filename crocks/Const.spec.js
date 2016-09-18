const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isObject = require('../internal/isObject')
const isFunction  = require('../internal/isFunction')

const identity = require('../combinators/identity')
const composeB = require('../combinators/composeB')

const MockCrock = require('../test/MockCrock')

const Const = require('./Const')

test('Const', t => {
  const m = Const(0)

  t.ok(isFunction(Const), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Const.type), 'provides a type function')

  t.throws(Const, TypeError, 'throws with no parameters')

  t.end()
})

test('Const inspect', t => {
  const m = Const(0)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect(), 'Const 0', 'returns inspect string')

  t.end()
})

test('Const type', t => {
  const m = Const(0)

  t.ok(isFunction(m.type), 'provides a type function')
  t.equal(m.type(), 'Const', 'type returns Const')

  t.end()
})

test('Const value', t => {
  const x = 'some value'
  const m = Const(x)

  t.ok(isFunction(m.value), 'is a function')
  t.equal(m.value(), x,'value returns the wrapped value' )

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
  const a = Const(0)
  const b = Const(0)
  const c = Const(1)
  const d = Const(0)

  t.ok(isFunction(Const(0).equals), 'provides an equals function')
  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Const concat properties (Semigoup)', t => {
  const a = Const(0)
  const b = Const(true)
  const c = Const('')

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')
  t.equal(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns a Const')

  t.end()
})

test('Const concat functionality', t => {
  const a = Const(89)
  const b = Const(false)

  const notConst = MockCrock()

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
  t.throws(cat(notConst), TypeError, 'throws when passed non-Const')

  t.equal(a.concat(b).value(), 89, 'reports first Const - a')
  t.equal(b.concat(a).value(), false, 'reports first Const - b')

  t.end()
})

test('Const map errors', t => {
  const map = bindFunc(Const(0).map)

  t.throws(map(undefined), TypeError, 'throws when passed undefined')
  t.throws(map(null), TypeError, 'throws when passed null')
  t.throws(map(0), TypeError, 'throws when passed falsey number')
  t.throws(map(1), TypeError, 'throws when passed truthy number')
  t.throws(map(''), TypeError, 'throws when passed falsey string')
  t.throws(map('string'), TypeError, 'throws when passed truthy string')
  t.throws(map(false), TypeError, 'throws when passed false')
  t.throws(map(true), TypeError, 'throws when passed true')
  t.throws(map([]), TypeError, 'throws when passed an array')
  t.throws(map({}), TypeError, 'throws when passed an object')
  t.doesNotThrow(map(noop))

  t.end()
})

test('Const map functionality', t => {
  const spy = sinon.spy(x => x + 2)
  const x = 42

  const m = Const(x).map(spy)

  t.equal(m.type(), 'Const', 'returns a Const')
  t.notOk(spy.called, 'does not call the mapping function')
  t.equal(m.value(), x, 'returns the original Const')

  t.end()
})

test('Const map properties (Functor)', t => {
  const m = Const(10)

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).value(), m.value(), 'identity')
  t.equal(m.map(composeB(f, g)).value(), m.map(g).map(f).value(), 'composition')

  t.end()
})

test('Const ap errors', t => {
  const m = MockCrock('joy')
  const ap = bindFunc(Const(32).ap)

  t.throws(ap(undefined), TypeError, 'throws when passed undefined')
  t.throws(ap(null), TypeError, 'throws when passed null')
  t.throws(ap(0), TypeError, 'throws when passed a falsey number')
  t.throws(ap(1), TypeError, 'throws when passed a truthy number')
  t.throws(ap(''), TypeError, 'throws when passed a falsey string')
  t.throws(ap('string'), TypeError, 'throws when passed a truthy string')
  t.throws(ap(false), TypeError, 'throws when passed false')
  t.throws(ap(true), TypeError, 'throws when passed true')
  t.throws(ap([]), TypeError, 'throws when passed an array')
  t.throws(ap({}), TypeError, 'throws when passed an object')

  t.throws(ap(m), TypeError, 'throws when container types differ')

  t.end()
})

test('Const ap properties (Apply)', t => {
  const m = Const({ some: 'thing' })

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(Const(0).map), 'implements the Functor spec')
  t.ok(isFunction(Const(0).ap), 'provides an ap function')

  t.same(a.ap(Const(3)).value(), b.ap(Const(3)).value(), 'composition')

  t.end()
})

test('Const chain errors', t => {
  const chain = bindFunc(Const(0).chain)

  t.throws(chain(undefined), TypeError, 'throws with undefined')
  t.throws(chain(null), TypeError, 'throws with null')
  t.throws(chain(0), TypeError, 'throws with falsey number')
  t.throws(chain(1), TypeError, 'throws with truthy number')
  t.throws(chain(''), TypeError, 'throws with falsey string')
  t.throws(chain('string'), TypeError, 'throws with truthy string')
  t.throws(chain(false), TypeError, 'throws with false')
  t.throws(chain(true), TypeError, 'throws with true')
  t.throws(chain([]), TypeError, 'throws with an array')
  t.throws(chain({}), TypeError, 'throws with an object')

  t.doesNotThrow(chain(noop), 'allows a function, of any kind')

  t.end()
})

test('Const chain properties (Chain)', t => {
  t.ok(isFunction(Const(0).chain), 'provides a chain function')
  t.ok(isFunction(Const(0).ap), 'implements the Apply spec')

  const f = x => Const(x + 2)
  const g = x => Const(x + 10)

  const a = x => Const(x).chain(f).chain(g)
  const b = x => Const(x).chain(y => f(y).chain(g))

  t.equal(a(10).value(), b(10).value(), 'assosiativity')

  t.end()
})
