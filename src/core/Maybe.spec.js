const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')
const MockCrock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const curry = require('./curry')
const compose = curry(require('./compose'))
const isArray = require('./isArray')
const isFunction = require('./isFunction')
const isObject = require('./isObject')
const isSameType = require('./isSameType')
const unit = require('./_unit')

const constant = x => () => x
const identity = x => x

const either =
  (f, g) => m => m.either(f, g)

const reverseApply =
  x => fn => fn(x)

const Maybe = require('./Maybe')

test('Maybe', t => {
  const m = Maybe(0)

  t.ok(isFunction(Maybe), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.equals(Maybe.Just(2).constructor, Maybe, 'provides TypeRep on constructor for Just')
  t.equals(Maybe.Nothing().constructor, Maybe, 'provides TypeRep on constructor for Nothing')

  t.ok(isFunction(Maybe.of), 'provides an of function')
  t.ok(isFunction(Maybe.type), 'provides a type function')
  t.ok(isFunction(Maybe.zero), 'provides a zero function')
  t.ok(isFunction(Maybe.Nothing), 'provides a Nothing constructor')
  t.ok(isFunction(Maybe.Just), 'provides a Just constructor')

  const err = /Maybe: Must wrap something, try using Nothing or Just constructors/
  t.throws(Maybe, err, 'throws with no parameters')

  t.end()
})

test('Maybe @@implements', t => {
  const f = Maybe['@@implements']

  t.equal(f('alt'), true, 'implements alt func')
  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')
  t.equal(f('traverse'), true, 'implements traverse func')
  t.equal(f('zero'), true, 'implements zero func')

  t.end()
})

test('Maybe inspect', t => {
  const m = Maybe.Just('great')
  const n = Maybe.Nothing()

  t.ok(isFunction(m.inspect), 'Just provides an inspect function')
  t.ok(isFunction(n.inspect), 'Nothing provides an inspect function')
  t.equal(m.inspect(), 'Just "great"', 'returns inspect string')
  t.equal(n.inspect(), 'Nothing', 'Nothing returns inspect string')

  t.end()
})

test('Maybe type', t => {
  t.equal(Maybe.Just(0).type(), 'Maybe', 'type returns Maybe for Just')
  t.equal(Maybe.Nothing().type(), 'Maybe', 'type returns Maybe for Nothing')

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

  const err = /Maybe.either: Requires both left and right functions/
  t.throws(fn(), err, 'throws when nothing passed')
  t.throws(fn(null, unit), err, 'throws with null in left')
  t.throws(fn(undefined, unit), err, 'throws with undefined in left')
  t.throws(fn(0, unit), err, 'throws with falsey number in left')
  t.throws(fn(1, unit), err, 'throws with truthy number in left')
  t.throws(fn('', unit), err, 'throws with falsey string in left')
  t.throws(fn('string', unit), err, 'throws with truthy string in left')
  t.throws(fn(false, unit), err, 'throws with false in left')
  t.throws(fn(true, unit), err, 'throws with true in left')
  t.throws(fn({}, unit), err, 'throws with object in left')
  t.throws(fn([], unit), err, 'throws with array in left')

  t.throws(fn(unit, null), err, 'throws with null in right')
  t.throws(fn(unit, undefined), err, 'throws with undefined in right')
  t.throws(fn(unit, 0), err, 'throws with falsey number in right')
  t.throws(fn(unit, 1), err, 'throws with truthy number in right')
  t.throws(fn(unit, ''), err, 'throws with falsey string in right')
  t.throws(fn(unit, 'string'), err, 'throws with truthy string in right')
  t.throws(fn(unit, false), err, 'throws with false in right')
  t.throws(fn(unit, true), err, 'throws with true in right')
  t.throws(fn(unit, {}), err, 'throws with object in right')
  t.throws(fn(unit, []), err, 'throws with array in right')

  const nothing = Maybe.Nothing()
  const just = Maybe.Just('value')

  t.equal(nothing.either(constant('nothing'), constant('something')), 'nothing', 'returns left function result when called on Nothing')
  t.equal(just.either(constant('nothing'), constant('something')), 'something', 'returns right function result when called on Somthing')

  t.end()
})

test('Maybe coalesce', t => {
  const fn = bindFunc(Maybe.Just(23).coalesce)

  const err = /Maybe.coalesce: Requires both left and right functions/
  t.throws(fn(null, unit), err, 'throws with null in left')
  t.throws(fn(undefined, unit), err, 'throws with undefined in left')
  t.throws(fn(0, unit), err, 'throws with falsey number in left')
  t.throws(fn(1, unit), err, 'throws with truthy number in left')
  t.throws(fn('', unit), err, 'throws with falsey string in left')
  t.throws(fn('string', unit), err, 'throws with truthy string in left')
  t.throws(fn(false, unit), err, 'throws with false in left')
  t.throws(fn(true, unit), err, 'throws with true in left')
  t.throws(fn({}, unit), err, 'throws with object in left')
  t.throws(fn([], unit), err, 'throws with array in left')

  t.throws(fn(unit, null), err, 'throws with null in right')
  t.throws(fn(unit, undefined), err, 'throws with undefined in right')
  t.throws(fn(unit, 0), err, 'throws with falsey number in right')
  t.throws(fn(unit, 1), err, 'throws with truthy number in right')
  t.throws(fn(unit, ''), err, 'throws with falsey string in right')
  t.throws(fn(unit, 'string'), err, 'throws with truthy string in right')
  t.throws(fn(unit, false), err, 'throws with false in right')
  t.throws(fn(unit, true), err, 'throws with true in right')
  t.throws(fn(unit, {}), err, 'throws with object in right')
  t.throws(fn(unit, []), err, 'throws with array in right')

  const nothing = Maybe.Nothing().coalesce(constant('was nothing'), identity)
  const just = Maybe.Just('here').coalesce(identity, constant('was something'))

  t.ok(nothing.equals(Maybe.Just('was nothing')),'returns a Maybe wrapping was nothing')
  t.ok(just.equals(Maybe.Just('was something')),'returns a Maybe wrapping was something')

  t.end()
})

test('Maybe concat errors', t => {
  const m = { type: () => 'Maybe...Not' }

  const good = Maybe.of([])

  const f = bindFunc(Maybe.of([]).concat)
  const nonMaybeErr = /Maybe.concat: Maybe of Semigroup required/

  t.throws(f(undefined), nonMaybeErr, 'throws with undefined')
  t.throws(f(null), nonMaybeErr, 'throws with null')
  t.throws(f(0), nonMaybeErr, 'throws with falsey number')
  t.throws(f(1), nonMaybeErr, 'throws with truthy number')
  t.throws(f(''), nonMaybeErr, 'throws with falsey string')
  t.throws(f('string'), nonMaybeErr, 'throws with truthy string')
  t.throws(f(false), nonMaybeErr, 'throws with false')
  t.throws(f(true), nonMaybeErr, 'throws with true')
  t.throws(f([]), nonMaybeErr, 'throws with array')
  t.throws(f({}), nonMaybeErr, 'throws with object')
  t.throws(f(m), nonMaybeErr, 'throws with non-Maybe')

  const innerErr = /Maybe.concat: Both containers must contain Semigroups of the same type/
  const notSemiLeft = bindFunc(x => Maybe.of(x).concat(good))

  t.throws(notSemiLeft(undefined), innerErr, 'throws with undefined on left')
  t.throws(notSemiLeft(null), innerErr, 'throws with null on left')
  t.throws(notSemiLeft(0), innerErr, 'throws with falsey number on left')
  t.throws(notSemiLeft(1), innerErr, 'throws with truthy number on left')
  t.throws(notSemiLeft(''), innerErr, 'throws with falsey string on left')
  t.throws(notSemiLeft('string'), innerErr, 'throws with truthy string on left')
  t.throws(notSemiLeft(false), innerErr, 'throws with false on left')
  t.throws(notSemiLeft(true), innerErr, 'throws with true on left')
  t.throws(notSemiLeft({}), innerErr, 'throws with object on left')

  const notSemiRight = bindFunc(x => good.concat(Maybe.of(x)))

  t.throws(notSemiRight(undefined), innerErr, 'throws with undefined on right')
  t.throws(notSemiRight(null), innerErr, 'throws with null on right')
  t.throws(notSemiRight(0), innerErr, 'throws with falsey number on right')
  t.throws(notSemiRight(1), innerErr, 'throws with truthy number on right')
  t.throws(notSemiRight(''), innerErr, 'throws with falsey string on right')
  t.throws(notSemiRight('string'), innerErr, 'throws with truthy string on right')
  t.throws(notSemiRight(false), innerErr, 'throws with false on right')
  t.throws(notSemiRight(true), innerErr, 'throws with true on right')
  t.throws(notSemiRight({}), innerErr, 'throws with object on right')

  const noMatch = bindFunc(() => good.concat(Maybe.of('')))
  t.throws(noMatch({}), innerErr, 'throws with different semigroups')

  t.end()
})

test('Maybe concat functionality', t => {
  const extract =
    either(constant('Nothing'), identity)

  const nothing = Maybe.Nothing()
  const a = Maybe.Just([ 1, 2 ])
  const b = Maybe.Just([ 4, 3 ])

  const just = a.concat(b)
  const nothingRight = a.concat(nothing)
  const nothingLeft = nothing.concat(a)

  t.ok(isSameType(Maybe, just), 'returns anothor Maybe with Just')
  t.ok(isSameType(Maybe, nothingRight), 'returns anothor Maybe with Nothing on Right')
  t.ok(isSameType(Maybe, nothingLeft), 'returns anothor Maybe with Nothing on Left')

  t.same(extract(just), [ 1, 2, 4, 3 ], 'concats the inner semigroup with Justs')
  t.equals(extract(nothingRight), 'Nothing', 'returns a Nothing with a Nothing on Right')
  t.equals(extract(nothingLeft), 'Nothing', 'returns a Nothing with a Nothing on Left')

  t.end()
})

test('Maybe concat properties (Semigroup)', t => {
  const extract =
    either(constant('Nothing'), identity)

  const a = Maybe.Just([ 'a' ])
  const b = Maybe.Just([ 'b' ])
  const c = Maybe.Just([ 'c' ])

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')

  t.same(extract(left), extract(right), 'associativity')
  t.ok(isArray(extract(a.concat(b))), 'returns an Array')

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
  const a = Maybe.Just([ 1, 'joe' ])
  const b = Maybe.Just([ 1, 'joe' ])
  const c = Maybe.Just([ 'joe', 1 ])
  const d = Maybe.Just([ 1, 'joe' ])

  t.ok(isFunction(Maybe.Just(0).equals), 'provides an equals function')

  t.equal(a.equals(a), true, 'reflexivity')
  t.equal(a.equals(b), b.equals(a), 'symmetry (equal)')
  t.equal(a.equals(c), c.equals(a), 'symmetry (!equal)')
  t.equal(a.equals(b) && b.equals(d), a.equals(d), 'transitivity')

  t.end()
})

test('Maybe map errors', t => {
  const m = { type: () => 'Maybe...Not' }
  const map = bindFunc(Maybe.Just(0).map)

  const err = /Maybe.map: Function required/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws with object')
  t.throws(map(m), err, 'throws with non-Maybe')

  t.doesNotThrow(map(unit), 'allows a function')

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
  t.equal(def.option('Nothing'), 'Just', 'returns a Just with the same value when mapped with identity')
  t.equal(spy.called, true, 'mapped function is called on Just')

  t.end()
})

test('Maybe map properties (Functor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  t.ok(isFunction(Maybe.Just(0).map), 'Just provides a map function')
  t.ok(isFunction(Maybe.Nothing().map), 'Just provides a map function')

  t.equal(Maybe.Just(null).map(identity).option('Nothing'), null, 'identity')
  t.equal(
    Maybe.Just(10).map(x => f(g(x))).option('Nothing'),
    Maybe(10).map(g).map(f).option('Other'),
    'composition'
  )

  t.end()
})

test('Maybe alt errors', t => {
  const m = { type: () => 'Maybe...Not' }

  const altJust = bindFunc(Maybe.of(0).alt)

  const err = /Maybe.alt: Maybe required/
  t.throws(altJust(undefined), err, 'throws when passed an undefined with Just')
  t.throws(altJust(null), err, 'throws when passed a null with Just')
  t.throws(altJust(0), err, 'throws when passed a falsey number with Just')
  t.throws(altJust(1), err, 'throws when passed a truthy number with Just')
  t.throws(altJust(''), err, 'throws when passed a falsey string with Just')
  t.throws(altJust('string'), err, 'throws when passed a truthy string with Just')
  t.throws(altJust(false), err, 'throws when passed false with Just')
  t.throws(altJust(true), err, 'throws when passed true with Just')
  t.throws(altJust([]), err, 'throws when passed an array with Just')
  t.throws(altJust({}), err, 'throws when passed an object with Just')
  t.throws(altJust(m), err, 'throws when container types differ on Just')

  const altNothing = bindFunc(Maybe.Nothing().alt)

  t.throws(altNothing(undefined), err, 'throws when passed an undefined with Nothing')
  t.throws(altNothing(null), err, 'throws when passed a null with Nothing')
  t.throws(altNothing(0), err, 'throws when passed a falsey number with Nothing')
  t.throws(altNothing(1), err, 'throws when passed a truthy number with Nothing')
  t.throws(altNothing(''), err, 'throws when passed a falsey string with Nothing')
  t.throws(altNothing('string'), err, 'throws when passed a truthy string with Nothing')
  t.throws(altNothing(false), err, 'throws when passed false with Nothing')
  t.throws(altNothing(true), err, 'throws when passed true with Nothing')
  t.throws(altNothing([]), err, 'throws when passed an array with Nothing')
  t.throws(altNothing({}), err, 'throws when passed an object with Nothing')
  t.throws(altNothing(m), err, 'throws when container types differ on Nothing')

  t.end()
})

test('Maybe alt functionality', t => {
  const just = Maybe.of('Just')
  const anotherJust = Maybe.of('Another Just')

  const nothing = Maybe.Nothing()
  const anotherNothing = Maybe.Nothing()

  const f = either(constant('nothing'), identity)

  t.equals(f(just.alt(nothing).alt(anotherJust)), 'Just', 'retains first Just success')
  t.equals(f(nothing.alt(anotherNothing)), 'nothing', 'provdes Nothing when all Nothings')

  t.end()
})

test('Maybe alt properties (Alt)', t => {
  const a = Maybe.of('a')
  const b = Maybe.Nothing()
  const c = Maybe.of('c')

  const f = either(constant('nothing'), identity)

  t.equals(f(a.alt(b).alt(c)), f(a.alt(b.alt(c))), 'assosiativity')

  t.equals(
    f(a.alt(b).map(identity)),
    f(a.map(identity).alt(b.map(identity))),
    'distributivity'
  )

  t.end()
})

test('Maybe zero properties (Plus)', t => {
  const a = Maybe.of('a')

  const f = either(constant('nothing'), identity)

  t.equals(f(a.alt(Maybe.zero())), f(a), 'right identity')
  t.equals(f(Maybe.zero().alt(a)), f(a), 'left identity')
  t.equals(f(Maybe.zero().map(identity)), f(Maybe.zero()), 'annihilation')

  t.end()
})

test('Maybe ap errors', t => {
  const m = { type: () => 'Maybe...Not' }
  const ap = bindFunc(Maybe.Just(unit).ap)

  const noFunc = /Maybe.ap: Wrapped value must be a function/
  t.throws(Maybe(0).ap.bind(null, Maybe(0)), noFunc, 'throws when wrapped value is a falsey number')
  t.throws(Maybe(1).ap.bind(null, Maybe(0)), noFunc, 'throws when wrapped value is a truthy number')
  t.throws(Maybe('').ap.bind(null, Maybe(0)), noFunc, 'throws when wrapped value is a falsey string')
  t.throws(Maybe('string').ap.bind(null, Maybe(0)), noFunc, 'throws when wrapped value is a truthy string')
  t.throws(Maybe(false).ap.bind(null, Maybe(0)), noFunc, 'throws when wrapped value is false')
  t.throws(Maybe(true).ap.bind(null, Maybe(0)), noFunc, 'throws when wrapped value is true')
  t.throws(Maybe([]).ap.bind(null, Maybe(0)), noFunc, 'throws when wrapped value is an array')
  t.throws(Maybe({}).ap.bind(null, Maybe(0)), noFunc, 'throws when wrapped value is an object')

  const noMaybe = /Maybe.ap: Maybe required/
  t.throws(ap(undefined), noMaybe, 'throws with undefined')
  t.throws(ap(null), noMaybe, 'throws with null')
  t.throws(ap(0), noMaybe, 'throws with falsey number')
  t.throws(ap(1), noMaybe, 'throws with truthy number')
  t.throws(ap(''), noMaybe, 'throws with falsey string')
  t.throws(ap('string'), noMaybe, 'throws with truthy string')
  t.throws(ap(false), noMaybe, 'throws with false')
  t.throws(ap(true), noMaybe, 'throws with true')
  t.throws(ap([]), noMaybe, 'throws with an array')
  t.throws(ap({}), noMaybe, 'throws with an object')
  t.throws(ap(m), noMaybe, 'throws when container types differ')

  t.doesNotThrow(ap(Maybe.Just(0)), 'allows a Maybe')

  t.end()
})

test('Maybe ap properties (Apply)', t => {
  const m = Maybe.Just(identity)

  const a = m.map(compose).ap(m).ap(m)
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
  t.equal(Maybe.of(0).option('Nothing'), 0, 'wraps the value passed into a Maybe')

  t.end()
})

test('Maybe of properties (Applicative)', t => {
  const m = Maybe.Just(identity)
  const j = Maybe.Just(3)

  t.ok(isFunction(j.of), 'Just provides an of function')
  t.ok(isFunction(j.ap), 'Just implements the Apply spec')

  t.equal(m.ap(j).option('Nothing'), 3, 'identity')
  t.equal(
    m.ap(Maybe.of(3)).option('Nothing'),
    Maybe.of(identity(3)).option('Nothing'),
    'homomorphism'
  )

  const a = x => m.ap(Maybe.of(x))
  const b = x => Maybe.of(reverseApply(x)).ap(m)

  t.equal(a(3).option('Nothing'), b(3).option('Other'), 'interchange Just')

  t.end()
})

test('Maybe chain errors', t => {
  const chain = bindFunc(Maybe(0).chain)

  const noFunc = /Maybe.chain: Function required/
  t.throws(chain(undefined), noFunc, 'throws with undefined')
  t.throws(chain(null), noFunc, 'throws with null')
  t.throws(chain(0), noFunc, 'throws with falsey number')
  t.throws(chain(1), noFunc, 'throws with truthy number')
  t.throws(chain(''), noFunc, 'throws with falsey string')
  t.throws(chain('string'), noFunc, 'throws with truthy string')
  t.throws(chain(false), noFunc, 'throws with false')
  t.throws(chain(true), noFunc, 'throws with true')
  t.throws(chain([]), noFunc, 'throws with an array')
  t.throws(chain({}), noFunc, 'throws with an object')

  const noMaybe = /Maybe.chain: Function must return a Maybe/
  t.throws(chain(unit), noMaybe, 'throws with a non-Maybe returning function')

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

  t.equal(a(10).option('Nothing'), b(10).option('Other'), 'assosiativity')

  t.end()
})

test('Maybe chain properties (Monad)', t => {
  t.ok(isFunction(Maybe(0).chain), 'implements the Chain spec')
  t.ok(isFunction(Maybe(0).of), 'implements the Applicative spec')

  const f = Maybe.of

  t.equal(Maybe.of(3).chain(f).option('First'), f(3).option('Second'), 'left identity')
  t.equal(f(3).chain(Maybe.of).option('First'), f(3).option('Second'), 'right identity')

  t.end()
})

test('Maybe sequence errors', t => {
  const seq = bindFunc(Maybe(MockCrock({ something: true })).sequence)
  const seqBad = bindFunc(Maybe(0).sequence)

  const seqNothing = bindFunc(Maybe.Nothing().sequence)

  const noFunc = /Maybe.sequence: Applicative returning function required/
  t.throws(seq(undefined), noFunc, 'throws with undefined')
  t.throws(seq(null), noFunc, 'throws with null')
  t.throws(seq(0), noFunc, 'throws falsey with number')
  t.throws(seq(1), noFunc, 'throws truthy with number')
  t.throws(seq(''), noFunc, 'throws falsey with string')
  t.throws(seq('string'), noFunc, 'throws with truthy string')
  t.throws(seq(false), noFunc, 'throws with false')
  t.throws(seq(true), noFunc, 'throws with true')
  t.throws(seq([]), noFunc, 'throws with an array')
  t.throws(seq({}), noFunc, 'throws with an object')

  t.doesNotThrow(seq(unit), 'allows a function')

  const noAp = /Maybe.sequence: Must wrap an Applicative/
  t.throws(seqBad(unit), noAp, 'wrapping non-Applicative throws')

  t.doesNotThrow(seqNothing(unit), 'allows Nothing with non-Applicative wrapped')

  t.end()
})

test('Maybe sequence functionality', t => {
  const x = 97

  const s = Maybe.Just(MockCrock(x)).sequence(MockCrock.of)
  const n = Maybe.Nothing().sequence(MockCrock.of)

  t.equal(s.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(s.valueOf().type(), 'Maybe', 'Provides an inner type of Maybe')
  t.same(s.valueOf().option('Nothing'), x, 'Maybe contains original inner value')

  t.equal(n.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(n.valueOf().type(), 'Maybe', 'Provides an inner type of Maybe')
  t.equal(n.valueOf().option('Nothing'), 'Nothing', 'Reports as a Nothing')

  const ar = x => [ x ]
  const arS = Maybe.Just([ x ]).sequence(ar)
  const arN = Maybe.Nothing().sequence(ar)

  t.ok(isSameType(Array, arS), 'Provides an outer type of Array')
  t.ok(isSameType(Maybe, arS[0]), 'Provides an inner type of Maybe')
  t.same(arS[0].option('Nothing'), x, 'Maybe contains original inner value')

  t.ok(isSameType(Array, arN), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Maybe, arN[0]), 'Provides an inner type of Maybe')
  t.equal(arN[0].option('Nothing'), 'Nothing', 'Reports as a Nothing')

  t.end()
})

test('Maybe traverse errors', t => {
  const rtrav = bindFunc(Maybe.Just(0).traverse)
  const ltrav = bindFunc(Maybe.Nothing().traverse)

  const err = /Maybe.traverse: Applicative returning functions required for both arguments/
  t.throws(rtrav(undefined, MockCrock), err, 'Just throws with undefined in first argument')
  t.throws(rtrav(null, MockCrock), err, 'Just throws with null in first argument')
  t.throws(rtrav(0, MockCrock), err, 'Just throws falsey with number in first argument')
  t.throws(rtrav(1, MockCrock), err, 'Just throws truthy with number in first argument')
  t.throws(rtrav('', MockCrock), err, 'Just throws falsey with string in first argument')
  t.throws(rtrav('string', MockCrock), err, 'Just throws with truthy string in first argument')
  t.throws(rtrav(false, MockCrock), err, 'Just throws with false in first argument')
  t.throws(rtrav(true, MockCrock), err, 'Just throws with true in first argument')
  t.throws(rtrav([], MockCrock), err, 'Just throws with an array in first argument')
  t.throws(rtrav({}, MockCrock), err, 'Just throws with an object in first argument')

  t.throws(rtrav(MockCrock, undefined), err, 'Just throws with undefined in second argument')
  t.throws(rtrav(MockCrock, null), err, 'Just throws with null in second argument')
  t.throws(rtrav(MockCrock, 0), err, 'Just throws falsey with number in second argument')
  t.throws(rtrav(MockCrock, 1), err, 'Just throws truthy with number in second argument')
  t.throws(rtrav(MockCrock, ''), err, 'Just throws falsey with string in second argument')
  t.throws(rtrav(MockCrock, 'string'), err, 'Just throws with truthy string in second argument')
  t.throws(rtrav(MockCrock, false), err, 'Just throws with false in second argument')
  t.throws(rtrav(MockCrock, true), err, 'Just throws with true in second argument')
  t.throws(rtrav(MockCrock, []), err, 'Just throws with an array in second argument')
  t.throws(rtrav(MockCrock, {}), err, 'Just throws with an object in second argument')


  t.doesNotThrow(rtrav(unit, MockCrock), 'Just requires an Applicative returning function in second argument')

  t.throws(ltrav(undefined, MockCrock), err, 'Nothing throws with undefined in first argument')
  t.throws(ltrav(null, MockCrock), err, 'Nothing throws with null in first argument')
  t.throws(ltrav(0, MockCrock), err, 'Nothing throws with falsey number in first argument')
  t.throws(ltrav(1, MockCrock), err, 'Nothing throws with truthy number in first argument')
  t.throws(ltrav('', MockCrock), err, 'Nothing throws with falsey string in first argument')
  t.throws(ltrav('string', MockCrock), err, 'Nothing throws with truthy string in first argument')
  t.throws(ltrav(false, MockCrock), err, 'Nothing throws with false in first argument')
  t.throws(ltrav(true, MockCrock), err, 'Nothing throws with true in first argument')
  t.throws(ltrav([], MockCrock), err, 'Nothing throws with an array in first argument')
  t.throws(ltrav({}, MockCrock), err, 'Nothing throws with an object in first argument')

  t.throws(ltrav(MockCrock, undefined), err, 'Nothing throws with undefined in second argument')
  t.throws(ltrav(MockCrock, null), err, 'Nothing throws with null in second argument')
  t.throws(ltrav(MockCrock, 0), err, 'Nothing throws falsey with number in second argument')
  t.throws(ltrav(MockCrock, 1), err, 'Nothing throws truthy with number in second argument')
  t.throws(ltrav(MockCrock, ''), err, 'Nothing throws falsey with string in second argument')
  t.throws(ltrav(MockCrock, 'string'), err, 'Nothing throws with truthy string in second argument')
  t.throws(ltrav(MockCrock, false), err, 'Nothing throws with false in second argument')
  t.throws(ltrav(MockCrock, true), err, 'Nothing throws with true in second argument')
  t.throws(ltrav(MockCrock, []), err, 'Nothing throws with an array in second argument')
  t.throws(ltrav(MockCrock, {}), err, 'Nothing throws with an object in second argument')

  const noAp = /Maybe.traverse: Both functions must return an Applicative/
  t.throws(rtrav(unit, unit), noAp, 'Just throws when first function does not return an Applicaitve')
  t.throws(ltrav(unit, unit), noAp, 'Nothing throws when first function does not return an Applicaitve')

  t.doesNotThrow(ltrav(MockCrock, unit), 'Nothing requires an Applicative returning function in the first arg')

  t.end()
})

test('Maybe traverse functionality', t => {
  const x = 'bubbles'
  const f = x => MockCrock(x)

  const r = Maybe.Just(x).traverse(f, MockCrock)
  const l = Maybe.Nothing().traverse(f, MockCrock)

  t.equal(r.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(r.valueOf().type(), 'Maybe', 'Provides an inner type of Maybe')
  t.equal(r.valueOf().option('Nothing'), x, 'Maybe contains original inner value')

  t.equal(l.type(), 'MockCrock', 'Provides an outer type of MockCrock')
  t.equal(l.valueOf().type(), 'Maybe', 'Provides an inner type of Maybe')
  t.equal(l.valueOf().option('Nothing'), 'Nothing', 'Maybe is a Nothing')

  const ar = x => [ x ]
  const arS = Maybe.Just(x).traverse(ar, ar)
  const arN = Maybe.Nothing().traverse(ar, ar)

  t.ok(isSameType(Array, arS), 'Provides an outer type of Array')
  t.ok(isSameType(Maybe, arS[0]), 'Provides an inner type of Maybe')
  t.same(arS[0].option('Nothing'), x, 'Maybe contains original inner value')

  t.ok(isSameType(Array, arN), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Maybe, arN[0]), 'Provides an inner type of Maybe')
  t.equal(arN[0].option('Nothing'), 'Nothing', 'Reports as a Nothing')

  t.end()
})
