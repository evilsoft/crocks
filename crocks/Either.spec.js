const test = require('tape')
const sinon = require('sinon')

const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isObject = require('../predicates/isObject')
const isFunction = require('../predicates/isFunction')

const composeB = require('../combinators/composeB')
const identity = require('../combinators/identity')
const constant = require('../combinators/constant')
const reverseApply = require('../combinators/reverseApply')

const MockCrock = require('../test/MockCrock')

const Either = require('./Either')

test('Either', t => {
  const m = Either(0)

  t.ok(isFunction(Either), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Either.of), 'provides an of function')
  t.ok(isFunction(Either.type), 'provides a type function')
  t.ok(isFunction(Either.Left), 'provides a Left function')
  t.ok(isFunction(Either.Right), 'provides a Right function')

  t.throws(Either, TypeError, 'throws with no parameters')

  t.end()
})

test('Either.Left', t => {
  const l = Either.Left('value')

  t.equal(l.either(identity, constant('right')), 'value', 'creates an Either.Left')

  t.end()
})

test('Either.Right', t => {
  const r = Either.Right('value')

  t.equal(r.either(constant('left'), identity), 'value', 'creates an Either.Right')

  t.end()
})

test('Either inspect', t => {
  const l = Either.Left(0)
  const r = Either.Right(1)

  t.ok(isFunction(l.inspect), 'Left provides an inspect function')
  t.ok(isFunction(r.inspect), 'Right provides an inpsect function')

  t.equal(l.inspect(), 'Either.Left 0', 'Left returns inspect string')
  t.equal(r.inspect(), 'Either.Right 1', 'Right returns inspect string')

  t.end()
})

test('Either type', t => {
  t.equal(Either(0).type(), 'Either', 'type returns Either')
  t.end()
})

test('Either value', t => {
  t.equal(Either.Left(23).value(), 23, 'value returns the left when isLeft')
  t.equal(Either.Right(98).value(), 98, 'value returns the right when isRight')

  t.end()
})

test('Either either', t => {
  const l = Either.Left('left')
  const r = Either.Right('right')

  const fn = bindFunc(Either.Right(23).either)

  t.throws(fn(), TypeError, 'throws when nothing passed')

  t.throws(fn(null, noop), TypeError, 'throws with null in left')
  t.throws(fn(undefined, noop), TypeError, 'throws with undefined in left')
  t.throws(fn(0, noop), TypeError, 'throws with falsey number in left')
  t.throws(fn(1, noop), TypeError, 'throws with truthy number in left')
  t.throws(fn('', noop), TypeError, 'throws with falsey string in left')
  t.throws(fn('string', noop), TypeError, 'throws with truthy string in left')
  t.throws(fn(false, noop), TypeError, 'throws with false in left')
  t.throws(fn(true, noop), TypeError, 'throws with true in left')
  t.throws(fn({}, noop), TypeError, 'throws with object in left')
  t.throws(fn([], noop), TypeError, 'throws with array in left')

  t.throws(fn(noop, null), TypeError, 'throws with null in right')
  t.throws(fn(noop, undefined), TypeError, 'throws with undefined in right')
  t.throws(fn(noop, 0), TypeError, 'throws with falsey number in right')
  t.throws(fn(noop, 1), TypeError, 'throws with truthy number in right')
  t.throws(fn(noop, ''), TypeError, 'throws with falsey string in right')
  t.throws(fn(noop, 'string'), TypeError, 'throws with truthy string in right')
  t.throws(fn(noop, false), TypeError, 'throws with false in right')
  t.throws(fn(noop, true), TypeError, 'throws with true in right')
  t.throws(fn(noop, {}), TypeError, 'throws with object in right')
  t.throws(fn(noop, []), TypeError, 'throws with array in right')

  t.equal(l.either(identity, constant('right')), 'left', 'returns left function result when called on a Left')
  t.equal(r.either(constant('left'), identity), 'right', 'returns right function result when called on a Right')

  t.end()
})

test('Either swap', t => {
  const fn = bindFunc(Either.Right(23).swap)

  t.throws(fn(null, noop), TypeError, 'throws with null in left')
  t.throws(fn(undefined, noop), TypeError, 'throws with undefined in left')
  t.throws(fn(0, noop), TypeError, 'throws with falsey number in left')
  t.throws(fn(1, noop), TypeError, 'throws with truthy number in left')
  t.throws(fn('', noop), TypeError, 'throws with falsey string in left')
  t.throws(fn('string', noop), TypeError, 'throws with truthy string in left')
  t.throws(fn(false, noop), TypeError, 'throws with false in left')
  t.throws(fn(true, noop), TypeError, 'throws with true in left')
  t.throws(fn({}, noop), TypeError, 'throws with object in left')
  t.throws(fn([], noop), TypeError, 'throws with array in left')

  t.throws(fn(noop, null), TypeError, 'throws with null in right')
  t.throws(fn(noop, undefined), TypeError, 'throws with undefined in right')
  t.throws(fn(noop, 0), TypeError, 'throws with falsey number in right')
  t.throws(fn(noop, 1), TypeError, 'throws with truthy number in right')
  t.throws(fn(noop, ''), TypeError, 'throws with falsey string in right')
  t.throws(fn(noop, 'string'), TypeError, 'throws with truthy string in right')
  t.throws(fn(noop, false), TypeError, 'throws with false in right')
  t.throws(fn(noop, true), TypeError, 'throws with true in right')
  t.throws(fn(noop, {}), TypeError, 'throws with object in right')
  t.throws(fn(noop, []), TypeError, 'throws with array in right')

  const l = Either.Left('here').swap(constant('left'), identity)
  const r = Either.Right('here').swap(identity, constant('right'))

  t.ok(l.equals(Either.Right('left')), 'returns an Either.Right wrapping left')
  t.ok(r.equals(Either.Left('right')), 'returns an Either.Left wrapping right')

  t.end()
})

test('Either coalesce', t => {
  const fn = bindFunc(Either.Right(23).coalesce)

  t.throws(fn(null, noop), TypeError, 'throws with null in left')
  t.throws(fn(undefined, noop), TypeError, 'throws with undefined in left')
  t.throws(fn(0, noop), TypeError, 'throws with falsey number in left')
  t.throws(fn(1, noop), TypeError, 'throws with truthy number in left')
  t.throws(fn('', noop), TypeError, 'throws with falsey string in left')
  t.throws(fn('string', noop), TypeError, 'throws with truthy string in left')
  t.throws(fn(false, noop), TypeError, 'throws with false in left')
  t.throws(fn(true, noop), TypeError, 'throws with true in left')
  t.throws(fn({}, noop), TypeError, 'throws with object in left')
  t.throws(fn([], noop), TypeError, 'throws with array in left')

  t.throws(fn(noop, null), TypeError, 'throws with null in right')
  t.throws(fn(noop, undefined), TypeError, 'throws with undefined in right')
  t.throws(fn(noop, 0), TypeError, 'throws with falsey number in right')
  t.throws(fn(noop, 1), TypeError, 'throws with truthy number in right')
  t.throws(fn(noop, ''), TypeError, 'throws with falsey string in right')
  t.throws(fn(noop, 'string'), TypeError, 'throws with truthy string in right')
  t.throws(fn(noop, false), TypeError, 'throws with false in right')
  t.throws(fn(noop, true), TypeError, 'throws with true in right')
  t.throws(fn(noop, {}), TypeError, 'throws with object in right')
  t.throws(fn(noop, []), TypeError, 'throws with array in right')

  const l = Either.Left('here').coalesce(constant('was left'), identity)
  const r = Either.Right('here').coalesce(identity, constant('was right'))

  t.ok(l.equals(Either.Right('was left')),'returns an Either.Right wrapping was left' )
  t.ok(r.equals(Either.Right('was right')),'returns an Either.Right wrapping was right' )

  t.end()
})

test('Either equals functionality', t => {
  const la = Either.Left(0)
  const lb = Either.Left(0)
  const lc = Either.Left(1)

  const ra = Either.Right(0)
  const rb = Either.Right(0)
  const rc = Either.Right(1)

  const value = 1
  const nonEither = { type: 'Either...Not' }

  t.equal(la.equals(lc), false, 'returns false when 2 Left Eithers are not equal')
  t.equal(la.equals(lb), true, 'returns true when 2 Left Eithers are equal')
  t.equal(lc.equals(value), false, 'returns when Left passed a simple value')

  t.equal(ra.equals(rc), false, 'returns false when 2 Right Eithers are not equal')
  t.equal(ra.equals(rb), true, 'returns true when 2 Right Eithers are equal')
  t.equal(rc.equals(value), false, 'returns when Right passed a simple value')

  t.equal(la.equals(nonEither), false, 'returns false when passed a non-Either')
  t.equal(ra.equals(lb), false, 'returns false when Left compared to Right')

  t.end()
})

test('Either equals properties (Setoid)', t => {
  const la = Either.Left(0)
  const lb = Either.Left(0)
  const lc = Either.Left(1)
  const ld = Either.Left(0)

  const ra = Either.Right(0)
  const rb = Either.Right(0)
  const rc = Either.Right(1)
  const rd = Either.Right(0)

  t.ok(isFunction(Either(null).equals), 'provides an equals function')

  t.equal(la.equals(la), true, 'Left reflexivity')
  t.equal(la.equals(lb), lb.equals(la), 'Left symmetry (equal)')
  t.equal(la.equals(lc), lc.equals(la), 'Left symmetry (!equal)')
  t.equal(la.equals(lb) && lb.equals(ld), la.equals(ld), 'Left transitivity')

  t.equal(ra.equals(ra), true, 'Right reflexivity')
  t.equal(ra.equals(rb), rb.equals(ra), 'Right symmetry (equal)')
  t.equal(ra.equals(rc), rc.equals(ra), 'Right symmetry (!equal)')
  t.equal(ra.equals(rb) && rb.equals(rd), ra.equals(rd), 'Right transitivity')

  t.end()
})

test('Either map errors', t => {
  const rmap = bindFunc(Either.Right(0).map)
  const lmap = bindFunc(Either.Left(0).map)

  t.throws(rmap(undefined), TypeError, 'right map throws with undefined')
  t.throws(rmap(null), TypeError, 'right map throws with null')
  t.throws(rmap(0), TypeError, 'right map throws with falsey number')
  t.throws(rmap(1), TypeError, 'right map throws with truthy number')
  t.throws(rmap(''), TypeError, 'right map throws with falsey string')
  t.throws(rmap('string'), TypeError, 'right map throws with truthy string')
  t.throws(rmap(false), TypeError, 'right map throws with false')
  t.throws(rmap(true), TypeError, 'right map throws with true')
  t.throws(rmap([]), TypeError, 'right map throws with an array')
  t.throws(rmap({}), TypeError, 'right map throws iwth object')
  t.doesNotThrow(rmap(noop), 'right map does not throw when passed a function')

  t.throws(lmap(undefined), TypeError, 'left map throws with undefined')
  t.throws(lmap(null), TypeError, 'left map throws with null')
  t.throws(lmap(0), TypeError, 'left map throws with falsey number')
  t.throws(lmap(1), TypeError, 'left map throws with truthy number')
  t.throws(lmap(''), TypeError, 'left map throws with falsey string')
  t.throws(lmap('string'), TypeError, 'left map throws with truthy string')
  t.throws(lmap(false), TypeError, 'left map throws with false')
  t.throws(lmap(true), TypeError, 'left map throws with true')
  t.throws(lmap([]), TypeError, 'left map throws with an array')
  t.throws(lmap({}), TypeError, 'left map throws iwth object')
  t.doesNotThrow(lmap(noop), 'left map does not throw when passed a function')
  t.end()
})

test('Either map functionality', t => {
  const lspy = sinon.spy(identity)
  const rspy = sinon.spy(identity)

  const l = Either.Left(0).map(lspy)
  const r = Either.Right(0).map(rspy)

  t.equal(l.type(), 'Either', 'returns an Either Type')
  t.equal(l.value(), 0, 'returns the original Left value')
  t.notOk(lspy.called, 'mapped function is never called when Left')

  t.equal(r.type(), 'Either', 'returns a Either type')
  t.equal(r.value(), 0, 'returns a Right Either with the same value when mapped with identity')
  t.ok(rspy.called, 'mapped function is called when Right')

  t.end()
})

test('Either map properties (Functor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  t.ok(isFunction(Either.Left(0).map), 'left provides a map function')
  t.ok(isFunction(Either.Right(0).map), 'right provides a map function')

  t.equal(Either.Right(30).map(identity).value(), 30, 'Right identity')
  t.equal(Either.Right(10).map(x => f(g(x))).value(), Either.Right(10).map(g).map(f).value(), 'Right composition')

  t.equal(Either.Left(45).map(identity).value(), 45, 'Left identity')
  t.equal(Either.Left(10).map(x => f(g(x))).value(), Either.Left(10).map(g).map(f).value(), 'Left composition')

  t.end()
})

test('Either bimap errors', t => {
  const bimap = bindFunc(Either.Right('popcorn').bimap)

  t.throws(bimap(undefined, noop), TypeError, 'throws with undefined in first argument')
  t.throws(bimap(null, noop), TypeError, 'throws with null in first argument')
  t.throws(bimap(0, noop), TypeError, 'throws with falsey number in first argument')
  t.throws(bimap(1, noop), TypeError, 'throws with truthy number in first argument')
  t.throws(bimap('', noop), TypeError, 'throws with falsey string in first argument')
  t.throws(bimap('string', noop), TypeError, 'throws with truthy string in first argument')
  t.throws(bimap(false, noop), TypeError, 'throws with false in first argument')
  t.throws(bimap(true, noop), TypeError, 'throws with true in first argument')
  t.throws(bimap([], noop), TypeError, 'throws with an array in first argument')
  t.throws(bimap({}, noop), TypeError, 'throws with object in first argument')

  t.throws(bimap(noop, undefined), TypeError, 'throws with undefined in second argument')
  t.throws(bimap(noop, null), TypeError, 'throws with null in second argument')
  t.throws(bimap(noop, 0), TypeError, 'throws with falsey number in second argument')
  t.throws(bimap(noop, 1), TypeError, 'throws with truthy number in second argument')
  t.throws(bimap(noop, ''), TypeError, 'throws with falsey string in second argument')
  t.throws(bimap(noop, 'string'), TypeError, 'throws with truthy string in second argument')
  t.throws(bimap(noop, false), TypeError, 'throws with false in second argument')
  t.throws(bimap(noop, true), TypeError, 'throws with true in second argument')
  t.throws(bimap(noop, []), TypeError, 'throws with an array in second argument')
  t.throws(bimap(noop, {}), TypeError, 'throws with object in second argument')

  t.doesNotThrow(bimap(noop, noop), 'allows functions')

  t.end()
})

test('Either ap errors', t => {
  const m = { type: () => 'Either...Not' }

  t.throws(Either.of(0).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is a falsey number')
  t.throws(Either.of(1).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is a truthy number')
  t.throws(Either.of('').ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is a falsey string')
  t.throws(Either.of('string').ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is a truthy string')
  t.throws(Either.of(false).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is false')
  t.throws(Either.of(true).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is true')
  t.throws(Either.of([]).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is an array')
  t.throws(Either.of({}).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is an object')

  t.doesNotThrow(Either.Left(0).ap.bind(null, Either.of(0)), 'does not throw when ap on Left')

  t.throws(Either.of(noop).ap.bind(null, 0), TypeError, 'throws when passed a falsey number')
  t.throws(Either.of(noop).ap.bind(null, 1), TypeError, 'throws when passed a truthy number')
  t.throws(Either.of(noop).ap.bind(null, ''), TypeError, 'throws when passed a falsey string')
  t.throws(Either.of(noop).ap.bind(null, 'string'), TypeError, 'throws when passed a truthy string')
  t.throws(Either.of(noop).ap.bind(null, false), TypeError, 'throws when passed false')
  t.throws(Either.of(noop).ap.bind(null, true), TypeError, 'throws when passed true')
  t.throws(Either.of(noop).ap.bind(null, []), TypeError, 'throws when passed an array')
  t.throws(Either.of(noop).ap.bind(null, {}), TypeError, 'throws when passed an object')

  t.doesNotThrow(Either.Left(noop).ap.bind(null, Either.of(0)), 'does not throw when ap on Left')

  t.throws(Either.of(noop).ap.bind(null, m), TypeError, 'throws when container types differ on Right')
  t.doesNotThrow(Either.Left(noop).ap.bind(null, m), 'does not throws when container types differ on Left')

  t.end()
})

test('Either ap properties (Apply)', t => {
  const m = Either.Right(identity)

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(m.ap), 'provides an ap function')
  t.ok(isFunction(m.map), 'implements the Functor spec')

  t.equal(a.ap(Either.Right(3)).value(), b.ap(Either.Right(3)).value(), 'composition Right')

  t.end()
})

test('Either of', t => {
  t.equal(Either.of, Either(0).of, 'Either.of is the same as the instance version')
  t.equal(Either.of(0).type(), 'Either', 'returns an Either')
  t.equal(Either.of(0).either(constant('left'), identity), 0, 'wraps the value into an Either.Right')

  t.end()
})

test('Either of properties (Applicative)', t => {
  const r = Either.Right(identity)
  const l = Either.Left('left')

  t.ok(isFunction(r.of), 'Right provides an of function')
  t.ok(isFunction(l.of), 'Left provides an of function')
  t.ok(isFunction(r.ap), 'Right implements the Apply spec')
  t.ok(isFunction(l.ap), 'Left implements the Apply spec')

  t.equal(r.ap(Either.Right(3)).value(), 3, 'identity Right')
  t.equal(r.ap(Either.of(3)).value(), Either.of(identity(3)).value(), 'homomorphism Right')

  const a = x => r.ap(Either.of(x))
  const b = x => Either.of(reverseApply(x)).ap(r)

  t.equal(a(3).value(), b(3).value(), 'interchange Right')

  t.end()
})

test('Either chain errors', t => {
  const rchain = bindFunc(Either.Right(0).chain)
  const lchain = bindFunc(Either.Left(0).chain)

  t.throws(rchain(undefined), TypeError, 'Right throws with undefined')
  t.throws(rchain(null), TypeError, 'Right throws with null')
  t.throws(rchain(0), TypeError, 'Right throws falsey with number')
  t.throws(rchain(1), TypeError, 'Right throws truthy with number')
  t.throws(rchain(''), TypeError, 'Right throws falsey with string')
  t.throws(rchain('string'), TypeError, 'Right throws with truthy string')
  t.throws(rchain(false), TypeError, 'Right throws with false')
  t.throws(rchain(true), TypeError, 'Right throws with true')
  t.throws(rchain([]), TypeError, 'Right throws with an array')
  t.throws(rchain({}), TypeError, 'Right throws with an object')
  t.throws(rchain(noop), TypeError, 'Right throws with a non Either returning function')
  t.doesNotThrow(rchain(Either.of), 'Right allows a function')

  t.throws(lchain(undefined), TypeError, 'Left throws with undefined')
  t.throws(lchain(null), TypeError, 'Left throws with null')
  t.throws(lchain(0), TypeError, 'Left throws with falsey number')
  t.throws(lchain(1), TypeError, 'Left throws with truthy number')
  t.throws(lchain(''), TypeError, 'Left throws with falsey string')
  t.throws(lchain('string'), TypeError, 'Left throws with truthy string')
  t.throws(lchain(false), TypeError, 'Left throws with false')
  t.throws(lchain(true), TypeError, 'Left throws with true')
  t.throws(lchain([]), TypeError, 'Left throws with an array')
  t.throws(lchain({}), TypeError, 'Left throws with an object')
  t.doesNotThrow(lchain(noop), 'Left allows any function')

  t.end()
})

test('Either chain properties (Chain)', t => {
  t.ok(isFunction(Either.Right(0).chain), 'Right provides a chain function')
  t.ok(isFunction(Either.Right(0).ap), 'Right implements the Apply spec')

  t.ok(isFunction(Either.Left(0).chain), 'Left provides a chain function')
  t.ok(isFunction(Either.Left(0).ap), 'Leftimplements the Apply spec')

  const f = x => Either.Right(x + 2)
  const g = x => Either.Right(x + 10)

  const a = x => Either.Right(x).chain(f).chain(g)
  const b = x => Either.Right(x).chain(y => f(y).chain(g))

  t.equal(a(10).value(), b(10).value(), 'assosiativity Right')

  t.end()
})

test('Either chain properties (Monad)', t => {
  t.ok(isFunction(Either.Right(0).chain), 'Right implements the Chain spec')
  t.ok(isFunction(Either.Right(0).of), 'Right implements the Applicative spec')

  const f = x => Either.Right(x)

  t.equal(Either.of(3).chain(f).value(), f(3).value(), 'left identity Right')

  const m = x => Either.Right(x)

  t.equal(m(3).chain(Either.of).value(), m(3).value(), 'right identity Right')

  t.end()
})

test('Either sequence errors', t => {
  const rseq = bindFunc(Either.Right(MockCrock(0)).sequence)
  const lseq = bindFunc(Either.Left('Left').sequence)

  const rseqBad = bindFunc(Either.Right(0).sequence)
  const lseqBad = bindFunc(Either.Left(0).sequence)

  t.throws(rseq(undefined), TypeError, 'Right throws with undefined')
  t.throws(rseq(null), TypeError, 'Right throws with null')
  t.throws(rseq(0), TypeError, 'Right throws falsey with number')
  t.throws(rseq(1), TypeError, 'Right throws truthy with number')
  t.throws(rseq(''), TypeError, 'Right throws falsey with string')
  t.throws(rseq('string'), TypeError, 'Right throws with truthy string')
  t.throws(rseq(false), TypeError, 'Right throws with false')
  t.throws(rseq(true), TypeError, 'Right throws with true')
  t.throws(rseq([]), TypeError, 'Right throws with an array')
  t.throws(rseq({}), TypeError, 'Right throws with an object')
  t.doesNotThrow(rseq(noop), 'Right allows a function')

  t.throws(lseq(undefined), TypeError, 'Left throws with undefined')
  t.throws(lseq(null), TypeError, 'Left throws with null')
  t.throws(lseq(0), TypeError, 'Left throws with falsey number')
  t.throws(lseq(1), TypeError, 'Left throws with truthy number')
  t.throws(lseq(''), TypeError, 'Left throws with falsey string')
  t.throws(lseq('string'), TypeError, 'Left throws with truthy string')
  t.throws(lseq(false), TypeError, 'Left throws with false')
  t.throws(lseq(true), TypeError, 'Left throws with true')
  t.throws(lseq([]), TypeError, 'Left throws with an array')
  t.throws(lseq({}), TypeError, 'Left throws with an object')
  t.doesNotThrow(lseq(noop), 'Left allows a function')

  t.throws(rseqBad(noop), TypeError, 'Right without wrapping Applicative throws')
  t.doesNotThrow(lseqBad(noop), 'allows Left without wrapping Applicative')

  t.end()
})

test('Either sequence functionality', t => {
  const x = 284
  const r = Either.Right(MockCrock(x)).sequence(MockCrock.of)
  const l = Either.Left('Left').sequence(MockCrock.of)

  t.equal(r.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(r.value().type(), 'Either', 'Provides an inner type of Either')
  t.equal(r.value().value(), x, 'Either contains original inner value')

  t.equal(l.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(l.value().type(), 'Either', 'Provides an inner type of Either')
  t.equal(l.value().value(), 'Left', 'Either contains original Left value')

  t.end()
})

test('Either traverse errors', t => {
  const rtrav = bindFunc(Either.Right(0).traverse)
  const ltrav = bindFunc(Either.Left('Left').traverse)

  const f = x => MockCrock(x)

  t.throws(rtrav(undefined, noop), TypeError, 'Right throws with undefined in first argument')
  t.throws(rtrav(null, noop), TypeError, 'Right throws with null in first argument')
  t.throws(rtrav(0, noop), TypeError, 'Right throws falsey with number in first argument')
  t.throws(rtrav(1, noop), TypeError, 'Right throws truthy with number in first argument')
  t.throws(rtrav('', noop), TypeError, 'Right throws falsey with string in first argument')
  t.throws(rtrav('string', noop), TypeError, 'Right throws with truthy string in first argument')
  t.throws(rtrav(false, noop), TypeError, 'Right throws with false in first argument')
  t.throws(rtrav(true, noop), TypeError, 'Right throws with true in first argument')
  t.throws(rtrav([], noop), TypeError, 'Right throws with an array in first argument')
  t.throws(rtrav({}, noop), TypeError, 'Right throws with an object in first argument')

  t.throws(rtrav(f, undefined), TypeError, 'Right throws with undefined in second argument')
  t.throws(rtrav(f, null), TypeError, 'Right throws with null in second argument')
  t.throws(rtrav(f, 0), TypeError, 'Right throws falsey with number in second argument')
  t.throws(rtrav(f, 1), TypeError, 'Right throws truthy with number in second argument')
  t.throws(rtrav(f, ''), TypeError, 'Right throws falsey with string in second argument')
  t.throws(rtrav(f, 'string'), TypeError, 'Right throws with truthy string in second argument')
  t.throws(rtrav(f, false), TypeError, 'Right throws with false in second argument')
  t.throws(rtrav(f, true), TypeError, 'Right throws with true in second argument')
  t.throws(rtrav(f, []), TypeError, 'Right throws with an array in second argument')
  t.throws(rtrav(f, {}), TypeError, 'Right throws with an object in second argument')
  t.throws(rtrav(noop, noop), TypeError, 'Right throws when first function does not return an Applicaitve')

  t.doesNotThrow(rtrav(noop, f), 'Right requires an Applicative returning function in second argument')

  t.throws(ltrav(undefined, MockCrock), TypeError, 'Left throws with undefined in first argument')
  t.throws(ltrav(null, MockCrock), TypeError, 'Left throws with null in first argument')
  t.throws(ltrav(0, MockCrock), TypeError, 'Left throws with falsey number in first argument')
  t.throws(ltrav(1, MockCrock), TypeError, 'Left throws with truthy number in first argument')
  t.throws(ltrav('', MockCrock), TypeError, 'Left throws with falsey string in first argument')
  t.throws(ltrav('string', MockCrock), TypeError, 'Left throws with truthy string in first argument')
  t.throws(ltrav(false, MockCrock), TypeError, 'Left throws with false in first argument')
  t.throws(ltrav(true, MockCrock), TypeError, 'Left throws with true in first argument')
  t.throws(ltrav([], MockCrock), TypeError, 'Left throws with an array in first argument')
  t.throws(ltrav({}, MockCrock), TypeError, 'Left throws with an object in first argument')

  t.throws(ltrav(noop, undefined), TypeError, 'Left throws with undefined in second argument')
  t.throws(ltrav(noop, null), TypeError, 'Left throws with null in second argument')
  t.throws(ltrav(noop, 0), TypeError, 'Left throws falsey with number in second argument')
  t.throws(ltrav(noop, 1), TypeError, 'Left throws truthy with number in second argument')
  t.throws(ltrav(noop, ''), TypeError, 'Left throws falsey with string in second argument')
  t.throws(ltrav(noop, 'string'), TypeError, 'Left throws with truthy string in second argument')
  t.throws(ltrav(noop, false), TypeError, 'Left throws with false in second argument')
  t.throws(ltrav(noop, true), TypeError, 'Left throws with true in second argument')
  t.throws(ltrav(noop, []), TypeError, 'Left throws with an array in second argument')
  t.throws(ltrav(noop, {}), TypeError, 'Left throws with an object in second argument')
  t.throws(ltrav(noop, noop), TypeError, 'Left throws when second function does not return an Applicaitve')

  t.doesNotThrow(ltrav(MockCrock, noop), 'Left requires an Applicative returning function in the first arg')

  t.end()
})

test('Either traverse functionality', t => {
  const x = 284
  const f = x => MockCrock(x)
  const r = Either.Right(x).traverse(f, MockCrock)
  const l = Either.Left('Left').traverse(f, MockCrock)

  t.equal(r.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(r.value().type(), 'Either', 'Provides an inner type of Either')
  t.equal(r.value().value(), x, 'Either contains original inner value')

  t.equal(l.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(l.value().type(), 'Either', 'Provides an inner type of Either')
  t.equal(l.value().value(), 'Left', 'Either contains original Left value')

  t.end()
})
