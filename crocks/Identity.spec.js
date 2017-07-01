const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const isArray = require('../predicates/isArray')
const isFunction = require('../predicates/isFunction')
const isObject = require('../predicates/isObject')
const isSameType = require('../predicates/isSameType')

const bindFunc = helpers.bindFunc
const unit = require('../helpers/unit')

const identity = require('../combinators/identity')
const composeB = require('../combinators/composeB')
const reverseApply = require('../combinators/reverseApply')

const MockCrock = require('../test/MockCrock')

const Identity = require('./Identity')

test('Identity', t => {
  const m = Identity(0)

  t.ok(isFunction(Identity), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Identity.of), 'provides an of function')
  t.ok(isFunction(Identity.type), 'provides a type function')

  t.throws(Identity, TypeError, 'throws with no parameters')

  t.end()
})

test('Identity @@implements', t => {
  const f = Identity['@@implements']

  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')
  t.equal(f('traverse'), true, 'implements traverse func')

  t.end()
})

test('Identity inspect', t => {
  const m = Identity(0)

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect(), 'Identity 0', 'returns inspect string')

  t.end()
})

test('Identity type', t => {
  const m = Identity(0)

  t.ok(isFunction(m.type), 'provides a type function')
  t.equal(m.type(), 'Identity', 'type returns Identity')
  t.end()
})

test('Identity value', t => {
  const x = 'some value'
  const m = Identity(x)

  t.ok(isFunction(m.value), 'is a function')
  t.equal(m.value(), x,'value returns the wrapped value' )

  t.end()
})

test('Identity equals functionality', t => {
  const a = Identity(0)
  const b = Identity(0)
  const c = Identity(1)

  const value = 0
  const nonIdentity = { type: 'Identity...Not' }

  t.equal(a.equals(c), false, 'returns false when 2 Identities are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Identities are equal')
  t.equal(a.equals(value), false, 'returns false when passed a simple value')
  t.equal(a.equals(nonIdentity), false, 'returns false when passed a non-Identity')

  t.end()
})

test('Identity equals properties (Setoid)', t => {
  const a = Identity(0)
  const b = Identity(0)
  const c = Identity(1)
  const d = Identity(0)

  t.ok(isFunction(Identity(0).equals), 'provides an equals function')
  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Identity concat errors', t => {
  const m = { type: () => 'Identity...Not' }

  const good = Identity([])

  const f = bindFunc(Identity([]).concat)
  const nonIdentErr = /Identity.concat: Identity of Semigroup required/

  t.throws(f(undefined), nonIdentErr, 'throws with undefined')
  t.throws(f(null), nonIdentErr, 'throws with null')
  t.throws(f(0), nonIdentErr, 'throws with falsey number')
  t.throws(f(1), nonIdentErr, 'throws with truthy number')
  t.throws(f(''), nonIdentErr, 'throws with falsey string')
  t.throws(f('string'), nonIdentErr, 'throws with truthy string')
  t.throws(f(false), nonIdentErr, 'throws with false')
  t.throws(f(true), nonIdentErr, 'throws with true')
  t.throws(f([]), nonIdentErr, 'throws with array')
  t.throws(f({}), nonIdentErr, 'throws with object')
  t.throws(f(m), nonIdentErr, 'throws with non-Identity')

  const innerErr = /Identity.concat: Both containers must contain Semigroups of the same type/
  const notSemi = bindFunc(x => Identity(x).concat(good))

  t.throws(notSemi(undefined), innerErr, 'throws with undefined on left')
  t.throws(notSemi(null), innerErr, 'throws with null on left')
  t.throws(notSemi(0), innerErr, 'throws with falsey number on left')
  t.throws(notSemi(1), innerErr, 'throws with truthy number on left')
  t.throws(notSemi(''), innerErr, 'throws with falsey string on left')
  t.throws(notSemi('string'), innerErr, 'throws with truthy string on left')
  t.throws(notSemi(false), innerErr, 'throws with false on left')
  t.throws(notSemi(true), innerErr, 'throws with true on left')
  t.throws(notSemi({}), innerErr, 'throws with object on left')

  const noMatch = bindFunc(() => good.concat(Identity('')))
  t.throws(noMatch({}), innerErr, 'throws with different semigroups')

  t.end()
})

test('Identity concat functionality', t => {
  const a = Identity([ 1, 2 ])
  const b = Identity([ 4, 3 ])

  const res = a.concat(b)

  t.ok(isSameType(Identity, res), 'returns another Identity')
  t.same(res.value(), [ 1, 2, 4, 3 ], 'concats the inner semigroup with Rights')

  t.end()
})

test('Identity concat properties (Semigroup)', t => {
  const extract =
    m => m.value()

  const a = Identity([ 'a' ])
  const b = Identity([ 'b' ])
  const c = Identity([ 'c' ])

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')

  t.same(extract(left), extract(right), 'associativity')
  t.ok(isArray(extract(a.concat(b))), 'returns an Array')

  t.end()
})

test('Identity map errors', t => {
  const map = bindFunc(Identity(0).map)

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
  t.doesNotThrow(map(unit))

  t.end()
})

test('Identity map functionality', t => {
  const spy = sinon.spy(identity)
  const x = 42

  const m = Identity(x).map(spy)

  t.equal(m.type(), 'Identity', 'returns an Identity')
  t.equal(spy.called, true, 'calls mapping function')
  t.equal(m.value(), x, 'returns the result of the map inside of new Identity')

  t.end()
})

test('Identity map properties (Functor)', t => {
  const m = Identity(49)

  const f = x => x + 54
  const g = x => x * 4

  t.ok(isFunction(m.map), 'provides a map function')

  t.equal(m.map(identity).value(), m.value(), 'identity')
  t.equal(m.map(composeB(f, g)).value(), m.map(g).map(f).value(), 'composition')

  t.end()
})

test('Identity ap errors', t => {
  const m = { type: () => 'Identity...Not' }

  t.throws(Identity(undefined).ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is undefined')
  t.throws(Identity(null).ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is null')
  t.throws(Identity(0).ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is a falsey number')
  t.throws(Identity(1).ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is a truthy number')
  t.throws(Identity('').ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is a falsey string')
  t.throws(Identity('string').ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is a truthy string')
  t.throws(Identity(false).ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is false')
  t.throws(Identity(true).ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is true')
  t.throws(Identity([]).ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is an array')
  t.throws(Identity({}).ap.bind(null, Identity(0)), TypeError, 'throws when wrapped value is an object')

  t.throws(Identity(unit).ap.bind(null, undefined), TypeError, 'throws when passed undefined')
  t.throws(Identity(unit).ap.bind(null, null), TypeError, 'throws when passed null')
  t.throws(Identity(unit).ap.bind(null, 0), TypeError, 'throws when passed a falsey number')
  t.throws(Identity(unit).ap.bind(null, 1), TypeError, 'throws when passed a truthy number')
  t.throws(Identity(unit).ap.bind(null, ''), TypeError, 'throws when passed a falsey string')
  t.throws(Identity(unit).ap.bind(null, 'string'), TypeError, 'throws when passed a truthy string')
  t.throws(Identity(unit).ap.bind(null, false), TypeError, 'throws when passed false')
  t.throws(Identity(unit).ap.bind(null, true), TypeError, 'throws when passed true')
  t.throws(Identity(unit).ap.bind(null, []), TypeError, 'throws when passed an array')
  t.throws(Identity(unit).ap.bind(null, {}), TypeError, 'throws when passed an object')

  t.throws(Identity(unit).ap.bind(null, m), TypeError, 'throws when container types differ')

  t.end()
})

test('Identity ap properties (Apply)', t => {
  const m = Identity(identity)

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(Identity(0).map), 'implements the Functor spec')
  t.ok(isFunction(Identity(0).ap), 'provides an ap function')

  t.equal(a.ap(Identity(3)).value(), b.ap(Identity(3)).value(), 'composition')

  t.end()
})

test('Identity of', t => {
  t.equal(Identity.of, Identity(0).of, 'Identity.of is the same as the instance version')
  t.equal(Identity.of(0).type(), 'Identity', 'returns an Identity')
  t.equal(Identity.of(0).value(), 0, 'wraps the value passed into an Identity')

  t.end()
})

test('Identity of properties (Applicative)', t => {
  const m = Identity(identity)

  t.ok(isFunction(Identity(0).of), 'provides an of function')
  t.ok(isFunction(Identity(0).ap), 'implements the Apply spec')

  t.equal(m.ap(Identity(3)).value(), 3, 'identity')
  t.equal(m.ap(Identity.of(3)).value(), Identity.of(identity(3)).value(), 'homomorphism')

  const a = x => m.ap(Identity.of(x))
  const b = x => Identity.of(reverseApply(x)).ap(m)

  t.equal(a(3).value(), b(3).value(), 'interchange')

  t.end()
})

test('Identity chain errors', t => {
  const chain = bindFunc(Identity(0).chain)

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
  t.throws(chain(unit), TypeError, 'throws with a non-Identity returning function')

  t.doesNotThrow(chain(Identity.of), 'allows an Identity returning function')

  t.end()
})

test('Identity chain properties (Chain)', t => {
  t.ok(isFunction(Identity(0).chain), 'provides a chain function')
  t.ok(isFunction(Identity(0).ap), 'implements the Apply spec')

  const f = x => Identity(x + 2)
  const g = x => Identity(x + 10)

  const a = x => Identity(x).chain(f).chain(g)
  const b = x => Identity(x).chain(y => f(y).chain(g))

  t.equal(a(10).value(), b(10).value(), 'assosiativity')

  t.end()
})

test('Identity chain properties (Monad)', t => {
  t.ok(isFunction(Identity(0).chain), 'implements the Chain spec')
  t.ok(isFunction(Identity(0).of), 'implements the Applicative spec')

  const f = x => Identity(x)

  t.equal(Identity.of(3).chain(f).value(), f(3).value(), 'left identity')

  t.equal(f(3).chain(Identity.of).value(), f(3).value(), 'right identity')

  t.end()
})

test('Identity sequence errors', t => {
  const seq = bindFunc(Identity(MockCrock(32)).sequence)
  const seqBad = bindFunc(Identity(0).sequence)

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
  t.doesNotThrow(seq(unit), 'allows a function')

  t.throws(seqBad(unit), TypeError, 'wrapping non-Applicative throws')

  t.end()
})

test('Identity sequence functionality', t => {
  const x = true
  const m = Identity(MockCrock(x)).sequence(MockCrock.of)

  t.equal(m.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(m.value().type(), 'Identity', 'Provides an inner type of Identity')
  t.equal(m.value().value(), x, 'Identity contains original inner value')

  t.end()
})

test('Identity traverse errors', t => {
  const trav = bindFunc(Identity(32).traverse)

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

  const noApply = bindFunc(x => Identity.of(x).traverse(MockCrock.of, identity))

  t.throws(noApply(undefined), TypeError, 'throws when second argument returns undefined')
  t.throws(noApply(null), TypeError, 'throws when second argument returns null')
  t.throws(noApply(0), TypeError, 'throws when second argument returns falsey number')
  t.throws(noApply(1), TypeError, 'throws when second argument returns truthy number')
  t.throws(noApply(''), TypeError, 'throws when second argument returns falsey string')
  t.throws(noApply('string'), TypeError, 'throws when second argument returns truthy string')
  t.throws(noApply(false), TypeError, 'throws when second argument returns false')
  t.throws(noApply(true), TypeError, 'throws when second argument returns true')
  t.throws(noApply({}), TypeError, 'throws when second argument returns an object')
  t.throws(noApply([]), TypeError, 'throws when second argument returns an array')
  t.throws(noApply(unit), TypeError, 'throws when second argument returns function')

  t.doesNotThrow(trav(unit, MockCrock), 'requires an Applicative returning function in second arg and function in first arg')

  t.end()
})

test('Identity traverse functionality', t => {
  const x = true
  const f = x => MockCrock(x)
  const m = Identity(x).traverse(f, MockCrock)

  t.equal(m.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(m.value().type(), 'Identity', 'Provides an inner type of Identity')
  t.equal(m.value().value(), x, 'Identity contains original inner value')

  t.end()
})
