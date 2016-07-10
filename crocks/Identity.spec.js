const test  = require('tape')
const sinon = require('sinon')

const helpers   = require('../test/helpers')
const bindFunc  = helpers.bindFunc
const noop      = helpers.noop

const i_comb  = require('../combinators/i_comb')
const b_comb  = require('../combinators/b_comb')

const Identity = require('./Identity')

test('Identity', t => {
  const m = Identity(0)

  t.equal(typeof Identity, 'function', 'is a function')
  t.equal(m.toString(), '[object Object]', 'returns an object')

  t.equal(typeof m.value, 'function', 'provides a value function')
  t.equal(typeof m.type, 'function', 'provides a type function')

  t.throws(Identity, TypeError, 'throws when no parameters are passed')

  t.end()
})

test('Identity type', t => {
  t.equal(Identity(0).type(), 'Identity', 'type returns Identity')
  t.end()
})

test('Identity value', t => {
  const x = 'some value'
  t.equal(Identity(x).value(), x,'value returns the wrapped value' )

  t.end()
})

test('Identity equals functionality', t => {
  const a = Identity(0)
  const b = Identity(0)
  const c = Identity(1)

  const value       = 0
  const nonIdentity = { type: 'Identity...Not' }

  t.equals(a.equals(c), false, 'returns false when 2 Identities are not equal')
  t.equals(a.equals(b), true, 'returns true when 2 Identities are equal')
  t.equals(a.equals(value), false, 'returns false when passed a simple value')
  t.equals(a.equals(nonIdentity), false, 'returns false when passed a non-Maybe')

  t.end()
})

test('Identity equal algebras (Setoid)', t => {
  const a = Identity(0)
  const b = Identity(0)
  const c = Identity(1)
  const d = Identity(0)

  t.equals(typeof Identity(0).equals, 'function', 'provides an equals function')
  t.equals(a.equals(a), true, 'is reflexive')
  t.equals(a.equals(b), b.equals(a), 'has symmetry (equal)')
  t.equals(a.equals(c), c.equals(a), 'has symmetry (!equal)')
  t.equals(a.equals(b) && b.equals(d), a.equals(d), 'has transitivity')

  t.end()
})

test('Identity map errors', t => {
  const map = bindFunc(Identity(0).map)

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

test('Identity map functionality', t => {
  const spy = sinon.spy(i_comb)
  const x   = 42

  const m = Identity(x).map(spy)

  t.equal(m.type(), 'Identity', 'returns an Identity')
  t.equal(spy.called, true, 'calls mapping function')
  t.equal(m.value(), x, 'returns the result of the map inside of new Identity')

  t.end()
})

test('Identity map algebras (Functor)', t => {
  const m = Identity(49)

  const f = x => x + 54
  const g = x => x * 4

  t.equal(typeof m.map, 'function', 'provides a map function')

  t.equal(m.map(i_comb).value(), m.value(), 'provides identity')
  t.equal(m.map(b_comb(f, g)).value(), m.map(g).map(f).value(), 'provides composition')

  t.end()
})
