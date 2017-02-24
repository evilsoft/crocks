const test = require('tape')
const sinon = require('sinon')

const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc

const isArray = require('../predicates/isArray')
const isFunction = require('../predicates/isFunction')
const isObject = require('../predicates/isObject')
const isSameType = require('../predicates/isSameType')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const either = require('../pointfree/either')
const identity = require('../combinators/identity')
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

test('Either concat errors', t => {
  const m = { type: () => 'Either...Not' }

  const good = Either.Right([])
  const bad = Either.Left([])

  const f = bindFunc(Either.Right([]).concat)
  const nonEitherErr = /Either.concat: Either of Semigroup required/

  t.throws(f(undefined), nonEitherErr, 'throws with undefined on Right')
  t.throws(f(null), nonEitherErr, 'throws with null on Right')
  t.throws(f(0), nonEitherErr, 'throws with falsey number on Right')
  t.throws(f(1), nonEitherErr, 'throws with truthy number on Right')
  t.throws(f(''), nonEitherErr, 'throws with falsey string on Right')
  t.throws(f('string'), nonEitherErr, 'throws with truthy string on Right')
  t.throws(f(false), nonEitherErr, 'throws with false on Right')
  t.throws(f(true), nonEitherErr, 'throws with true on Right')
  t.throws(f([]), nonEitherErr, 'throws with array on Right')
  t.throws(f({}), nonEitherErr, 'throws with object on Right')
  t.throws(f(m), nonEitherErr, 'throws with non-Either on Right')

  const g = bindFunc(Either.Left(0).concat)

  t.throws(g(undefined), nonEitherErr, 'throws with undefined on Left')
  t.throws(g(null), nonEitherErr, 'throws with null on Left')
  t.throws(g(0), nonEitherErr, 'throws with falsey number on Left')
  t.throws(g(1), nonEitherErr, 'throws with truthy number on Left')
  t.throws(g(''), nonEitherErr, 'throws with falsey string on Left')
  t.throws(g('string'), nonEitherErr, 'throws with truthy string on Left')
  t.throws(g(false), nonEitherErr, 'throws with false on Left')
  t.throws(g(true), nonEitherErr, 'throws with true on Left')
  t.throws(g([]), nonEitherErr, 'throws with array on Left')
  t.throws(g({}), nonEitherErr, 'throws with object on Left')
  t.throws(g(m), nonEitherErr, 'throws with non-Either on Left')

  const innerErr = /Either.concat: Both containers must contain Semigroups of the same type/
  const notSemiLeft = bindFunc(x => Either.Right(x).concat(good))

  t.throws(notSemiLeft(undefined), innerErr, 'throws with undefined on left')
  t.throws(notSemiLeft(null), innerErr, 'throws with null on left')
  t.throws(notSemiLeft(0), innerErr, 'throws with falsey number on left')
  t.throws(notSemiLeft(1), innerErr, 'throws with truthy number on left')
  t.throws(notSemiLeft(''), innerErr, 'throws with falsey string on left')
  t.throws(notSemiLeft('string'), innerErr, 'throws with truthy string on left')
  t.throws(notSemiLeft(false), innerErr, 'throws with false on left')
  t.throws(notSemiLeft(true), innerErr, 'throws with true on left')
  t.throws(notSemiLeft({}), innerErr, 'throws with object on left')

  const notSemiRight = bindFunc(x => good.concat(Either.Right(x)))

  t.throws(notSemiRight(undefined), innerErr, 'throws with undefined on right')
  t.throws(notSemiRight(null), innerErr, 'throws with null on right')
  t.throws(notSemiRight(0), innerErr, 'throws with falsey number on right')
  t.throws(notSemiRight(1), innerErr, 'throws with truthy number on right')
  t.throws(notSemiRight(''), innerErr, 'throws with falsey string on right')
  t.throws(notSemiRight('string'), innerErr, 'throws with truthy string on right')
  t.throws(notSemiRight(false), innerErr, 'throws with false on right')
  t.throws(notSemiRight(true), innerErr, 'throws with true on right')
  t.throws(notSemiRight({}), innerErr, 'throws with object on right')

  const noMatch = bindFunc(() => good.concat(Either.Right('')))
  t.throws(noMatch({}), innerErr, 'throws with different semigroups')

  t.end()
})

test('Either concat functionality', t => {
  const extract =
    either(identity, identity)

  const left = Either.Left('Left')
  const a = Either.Right([ 1, 2 ])
  const b = Either.Right([ 4, 3 ])

  const right = a.concat(b)
  const leftRight = a.concat(left)
  const leftLeft = left.concat(a)

  t.ok(isSameType(Either, right), 'returns another Either with Right')
  t.ok(isSameType(Either, leftRight), 'returns another Either with Left on right side')
  t.ok(isSameType(Either, leftLeft), 'returns another Either with Left on left side')

  t.same(extract(right), [ 1, 2, 4, 3 ], 'concats the inner semigroup with Rights')
  t.equals(extract(leftRight), 'Left', 'returns a Left with a Left on right side')
  t.equals(extract(leftLeft), 'Left', 'returns a Left with a Left on left side')

  t.end()
})

test('Either concat properties (Semigoup)', t => {
  const extract =
    either(identity, identity)

  const a = Either.Right([ 'a' ])
  const b = Either.Right([ 'b' ])
  const c = Either.Right([ 'c' ])

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')

  t.same(extract(left), extract(right), 'associativity')
  t.ok(isArray(extract(a.concat(b))), 'returns an Array')

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
  t.equal(l.either(identity, constant(1)), 0, 'returns the original Left value')
  t.notOk(lspy.called, 'mapped function is never called when Left')

  t.equal(r.type(), 'Either', 'returns a Either type')
  t.equal(r.either(constant(1), identity), 0, 'returns a Right Either with the same value when mapped with identity')
  t.ok(rspy.called, 'mapped function is called when Right')

  t.end()
})

test('Either map properties (Functor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  const Right = Either.Right
  const Left = Either.Left

  t.ok(isFunction(Left(0).map), 'left provides a map function')
  t.ok(isFunction(Right(0).map), 'right provides a map function')

  t.equal(Right(30).map(identity).either(constant(0), identity), 30, 'Right identity')

  t.equal(
    Right(10).map(composeB(f, g)).either(constant(0), identity),
    Right(10).map(g).map(f).either(constant(0), identity),
    'Right composition'
  )

  t.equal(Left(45).map(identity).either(identity, constant(0)), 45, 'Left identity')
  t.equal(
    Left(10).map(composeB(f, g)).either(identity, constant(0)),
    Left(10).map(g).map(f).either(identity, constant(0)),
    'Left composition'
  )

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

test('Either bimap properties (Bifunctor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  const e = either(identity, identity)

  t.ok(isFunction(Either.Left(0).bimap), 'left provides a bimap function')
  t.ok(isFunction(Either.Right(0).bimap), 'right provides a bimap function')

  t.equal(e(Either.Right(30).bimap(constant(0), identity)), 30, 'Right identity')
  t.equal(
    e(Either.Right(10).bimap(constant(0), composeB(f, g))),
    e(Either.Right(10).bimap(constant(0), g).bimap(constant(0), f)),
    'Right composition'
  )

  t.equal(e(Either.Left(45).bimap(identity, constant(0))), 45, 'Left identity')
  t.equal(
    e(Either.Left(10).bimap(composeB(f, g), constant(0))),
    e(Either.Left(10).bimap(g, constant(0)).bimap(f, constant(0))),
    'Left composition'
  )

  t.end()
})

test('Either alt errors', t => {
  const m = { type: () => 'Either...Not' }

  const altRight = bindFunc(Either.of(0).alt)

  t.throws(altRight(undefined), TypeError, 'throws when passed an undefined with Right')
  t.throws(altRight(null), TypeError, 'throws when passed a null with Right')
  t.throws(altRight(0), TypeError, 'throws when passed a falsey number with Right')
  t.throws(altRight(1), TypeError, 'throws when passed a truthy number with Right')
  t.throws(altRight(''), TypeError, 'throws when passed a falsey string with Right')
  t.throws(altRight('string'), TypeError, 'throws when passed a truthy string with Right')
  t.throws(altRight(false), TypeError, 'throws when passed false with Right')
  t.throws(altRight(true), TypeError, 'throws when passed true with Right')
  t.throws(altRight([]), TypeError, 'throws when passed an array with Right')
  t.throws(altRight({}), TypeError, 'throws when passed an object with Right')
  t.throws(altRight(m), TypeError, 'throws when container types differ on Right')

  const altLeft = bindFunc(Either.Left(0).alt)

  t.throws(altLeft(undefined), TypeError, 'throws when passed an undefined with Left')
  t.throws(altLeft(null), TypeError, 'throws when passed a null with Left')
  t.throws(altLeft(0), TypeError, 'throws when passed a falsey number with Left')
  t.throws(altLeft(1), TypeError, 'throws when passed a truthy number with Left')
  t.throws(altLeft(''), TypeError, 'throws when passed a falsey string with Left')
  t.throws(altLeft('string'), TypeError, 'throws when passed a truthy string with Left')
  t.throws(altLeft(false), TypeError, 'throws when passed false with Left')
  t.throws(altLeft(true), TypeError, 'throws when passed true with Left')
  t.throws(altLeft([]), TypeError, 'throws when passed an array with Left')
  t.throws(altLeft({}), TypeError, 'throws when passed an object with Left')
  t.throws(altLeft(m), TypeError, 'throws when container types differ on Left')

  t.end()
})

test('Either alt functionality', t => {
  const right = Either.of('Right')
  const anotherRight = Either.of('Another Right')

  const left = Either.Left('Left')
  const anotherLeft = Either.Left('Another Left')

  const f = either(identity, identity)

  t.equals(f(right.alt(left).alt(anotherRight)), 'Right', 'retains first Right success')
  t.equals(f(left.alt(anotherLeft)), 'Another Left', 'provdes last Left when all Lefts')

  t.end()
})

test('Either alt properties (Alt)', t => {
  const a = Either.of('a')
  const b = Either.Left('Left')
  const c = Either.of('c')

  const f = either(identity, identity)

  t.equals(f(a.alt(b).alt(c)), f(a.alt(b.alt(c))), 'assosiativity')

  t.equals(
    f(a.alt(b).map(identity)),
    f(a.map(identity).alt(b.map(identity))),
    'distributivity'
  )

  t.end()
})

test('Either ap errors', t => {
  const m = { type: () => 'Either...Not' }

  t.throws(Either.of(undefined).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is an undefined')
  t.throws(Either.of(null).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is a null')
  t.throws(Either.of(0).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is a falsey number')
  t.throws(Either.of(1).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is a truthy number')
  t.throws(Either.of('').ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is a falsey string')
  t.throws(Either.of('string').ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is a truthy string')
  t.throws(Either.of(false).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is false')
  t.throws(Either.of(true).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is true')
  t.throws(Either.of([]).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is an array')
  t.throws(Either.of({}).ap.bind(null, Either.of(0)), TypeError, 'throws when wrapped value is an object')

  t.doesNotThrow(Either.Left(0).ap.bind(null, Either.of(0)), 'does not throw when ap on Left')

  t.throws(Either.of(noop).ap.bind(null, undefined), TypeError, 'throws when passed an undefined')
  t.throws(Either.of(noop).ap.bind(null, null), TypeError, 'throws when passed a null')
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
  const Right = Either.Right
  const m = Right(identity)

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(m.ap), 'provides an ap function')
  t.ok(isFunction(m.map), 'implements the Functor spec')

  t.equal(
    a.ap(Right(3)).either(constant(0), identity),
    b.ap(Right(3)).either(constant(0), identity),
    'composition Right'
  )

  t.end()
})

test('Either of', t => {
  t.equal(Either.of, Either(0).of, 'Either.of is the same as the instance version')
  t.equal(Either.of(0).type(), 'Either', 'returns an Either')
  t.equal(Either.of(0).either(constant('left'), identity), 0, 'wraps the value into an Either.Right')

  t.end()
})

test('Either of properties (Applicative)', t => {
  const Right = Either.Right
  const Left = Either.Left

  const r = Right(identity)
  const l = Left('left')

  t.ok(isFunction(r.of), 'Right provides an of function')
  t.ok(isFunction(l.of), 'Left provides an of function')
  t.ok(isFunction(r.ap), 'Right implements the Apply spec')
  t.ok(isFunction(l.ap), 'Left implements the Apply spec')

  t.equal(r.ap(Right(3)).either(constant(0), identity), 3, 'identity Right')
  t.equal(
    r.ap(Either.of(3)).either(constant(0), identity),
    Either.of(3).either(constant(0), identity),
    'homomorphism Right'
  )

  const a = x => r.ap(Either.of(x))
  const b = x => Either.of(reverseApply(x)).ap(r)

  t.equal(
    a(3).either(constant(0),identity),
    b(3).either(constant(0),identity),
    'interchange Right'
  )

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
  const Right = Either.Right
  const Left = Either.Left

  t.ok(isFunction(Right(0).chain), 'Right provides a chain function')
  t.ok(isFunction(Right(0).ap), 'Right implements the Apply spec')

  t.ok(isFunction(Left(0).chain), 'Left provides a chain function')
  t.ok(isFunction(Left(0).ap), 'Leftimplements the Apply spec')

  const f = x => Right(x + 2)
  const g = x => Right(x + 10)

  const a = x => Right(x).chain(f).chain(g)
  const b = x => Right(x).chain(y => f(y).chain(g))

  t.equal(
    a(10).either(constant(0), identity),
    b(10).either(constant(0), identity),
    'assosiativity Right'
  )

  t.end()
})

test('Either chain properties (Monad)', t => {
  const Right = Either.Right

  t.ok(isFunction(Right(0).chain), 'Right implements the Chain spec')
  t.ok(isFunction(Right(0).of), 'Right implements the Applicative spec')

  const f = x => Right(x)

  t.equal(
    Either.of(3).chain(f).either(constant(0), identity),
    f(3).either(constant(0), identity),
    'left identity Right'
  )

  const m = x => Right(x)

  t.equal(
    m(3).chain(Either.of).either(constant(0), identity),
    m(3).either(constant(0), identity),
    'right identity Right'
  )

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
  const Right = Either.Right
  const Left = Either.Left

  const x = 284

  const r = Right(MockCrock(x)).sequence(MockCrock.of)
  const l = Left('Left').sequence(MockCrock.of)

  t.equal(r.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(r.value().type(), 'Either', 'Provides an inner type of Either')
  t.equal(r.value().either(constant(0), identity), x, 'Either contains original inner value')

  t.equal(l.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(l.value().type(), 'Either', 'Provides an inner type of Either')
  t.equal(l.value().either(identity, constant(0)), 'Left', 'Either contains original Left value')

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
  const Right = Either.Right
  const Left = Either.Left

  const x = 98

  const f = MockCrock
  const r = Right(x).traverse(f, MockCrock)
  const l = Left('Left').traverse(f, MockCrock)

  t.equal(r.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(r.value().type(), 'Either', 'Provides an inner type of Either')
  t.equal(r.value().either(constant(0), identity), x, 'Either contains original inner value')

  t.equal(l.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(l.value().type(), 'Either', 'Provides an inner type of Either')
  t.equal(l.value().either(identity, constant(0)), 'Left', 'Either contains original Left value')

  t.end()
})
