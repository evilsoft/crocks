const test  = require('tape')
const sinon = require('sinon')

const helpers = require('../test/helpers')

const isObject    = require('../internal/isObject')
const isFunction  = require('../internal/isFunction')
const noop        = helpers.noop
const bindFunc    = helpers.bindFunc

const reverseApply  = require('../combinators/reverseApply')
const composeB      = require('../combinators/composeB')
const identity      = require('../combinators/identity')
const constant      = require('../combinators/constant')

const Either = require('./Either')

test('Either', t => {
  const m = Either(null, 0)
  const e = bindFunc(Either)

  t.ok(isFunction(Either), 'is a function')
  t.ok(isFunction(Either.of), 'provides an of function')
  t.ok(isFunction(Either.type), 'provides a type function')
  t.ok(isFunction(Either.Left), 'provides a Left function')
  t.ok(isFunction(Either.Right), 'provides a Right function')

  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(m.either), 'result provides an either function')
  t.ok(isFunction(m.value), 'result provides a value function')
  t.ok(isFunction(m.type), 'result provides a type function')
  t.equal(Either.type, m.type, 'static type function matches instance type function')

  t.throws(Either, TypeError, 'throws when no parameters are passed')
  t.throws(e(0), TypeError, 'throws when one parameter is passed')
  t.throws(e(null, null), TypeError, 'throws when two nulls are passed')

  t.end()
})

test('Either.Left', t => {
  const l = Either.Left('value')

  t.equal(l.either(identity, constant('right')), 'value', 'creates an Either.Left')

  t.end()
})

test('Either.Right', t => {
  const l = Either.Right('value')

  t.equal(l.either(constant('left'), identity), 'value', 'creates an Either.Right')

  t.end()
})

test('Either type', t => {
  t.equal(Either(null, 0).type(), 'Either', 'type returns Either')
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

test('Either equals functionality', t => {
  const la = Either.Left(0)
  const lb = Either.Left(0)
  const lc = Either.Left(1)

  const ra = Either.Right(0)
  const rb = Either.Right(0)
  const rc = Either.Right(1)

  const value = 1
  const nonEither = { type: 'Either...Not' }

  t.equals(la.equals(lc), false, 'returns false when 2 Left Eithers are not equal')
  t.equals(la.equals(lb), true, 'returns true when 2 Left Eithers are equal')
  t.equals(lc.equals(value), false, 'returns when Left passed a simple value')

  t.equals(ra.equals(rc), false, 'returns false when 2 Right Eithers are not equal')
  t.equals(ra.equals(rb), true, 'returns true when 2 Right Eithers are equal')
  t.equals(rc.equals(value), false, 'returns when Right passed a simple value')

  t.equals(la.equals(nonEither), false, 'returns false when passed a non-Maybe')
  t.equals(ra.equals(lb), false, 'returns true when 2 Maybes are equal')

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

  t.ok(isFunction(Either(null, 0).equals), 'provides an equals function')

  t.equals(la.equals(la), true, 'Left reflexivity')
  t.equals(la.equals(lb), lb.equals(la), 'Left symmetry (equal)')
  t.equals(la.equals(lc), lc.equals(la), 'Left symmetry (!equal)')
  t.equals(la.equals(lb) && lb.equals(ld), la.equals(ld), 'Left transitivity')

  t.equals(ra.equals(ra), true, 'Right reflexivity')
  t.equals(ra.equals(rb), rb.equals(ra), 'Right symmetry (equal)')
  t.equals(ra.equals(rc), rc.equals(ra), 'Right symmetry (!equal)')
  t.equals(ra.equals(rb) && rb.equals(rd), ra.equals(rd), 'Right transitivity')

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
  t.equals(Either.Right(10).map(x => f(g(x))).value(), Either.Right(10).map(g).map(f).value(), 'Right composition')

  t.equal(Either.Left(45).map(identity).value(), 45, 'Left identity')
  t.equals(Either.Left(10).map(x => f(g(x))).value(), Either.Left(10).map(g).map(f).value(), 'Left composition')

  t.end()
})
