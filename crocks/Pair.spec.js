const test    = require('tape')
const helpers = require('../test/helpers')

const identity  = require('../combinators/identity')
const composeB  = require('../combinators/composeB')

const isObject    = require('../internal/isObject')
const isFunction  = require('../internal/isFunction')
const bindFunc    = helpers.bindFunc
const noop        = helpers.noop

const Pair = require('./Pair')

test('Pair', t => {
  const m = bindFunc(Pair)
  const x = Pair(0, 0)

  t.ok(isFunction(Pair), 'is a function')
  t.ok(isObject(x), 'returns an object')

  t.ok(isFunction(Pair.type), 'provides a type function')

  t.throws(m(), TypeError, 'throws with no parameters')
  t.throws(m(1), TypeError, 'throws with one parameter')

  t.end()
})

test('Pair inspect', t => {
  const m = Pair(0, 'nice')

  t.ok(isFunction(m.inspect), 'provides an inpsect function')
  t.equal(m.inspect(), "Pair [ 0, nice ]", 'returns inspect string')

  t.end()
})

test('Pair type', t => {
  t.equal(Pair(0, 0).type(), 'Pair', 'type returns Pair')
  t.end()
})

test('Pair value', t => {
  const x = Pair('great', true).value()

  t.same(x, [ 'great', true ], 'proivdes both values in an array')

  t.end()
})

test('Pair fst', t => {
  const x = Pair(34, false).fst()
  t.same(x, 34, 'proivdes the first value')

  t.end()
})

test('Pair snd', t => {
  const x = Pair([ 1, 2 ], { nice: true }).snd()
  t.same(x, { nice: true }, 'proivdes the second value')

  t.end()
})

test('Pair equals functionality', t => {
  const a = Pair(0, 45)
  const b = Pair(0, 45)
  const c = Pair(1, 'space kitten')

  const value = 'yep'
  const nonPair = { type: 'Pair...Not' }

  t.equal(a.equals(c), false, 'returns false when 2 Pairs are not equal')
  t.equal(a.equals(b), true, 'returns true when 2 Pairs are equal')
  t.equal(a.equals(value), false, 'returns false when passed a simple value')
  t.equal(a.equals(nonPair), false, 'returns false when passed a non-Pair')

  t.end()
})

test('Pair equals properties (Setoid)', t => {
  const a = Pair(0, 'like')
  const b = Pair(0, 'like')
  const c = Pair(1, 'rainbow')
  const d = Pair(0, 'dislike')

  t.ok(isFunction(Pair(0, 0).equals), 'provides an equals function')

  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Pair concat errors', t => {
  const bad   = bindFunc(Pair(0, 0).concat)
  const good  = bindFunc(Pair([], 'string').concat)

  t.throws(bad(Pair([], [])), TypeError, 'throws when left Pair does not contain Semigroups')
  t.throws(good(Pair(0, 0)), TypeError, 'throws when right Pair does not contain Semigroups')
  t.throws(good([]), TypeError, 'throws when Non-Pair passed')

  t.end()
})

test('Pair concat functionality', t => {
  const m = Pair([ 1 ], '1')
  const n = Pair([ 2 ], '2')

  t.same(m.concat(n).fst(), [ 1, 2 ], 'combines the first Semigroups')
  t.same(m.concat(n).snd(), '12', 'combines the second Semigroups')

  t.end()
})

test('Pair concat properties (Semigroup)', t => {
  const a = Pair([ 1 ], '1')
  const b = Pair([ 2 ], '2')
  const c = Pair([ 3 ], '3')

  const left  = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(Pair(0, 0).concat), 'is a function')

  t.same(left.value(), right.value(), 'associativity')
  t.equal(a.concat(b).type(), a.type(), 'returns Semigroup of the same type')

  t.end()
})

test('Pair swap', t => {
  const fn = bindFunc(Pair(0, 0).swap)

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
  t.throws(fn(noop, false), TypeError, 'throws with false in right')
  t.throws(fn(noop, true), TypeError, 'throws with true in right')
  t.throws(fn(noop, {}), TypeError, 'throws with object in right')
  t.throws(fn(noop, []), TypeError, 'throws with array in right')

  const f = x => `was ${x}`
  const l = Pair('left', 'right').swap(f, f)

  t.ok(l.equals(Pair('was right', 'was left')),'returns a pair with swapped, mapped values')

  t.end()
})

test('Pair map errors', t => {
  const map = bindFunc(Pair(0, 'gibbles').map)

  t.throws(map(undefined), TypeError, 'throws with undefined')
  t.throws(map(null), TypeError, 'throws with null')
  t.throws(map(0), TypeError, 'throws with falsey number')
  t.throws(map(1), TypeError, 'throws with truthy number')
  t.throws(map(''), TypeError, 'throws with falsey string')
  t.throws(map('string'), TypeError, 'throws with truthy string')
  t.throws(map(false), TypeError, 'throws with false')
  t.throws(map(true), TypeError, 'throws with true')
  t.throws(map([]), TypeError, 'throws with an array')
  t.throws(map({}), TypeError, 'throws with object')

  t.doesNotThrow(map(noop), 'allows a function')

  t.end()
})

test('Pair map functionality', t => {
  const m = Pair(5, 45)
  const n = m.map(x => x + 5)

  t.equal(m.map(identity).type(), 'Pair', 'returns a Pair')
  t.equal(n.fst(), 5, 'Does not modify first value')
  t.equal(n.snd(), 50, 'applies function to second value')

  t.end()
})

test('Pair map properties (Functor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  t.ok(isFunction(Pair(0, 0).map), 'provides a map function')

  t.same(Pair(0, 45).map(identity).value(), [ 0, 45 ], 'identity')

  t.same(
    Pair(50, 22).map(x => f(g(x))).value(),
    Pair(50, 22).map(g).map(f).value(),
    'composition'
  )

  t.end()
})

test('Pair bimap errors', t => {
  const bimap = bindFunc(Pair(0, 'gibbles').bimap)

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

test('Pair bimap functionality', t => {
  const add5 = x => x + 5
  const add7 = x => x + 7

  const m = Pair(5, 48)
  const n = m.bimap(add5, add7)

  t.equal(m.bimap(identity, identity).type(), 'Pair', 'returns a Pair')
  t.equal(n.fst(), 10, 'applies the first function to the first value')
  t.equal(n.snd(), 55, 'applies the second function to second value')

  t.end()
})

test('Pair bimap properties (Bifunctor)', t => {
  const f1 = x => x + 2
  const f2 = x => x + 5

  const g1 = x => x * 2
  const g2 = x => x * 5

  t.ok(isFunction(Pair(0, 0).bimap), 'provides a bimap function')

  t.same(Pair(0, 45).bimap(identity, identity).value(), [ 0, 45 ], 'identity')
  t.same(
    Pair(50, 22).bimap(x => f1(g1(x)), x => f2(g2(x))).value(),
    Pair(50, 22).bimap(g1, g2).bimap(f1, f2).value(),
    'composition'
  )

  t.end()
})

test('Pair ap errors', t => {
  const m     = { type: () => 'Pair...Not' }
  const badAp = bindFunc(Pair(0, 0).ap)
  const ap    = bindFunc(Pair([], noop).ap)

  t.throws(badAp(Pair([], noop)), TypeError, 'throws if wrapped first value is not a Semigroup')
  t.throws(ap(Pair(0, noop)), TypeError, 'throws if Pair with a non-Semigroup as first value is provided')

  t.throws(Pair([], 0).ap.bind(null, Pair([], 0)), TypeError, 'throws when second wrapped value is a falsey number')
  t.throws(Pair([], 1).ap.bind(null, Pair([], 0)), TypeError, 'throws when second wrapped value is a truthy number')
  t.throws(Pair([], '').ap.bind(null, Pair([], 0)), TypeError, 'throws when second wrapped value is a falsey string')
  t.throws(Pair([], 'string').ap.bind(null, Pair([], 0)), TypeError, 'throws when second wrapped value is a truthy string')
  t.throws(Pair([], false).ap.bind(null, Pair([], 0)), TypeError, 'throws when second wrapped value is false')
  t.throws(Pair([], true).ap.bind(null, Pair([], 0)), TypeError, 'throws when second wrapped value is true')
  t.throws(Pair([], []).ap.bind(null, Pair([], 0)), TypeError, 'throws when second wrapped value is an array')
  t.throws(Pair([], {}).ap.bind(null, Pair([], 0)), TypeError, 'throws when second wrapped value is an object')

  t.throws(ap(0), TypeError, 'throws with falsey number')
  t.throws(ap(1), TypeError, 'throws with truthy number')
  t.throws(ap(''), TypeError, 'throws with falsey string')
  t.throws(ap('string'), TypeError, 'throws with truthy string')
  t.throws(ap(false), TypeError, 'throws with false')
  t.throws(ap(true), TypeError, 'throws with true')
  t.throws(ap([]), TypeError, 'throws with an array')
  t.throws(ap({}), TypeError, 'throws with an object')
  t.throws(ap(m), TypeError, 'throws when non-Pair')

  t.doesNotThrow(ap(Pair([], 22)), 'allows a Pair')

  t.end()
})

test('Pair ap properties (Apply)', t => {
  const m = Pair([ 'm' ], identity)

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(Pair(0, 0).ap), 'provides an ap function')
  t.ok(isFunction(Pair(0, 0).map), 'implements the Functor spec')

  t.same(a.ap(Pair([ 'n' ], 3)).value(), b.ap(Pair([ 'n' ], 3)).value(), 'composition')

  t.end()
})

test('Pair chain errors', t => {
  const badChain = bindFunc(Pair(0, 0).chain)
  const chain = bindFunc(Pair([], 0).chain)

  const badFn = x => Pair(0, 0)
  const fn    = x => Pair([], 0)

  t.throws(badChain(noop), TypeError, 'throws if wrapped first value is not a Semigroup')
  t.throws(chain(badFn), TypeError, 'throws if monadic function returns a Pair with a non-Semigroup as first value')

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
  t.throws(chain(noop), TypeError, 'throws with non-Pair returning function')

  t.doesNotThrow(chain(fn), 'allows Pair returning function')

  t.end()
})

test('Pair chain properties (Chain)', t => {
  t.ok(isFunction(Pair([], 0).chain), 'provides a chain function')
  t.ok(isFunction(Pair([], 0).ap), 'implements the Apply spec')

  const f = x => Pair([ 'f' ], x + 2)
  const g = x => Pair([ 'g' ], x + 10)

  const a = x => Pair([ 'a' ], x).chain(f).chain(g)
  const b = x => Pair([ 'a' ], x).chain(y => f(y).chain(g))

  t.same(a(10).value(), b(10).value(), 'assosiativity')

  t.end()
})
