const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isObject = require('../internal/isObject')
const isFunction = require('../internal/isFunction')

const constant = require('../combinators/constant')
const composeB = require('../combinators/composeB')
const identity = require('../combinators/identity')
const reverseApply = require('../combinators/reverseApply')

const MockCrock = require('../test/MockCrock')

const Maybe = require('./Maybe')

test('Maybe', t => {
  const m = Maybe(0)

  t.ok(isFunction(Maybe), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Maybe.of), 'provides an of function')
  t.ok(isFunction(Maybe.type), 'provides a type function')
  t.ok(isFunction(Maybe.Nothing), 'provides a Nothing constructor')
  t.ok(isFunction(Maybe.Just), 'provides a Just constructor')

  t.throws(Maybe, TypeError, 'throws with no parameters')

  t.end()
})

test('Maybe inspect', t => {
  const m = Maybe.Just('great')
  const n = Maybe.Nothing()

  t.ok(isFunction(m.inspect), 'provides an inspect function')
  t.equal(m.inspect(), 'Maybe.Just "great"', 'returns inspect string')
  t.equal(n.inspect(), 'Maybe.Nothing', 'Nothing returns inspect string')

  t.end()
})

test('Maybe type', t => {
  t.equal(Maybe.Just(0).type(), 'Maybe', 'type returns Maybe for Just')
  t.equal(Maybe.Nothing().type(), 'Maybe', 'type returns Maybe for Nothing')

  t.end()
})

test('Maybe maybe', t => {
  t.equal(Maybe.Just(0).maybe(), 0, 'maybe returns 0 when 0 is wrapped')
  t.equal(Maybe.Just(1).maybe(), 1, 'maybe returns 1 when 1 is wrapped')
  t.equal(Maybe('').maybe(), '', "maybe returns '' when '' is wrapped")
  t.equal(Maybe('string').maybe(), 'string', "maybe returns 'string' when 'string' is wrapped")
  t.equal(Maybe(false).maybe(), false, 'maybe returns false when false is wrapped')
  t.equal(Maybe(true).maybe(), true, 'maybe returns true when true is wrapped')

  t.equal(Maybe(null).maybe(), null, 'maybe returns undefined when null is wrapped')
  t.equal(Maybe(undefined).maybe(), undefined, 'maybe returns undefined when undefined is wrapped')
  t.end()
})

test('Maybe option', t => {
  const nothing = Maybe.Nothing()
  const just = Maybe.Just('something')

  t.equal(nothing.option('was nothing'), 'was nothing', 'returns passed value when called on Nothing')
  t.equal(just.option('was something'), 'something', 'returns wrapped value when called on Something')

  t.end()
})

test('Maybe either', t => {
  const fn = bindFunc(Maybe.Just(23).either)

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

  const nothing = Maybe.Nothing()
  const just = Maybe.Just('value')

  t.equal(nothing.either(constant('nothing'), constant('something')), 'nothing', 'returns left function result when called on Nothing')
  t.equal(just.either(constant('nothing'), constant('something')), 'something', 'returns right function result when called on Somthing')

  t.end()
})

test('Maybe coalesce', t => {
  const fn = bindFunc(Maybe.Just(23).coalesce)

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

  const nothing = Maybe.Nothing().coalesce(constant('was nothing'), identity)
  const just = Maybe.Just('here').coalesce(identity, constant('was something'))

  t.ok(nothing.equals(Maybe.Just('was nothing')),'returns a Maybe wrapping was nothing')
  t.ok(just.equals(Maybe.Just('was something')),'returns a Maybe wrapping was something')

  t.end()
})

test('Maybe equals functionality', t => {
  const a = Maybe.Just(0)
  const b = Maybe.Just(0)
  const c = Maybe.Just(1)

  const d = Maybe.Just(undefined)
  const n = Maybe.Nothing()

  const value = 0
  const nonMaybe = { type: 'Maybe...Not' }

  t.equal(a.equals(c), false, 'returns false when 2 Justs are not equal')
  t.equal(d.equals(n), false, 'returns false when Just(undefinded) and Nothing compared')
  t.equal(a.equals(value), false, 'returns false when passed a simple value')
  t.equal(a.equals(nonMaybe), false, 'returns false when passed a non-Maybe')

  t.equal(a.equals(b), true, 'returns true when 2 Justs are equal')
  t.equal(n.equals(Maybe.Nothing()), true, 'returns true when Nothings compared')

  t.end()
})

test('Maybe equals properties (Setoid)', t => {
  const a = Maybe.Just(0)
  const b = Maybe.Just(0)
  const c = Maybe.Just(1)
  const d = Maybe.Just(0)

  t.ok(isFunction(Maybe.Just(0).equals), 'provides an equals function')

  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Maybe map errors', t => {
  const map = bindFunc(Maybe.Just(0).map)

  t.throws(map(undefined), TypeError, 'throws with undefined')
  t.throws(map(null), TypeError, 'throws with null')
  t.throws(map(0), TypeError, 'throws with falsey number')
  t.throws(map(1), TypeError, 'throws with truthy number')
  t.throws(map(''), TypeError, 'throws with falsey string')
  t.throws(map('string'), TypeError, 'throws with truthy string')
  t.throws(map(false), TypeError, 'throws with false')
  t.throws(map(true), TypeError, 'throws with true')
  t.throws(map([]), TypeError, 'throws with an array')
  t.throws(map({}), TypeError, 'throws iwth object')

  t.doesNotThrow(map(noop), 'allows a function')

  t.end()
})

test('Maybe map functionality', t => {
  const spy = sinon.spy(identity)

  t.equal(Maybe.Just('Just').map(identity).option('Nothing'), 'Just', 'Just returns a Just')
  t.equal(Maybe.Nothing().map(identity).option('Nothing'), 'Nothing', 'Nothing returns a Nothing')

  const nothing = Maybe.Nothing().map(spy)

  t.equal(nothing.option('Nothing'), 'Nothing', 'returns a Nothing when mapping a Nothing')
  t.equal(spy.called, false, 'mapping function is never called on Nothing')

  const def = Maybe.Just('Just').map(spy)

  t.equal(def.option('Nothing'), 'Just', 'returns a Just')
  t.equal(def.maybe(), 'Just', 'returns a Just with the same value when mapped with identity')
  t.equal(spy.called, true, 'mapped function is called on Just')

  t.end()
})

test('Maybe map properties (Functor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  t.ok(isFunction(Maybe.Just(0).map), 'Just provides a map function')
  t.ok(isFunction(Maybe.Nothing().map), 'Just provides a map function')

  t.equal(Maybe.Just(null).map(identity).maybe(), null, 'identity')
  t.equal(Maybe.Just(10).map(x => f(g(x))).maybe(), Maybe(10).map(g).map(f).maybe(), 'composition')

  t.end()
})

test('Maybe ap errors', t => {
  const m = { type: () => 'Maybe...Not' }
  const ap = bindFunc(Maybe.Just(noop).ap)

  t.throws(Maybe(0).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is a falsey number')
  t.throws(Maybe(1).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is a truthy number')
  t.throws(Maybe('').ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is a falsey string')
  t.throws(Maybe('string').ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is a truthy string')
  t.throws(Maybe(false).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is false')
  t.throws(Maybe(true).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is true')
  t.throws(Maybe([]).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is an array')
  t.throws(Maybe({}).ap.bind(null, Maybe(0)), TypeError, 'throws when wrapped value is an object')

  t.throws(ap(undefined), TypeError, 'throws with undefined')
  t.throws(ap(null), TypeError, 'throws with null')
  t.throws(ap(0), TypeError, 'throws with falsey number')
  t.throws(ap(1), TypeError, 'throws with truthy number')
  t.throws(ap(''), TypeError, 'throws with falsey string')
  t.throws(ap('string'), TypeError, 'throws with truthy string')
  t.throws(ap(false), TypeError, 'throws with false')
  t.throws(ap(true), TypeError, 'throws with true')
  t.throws(ap([]), TypeError, 'throws with an array')
  t.throws(ap({}), TypeError, 'throws with an object')
  t.throws(ap(m), TypeError, 'throws when container types differ')

  t.doesNotThrow(ap(Maybe.Just(0)), 'allows a Maybe')

  t.end()
})

test('Maybe ap properties (Apply)', t => {
  const m = Maybe.Just(identity)

  const a = m.map(composeB).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  const j = Maybe.Just(3)
  const n = Maybe.Nothing()

  t.ok(isFunction(j.ap), 'Just provides an ap function')
  t.ok(isFunction(j.map), 'Just implements the Functor spec')

  t.ok(isFunction(n.ap), 'Nothing provides an ap function')
  t.ok(isFunction(n.map), 'Nothing implements the Functor spec')

  t.equal(a.ap(j).option('Nothing'), b.ap(j).option('Nothing'), 'composition Just')
  t.equal(a.ap(n).option('Nothing'), b.ap(n).option('Nothing'), 'composition Nothing')

  t.end()
})

test('Maybe of', t => {
  t.equal(Maybe.of, Maybe(0).of, 'Maybe.of is the same as the instance version')
  t.equal(Maybe.of(0).type(), 'Maybe', 'returns a Maybe')
  t.equal(Maybe.of(0).maybe(), 0, 'wraps the value passed into a Maybe')

  t.end()
})

test('Maybe of properties (Applicative)', t => {
  const m = Maybe.Just(identity)

  const j = Maybe.Just(3)
  const n = Maybe.Nothing()

  t.ok(isFunction(j.of), 'Just provides an of function')
  t.ok(isFunction(j.ap), 'Just implements the Apply spec')

  t.equal(m.ap(j).maybe(), 3, 'identity')
  t.equal(m.ap(Maybe.of(3)).maybe(), Maybe.of(identity(3)).maybe(), 'homomorphism')

  const a = x => m.ap(Maybe.of(x))
  const b = x => Maybe.of(reverseApply(x)).ap(m)

  t.equal(a(3).maybe(), b(3).maybe(), 'interchange Just')

  t.end()
})

test('Maybe chain errors', t => {
  const chain = bindFunc(Maybe(0).chain)
  const nChain = bindFunc(Maybe(undefined).chain)

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
  t.throws(chain(noop), TypeError, 'throws with a non-Maybe returning function')

  t.doesNotThrow(chain(Maybe.of), 'allows a Maybe returning function')

  t.end()
})

test('Maybe chain properties (Chain)', t => {
  const j = Maybe.Just(0)
  const n = Maybe.Nothing()

  t.ok(isFunction(j.chain), 'Just provides a chain function')
  t.ok(isFunction(j.ap), 'Just implements the Apply spec')

  t.ok(isFunction(n.chain), 'Nothing provides a chain function')
  t.ok(isFunction(n.ap), 'Nothing implements the Apply spec')

  const f = x => Maybe.of(x + 2)
  const g = x => Maybe.of(x + 10)

  const a = x => Maybe.of(x).chain(f).chain(g)
  const b = x => Maybe.of(x).chain(y => f(y).chain(g))

  t.equal(a(10).maybe(), b(10).maybe(), 'assosiativity')

  t.end()
})

test('Maybe chain properties (Monad)', t => {
  t.ok(isFunction(Maybe(0).chain), 'implements the Chain spec')
  t.ok(isFunction(Maybe(0).of), 'implements the Applicative spec')

  const f = Maybe.of

  t.equal(Maybe.of(3).chain(f).maybe(), f(3).maybe(), 'left identity')
  t.equal(f(3).chain(Maybe.of).maybe(), f(3).maybe(), 'right identity')

  t.end()
})

test('Maybe sequence errors', t => {
  const seq = bindFunc(Maybe(MockCrock({ something: true })).sequence)
  const seqBad = bindFunc(Maybe(0).sequence)

  const seqNothing = bindFunc(Maybe.Nothing().sequence)

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
  t.doesNotThrow(seq(noop), 'allows a function')

  t.throws(seqBad(noop), TypeError, 'wrapping non-Applicative throws')
  t.doesNotThrow(seqNothing(noop), 'allows Nothing with non-Applicative wrapped')

  t.end()
})

test('Maybe sequence functionality', t => {
  const x = [ 'a' ]
  const s = Maybe.Just(MockCrock(x)).sequence(MockCrock.of)
  const n = Maybe.Nothing().sequence(MockCrock.of)

  t.equal(s.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(s.value().type(), 'Maybe', 'Provides an inner type of Maybe')
  t.same(s.value().maybe(), x, 'Maybe contains original inner value')

  t.equal(n.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(n.value().type(), 'Maybe', 'Provides an inner type of Maybe')
  t.equal(n.value().option('Nothing'), 'Nothing', 'Reports as a Nothing')

  t.end()
})

test('Maybe traverse errors', t => {
  const rtrav = bindFunc(Maybe.Just(0).traverse)
  const ltrav = bindFunc(Maybe.Nothing().traverse)

  const f = x => MockCrock(x)

  t.throws(rtrav(undefined, noop), TypeError, 'Just throws with undefined in first argument')
  t.throws(rtrav(null, noop), TypeError, 'Just throws with null in first argument')
  t.throws(rtrav(0, noop), TypeError, 'Just throws falsey with number in first argument')
  t.throws(rtrav(1, noop), TypeError, 'Just throws truthy with number in first argument')
  t.throws(rtrav('', noop), TypeError, 'Just throws falsey with string in first argument')
  t.throws(rtrav('string', noop), TypeError, 'Just throws with truthy string in first argument')
  t.throws(rtrav(false, noop), TypeError, 'Just throws with false in first argument')
  t.throws(rtrav(true, noop), TypeError, 'Just throws with true in first argument')
  t.throws(rtrav([], noop), TypeError, 'Just throws with an array in first argument')
  t.throws(rtrav({}, noop), TypeError, 'Just throws with an object in first argument')
  t.throws(rtrav(f, undefined), TypeError, 'Just throws with undefined in second argument')
  t.throws(rtrav(f, null), TypeError, 'Just throws with null in second argument')
  t.throws(rtrav(f, 0), TypeError, 'Just throws falsey with number in second argument')
  t.throws(rtrav(f, 1), TypeError, 'Just throws truthy with number in second argument')
  t.throws(rtrav(f, ''), TypeError, 'Just throws falsey with string in second argument')
  t.throws(rtrav(f, 'string'), TypeError, 'Just throws with truthy string in second argument')
  t.throws(rtrav(f, false), TypeError, 'Just throws with false in second argument')
  t.throws(rtrav(f, true), TypeError, 'Just throws with true in second argument')
  t.throws(rtrav(f, []), TypeError, 'Just throws with an array in second argument')
  t.throws(rtrav(f, {}), TypeError, 'Just throws with an object in second argument')
  t.throws(rtrav(noop, noop), TypeError, 'Just throws when first function does not return an Applicaitve')

  t.doesNotThrow(rtrav(f, noop), 'Just allows an Applicative returning function in first argument')

  t.throws(ltrav(undefined, MockCrock), TypeError, 'Nothing throws with undefined in first argument')
  t.throws(ltrav(null, MockCrock), TypeError, 'Nothing throws with null in first argument')
  t.throws(ltrav(0, MockCrock), TypeError, 'Nothing throws with falsey number in first argument')
  t.throws(ltrav(1, MockCrock), TypeError, 'Nothing throws with truthy number in first argument')
  t.throws(ltrav('', MockCrock), TypeError, 'Nothing throws with falsey string in first argument')
  t.throws(ltrav('string', MockCrock), TypeError, 'Nothing throws with truthy string in first argument')
  t.throws(ltrav(false, MockCrock), TypeError, 'Nothing throws with false in first argument')
  t.throws(ltrav(true, MockCrock), TypeError, 'Nothing throws with true in first argument')
  t.throws(ltrav([], MockCrock), TypeError, 'Nothing throws with an array in first argument')
  t.throws(ltrav({}, MockCrock), TypeError, 'Nothing throws with an object in first argument')

  t.throws(ltrav(noop, undefined), TypeError, 'Nothing throws with undefined in second argument')
  t.throws(ltrav(noop, null), TypeError, 'Nothing throws with null in second argument')
  t.throws(ltrav(noop, 0), TypeError, 'Nothing throws falsey with number in second argument')
  t.throws(ltrav(noop, 1), TypeError, 'Nothing throws truthy with number in second argument')
  t.throws(ltrav(noop, ''), TypeError, 'Nothing throws falsey with string in second argument')
  t.throws(ltrav(noop, 'string'), TypeError, 'Nothing throws with truthy string in second argument')
  t.throws(ltrav(noop, false), TypeError, 'Nothing throws with false in second argument')
  t.throws(ltrav(noop, true), TypeError, 'Nothing throws with true in second argument')
  t.throws(ltrav(noop, []), TypeError, 'Nothing throws with an array in second argument')
  t.throws(ltrav(noop, {}), TypeError, 'Nothing throws with an object in second argument')
  t.throws(ltrav(noop, noop), TypeError, 'Nothing throws when second function does not return an Applicaitve')

  t.doesNotThrow(ltrav(noop, MockCrock), 'Nothing allows an Applicative returning function in the second arg')

  t.end()
})

test('Maybe traverse functionality', t => {
  const x = 'bubbles'
  const f = x => MockCrock(x)

  const r = Maybe.Just(x).traverse(f, MockCrock)
  const l = Maybe.Nothing().traverse(f, MockCrock)

  t.equal(r.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(r.value().type(), 'Maybe', 'Provides an inner type of Maybe')
  t.equal(r.value().maybe(), x, 'Maybe contains original inner value')

  t.equal(l.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(l.value().type(), 'Maybe', 'Provides an inner type of Maybe')
  t.equal(l.value().option('Nothing'), 'Nothing', 'Maybe is a Nothing')

  t.end()
})
