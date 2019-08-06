const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')
const MockCrock = require('../test/MockCrock')

const bindFunc = helpers.bindFunc

const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const equals = require('../core/equals')
const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')
const isString = require('../core/isString')
const unit = require('../core/_unit')

const fl = require('../core/flNames')

const constant = x => () => x
const identity = x => x

const either =
  (f, g) => m => m.either(f, g)

const applyTo =
  x => fn => fn(x)

const Result = require('.')

test('Result', t => {
  const m = Result(0)

  t.ok(isFunction(Result), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.equals(Result.Ok(true).constructor, Result, 'provides TypeRep on constructor for Ok')
  t.equals(Result.Err(true).constructor, Result, 'provides TypeRep on constructor for Err')

  t.ok(isFunction(Result.of), 'provides an of function')
  t.ok(isFunction(Result.Err), 'provides an Err function')
  t.ok(isFunction(Result.Ok), 'provides an Ok function')
  t.ok(isFunction(Result.type), 'provides a type function')
  t.ok(isString(Result['@@type']), 'provides a @@type string')

  const err = /Result: Must wrap something, try using Err or Ok constructors/
  t.throws(Result, err, 'throws with no parameters')

  t.end()
})

test('Result fantasy-land api', t => {
  const e = Result.Err('')
  const o = Result.Ok('')

  t.ok(isFunction(Result[fl.of]), 'provides of function on constructor')

  t.ok(isFunction(e[fl.of]), 'provides of method on Err instance')
  t.ok(isFunction(e[fl.equals]), 'provides equals method on Err instance')
  t.ok(isFunction(e[fl.alt]), 'provides alt method on Err instance')
  t.ok(isFunction(e[fl.bimap]), 'provides bimap method on Err instance')
  t.ok(isFunction(e[fl.concat]), 'provides concat method on Err instance')
  t.ok(isFunction(e[fl.map]), 'provides map method on Err instance')
  t.ok(isFunction(e[fl.chain]), 'provides chain method on Err instance')

  t.ok(isFunction(o[fl.of]), 'provides of method on OK instance')
  t.ok(isFunction(o[fl.equals]), 'provides equals method on OK instance')
  t.ok(isFunction(o[fl.alt]), 'provides alt method on OK instance')
  t.ok(isFunction(o[fl.bimap]), 'provides bimap method on OK instance')
  t.ok(isFunction(o[fl.concat]), 'provides concat method on OK instance')
  t.ok(isFunction(o[fl.map]), 'provides map method on OK instance')
  t.ok(isFunction(o[fl.chain]), 'provides chain method on OK instance')

  t.end()
})

test('Result @@implements', t => {
  const f = Result['@@implements']

  t.equal(f('alt'), true, 'implements alt func')
  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('bimap'), true, 'implements bimap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('concat'), true, 'implements concat func')
  t.equal(f('equals'), true, 'implements equals func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')
  t.equal(f('traverse'), true, 'implements traverse func')

  t.end()
})

test('Result.Err', t => {
  const l = Result.Err('value')

  t.equal(l.either(identity, constant('Ok')), 'value', 'creates a Result.Err')

  t.end()
})

test('Result.Ok', t => {
  const r = Result.Ok('value')

  t.equal(r.either(constant('Err'), identity), 'value', 'creates a Result.Err')

  t.end()
})

test('Result inspect', t => {
  const l = Result.Err(0)
  const r = Result.Ok(1)

  t.ok(isFunction(l.inspect), 'Err provides an inspect function')
  t.equal(l.inspect, l.toString, 'toString is the same function as inspect')

  t.ok(isFunction(r.inspect), 'Ok provides an inspect function')
  t.equal(r.inspect, r.toString, 'toString is the same function as inspect')

  t.equal(l.inspect(), 'Err 0', 'Err returns inspect string')
  t.equal(r.inspect(), 'Ok 1', 'Ok returns inspect string')

  t.end()
})

test('Result type', t => {
  const { Err, Ok } = Result

  const m = Ok(0)
  const e = Err(0)

  t.ok(isFunction(m.type), 'is a function on Ok')
  t.ok(isFunction(e.type), 'is a function on Err')

  t.equal(Result.type, m.type, 'static and instance versions are the same for Ok')
  t.equal(Result.type, e.type, 'static and instance versions are the same for Err')

  t.equal(m.type(), 'Result', 'reports Result for Ok')
  t.equal(e.type(), 'Result', 'reports Result for Err')

  t.end()
})

test('Result @@type', t => {
  const { Err, Ok } = Result

  const m = Ok(0)
  const e = Err(0)

  t.equal(Result['@@type'], m['@@type'], 'static and instance versions are the same for Ok')
  t.equal(Result['@@type'], e['@@type'], 'static and instance versions are the same for Err')

  t.equal(m['@@type'], 'crocks/Result@4', 'reports crocks/Result@4 for Ok')
  t.equal(e['@@type'], 'crocks/Result@4', 'reports crocks/Result@4 for Err')

  t.end()
})

test('Result either', t => {
  const l = Result.Err('err')
  const r = Result.Ok('ok')

  const fn = bindFunc(Result.Ok(23).either)

  const err = /Result.either: Requires both invalid and valid functions/
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

  t.equal(l.either(identity, constant('err')), 'err', 'returns left function result when called on an Err')
  t.equal(r.either(constant('ok'), identity), 'ok', 'returns right function result when called on an Ok')

  t.end()
})

test('Result concat errors', t => {
  const m = { type: () => 'Result...Not' }

  const good = Result.Ok([])

  const f = bindFunc(Result.Ok([]).concat)

  const nonResultErr = /Result.concat: Result of Semigroup required/
  t.throws(f(undefined), nonResultErr, 'throws with undefined on Ok')
  t.throws(f(null), nonResultErr, 'throws with null on Ok')
  t.throws(f(0), nonResultErr, 'throws with falsey number on Ok')
  t.throws(f(1), nonResultErr, 'throws with truthy number on Ok')
  t.throws(f(''), nonResultErr, 'throws with falsey string on Ok')
  t.throws(f('string'), nonResultErr, 'throws with truthy string on Ok')
  t.throws(f(false), nonResultErr, 'throws with false on Ok')
  t.throws(f(true), nonResultErr, 'throws with true on Ok')
  t.throws(f([]), nonResultErr, 'throws with array on Ok')
  t.throws(f({}), nonResultErr, 'throws with object on Ok')
  t.throws(f(m), nonResultErr, 'throws with non-Result on Ok')

  const g = bindFunc(Result.Err(0).concat)

  t.throws(g(undefined), nonResultErr, 'throws with undefined on Err')
  t.throws(g(null), nonResultErr, 'throws with null on Err')
  t.throws(g(0), nonResultErr, 'throws with falsey number on Err')
  t.throws(g(1), nonResultErr, 'throws with truthy number on Err')
  t.throws(g(''), nonResultErr, 'throws with falsey string on Err')
  t.throws(g('string'), nonResultErr, 'throws with truthy string on Err')
  t.throws(g(false), nonResultErr, 'throws with false on Err')
  t.throws(g(true), nonResultErr, 'throws with true on Err')
  t.throws(g([]), nonResultErr, 'throws with array on Err')
  t.throws(g({}), nonResultErr, 'throws with object on Err')
  t.throws(g(m), nonResultErr, 'throws with non-Result on Err')

  const notSemiLeft = bindFunc(x => Result.Ok(x).concat(good))

  const innerErr = /Result.concat: Both containers must contain Semigroups of the same type/
  t.throws(notSemiLeft(undefined), innerErr, 'throws with undefined on left')
  t.throws(notSemiLeft(null), innerErr, 'throws with null on left')
  t.throws(notSemiLeft(0), innerErr, 'throws with falsey number on left')
  t.throws(notSemiLeft(1), innerErr, 'throws with truthy number on left')
  t.throws(notSemiLeft(''), innerErr, 'throws with falsey string on left')
  t.throws(notSemiLeft('string'), innerErr, 'throws with truthy string on left')
  t.throws(notSemiLeft(false), innerErr, 'throws with false on left')
  t.throws(notSemiLeft(true), innerErr, 'throws with true on left')
  t.throws(notSemiLeft({}), innerErr, 'throws with object on left')

  const notSemiRight = bindFunc(x => good.concat(Result.Ok(x)))

  t.throws(notSemiRight(undefined), innerErr, 'throws with undefined on right')
  t.throws(notSemiRight(null), innerErr, 'throws with null on right')
  t.throws(notSemiRight(0), innerErr, 'throws with falsey number on right')
  t.throws(notSemiRight(1), innerErr, 'throws with truthy number on right')
  t.throws(notSemiRight(''), innerErr, 'throws with falsey string on right')
  t.throws(notSemiRight('string'), innerErr, 'throws with truthy string on right')
  t.throws(notSemiRight(false), innerErr, 'throws with false on right')
  t.throws(notSemiRight(true), innerErr, 'throws with true on right')
  t.throws(notSemiRight({}), innerErr, 'throws with object on right')

  const noMatch = bindFunc(() => good.concat(Result.Ok('')))
  t.throws(noMatch({}), innerErr, 'throws with different semigroups')

  t.end()
})

test('Result concat fantasy-land errors', t => {
  const m = { type: () => 'Result...Not' }

  const good = Result.Ok([])

  const f = bindFunc(Result.Ok([])[fl.concat])

  const nonResultErr = /Result.fantasy-land\/concat: Result of Semigroup required/
  t.throws(f(undefined), nonResultErr, 'throws with undefined on Ok')
  t.throws(f(null), nonResultErr, 'throws with null on Ok')
  t.throws(f(0), nonResultErr, 'throws with falsey number on Ok')
  t.throws(f(1), nonResultErr, 'throws with truthy number on Ok')
  t.throws(f(''), nonResultErr, 'throws with falsey string on Ok')
  t.throws(f('string'), nonResultErr, 'throws with truthy string on Ok')
  t.throws(f(false), nonResultErr, 'throws with false on Ok')
  t.throws(f(true), nonResultErr, 'throws with true on Ok')
  t.throws(f([]), nonResultErr, 'throws with array on Ok')
  t.throws(f({}), nonResultErr, 'throws with object on Ok')
  t.throws(f(m), nonResultErr, 'throws with non-Result on Ok')

  const g = bindFunc(Result.Err(0)[fl.concat])

  t.throws(g(undefined), nonResultErr, 'throws with undefined on Err')
  t.throws(g(null), nonResultErr, 'throws with null on Err')
  t.throws(g(0), nonResultErr, 'throws with falsey number on Err')
  t.throws(g(1), nonResultErr, 'throws with truthy number on Err')
  t.throws(g(''), nonResultErr, 'throws with falsey string on Err')
  t.throws(g('string'), nonResultErr, 'throws with truthy string on Err')
  t.throws(g(false), nonResultErr, 'throws with false on Err')
  t.throws(g(true), nonResultErr, 'throws with true on Err')
  t.throws(g([]), nonResultErr, 'throws with array on Err')
  t.throws(g({}), nonResultErr, 'throws with object on Err')
  t.throws(g(m), nonResultErr, 'throws with non-Result on Err')

  const notSemiLeft = bindFunc(x => Result.Ok(x).concat(good))

  const innerErr = /Result.concat: Both containers must contain Semigroups of the same type/
  t.throws(notSemiLeft(undefined), innerErr, 'throws with undefined on left')
  t.throws(notSemiLeft(null), innerErr, 'throws with null on left')
  t.throws(notSemiLeft(0), innerErr, 'throws with falsey number on left')
  t.throws(notSemiLeft(1), innerErr, 'throws with truthy number on left')
  t.throws(notSemiLeft(''), innerErr, 'throws with falsey string on left')
  t.throws(notSemiLeft('string'), innerErr, 'throws with truthy string on left')
  t.throws(notSemiLeft(false), innerErr, 'throws with false on left')
  t.throws(notSemiLeft(true), innerErr, 'throws with true on left')
  t.throws(notSemiLeft({}), innerErr, 'throws with object on left')

  const notSemiRight = bindFunc(x => good.concat(Result.Ok(x)))

  t.throws(notSemiRight(undefined), innerErr, 'throws with undefined on right')
  t.throws(notSemiRight(null), innerErr, 'throws with null on right')
  t.throws(notSemiRight(0), innerErr, 'throws with falsey number on right')
  t.throws(notSemiRight(1), innerErr, 'throws with truthy number on right')
  t.throws(notSemiRight(''), innerErr, 'throws with falsey string on right')
  t.throws(notSemiRight('string'), innerErr, 'throws with truthy string on right')
  t.throws(notSemiRight(false), innerErr, 'throws with false on right')
  t.throws(notSemiRight(true), innerErr, 'throws with true on right')
  t.throws(notSemiRight({}), innerErr, 'throws with object on right')

  const noMatch = bindFunc(() => good.concat(Result.Ok('')))
  t.throws(noMatch({}), innerErr, 'throws with different semigroups')

  t.end()
})

test('Result concat functionality', t => {
  const extract =
    either(identity, identity)

  const left = Result.Err('Err')
  const a = Result.Ok([ 1, 2 ])
  const b = Result.Ok([ 4, 3 ])

  const right = a.concat(b)
  const leftRight = a.concat(left)
  const leftLeft = left.concat(a)

  t.ok(isSameType(Result, right), 'returns another Result with Ok')
  t.ok(isSameType(Result, leftRight), 'returns another Result with Err on right side')
  t.ok(isSameType(Result, leftLeft), 'returns another Result with Err on left side')

  t.same(extract(right), [ 1, 2, 4, 3 ], 'concats the inner semigroup with Oks')
  t.equals(extract(leftRight), 'Err', 'returns a Err with a Err on right side')
  t.equals(extract(leftLeft), 'Err', 'returns a Err with a Err on left side')

  t.end()
})

test('Result concat properties (Semigroup)', t => {
  const extract =
    either(identity, identity)

  const a = Result.Ok([ 'a' ])
  const b = Result.Ok([ 'b' ])
  const c = Result.Ok([ 'c' ])

  const left = a.concat(b).concat(c)
  const right = a.concat(b.concat(c))

  t.ok(isFunction(a.concat), 'provides a concat function')

  t.same(extract(left), extract(right), 'associativity')
  t.ok(isArray(extract(a.concat(b))), 'returns an Array')

  t.end()
})

test('Result swap', t => {
  const fn = bindFunc(Result.Ok(23).swap)

  const err = /Result.swap: Requires both left and right functions/
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

  const l = Result.Err('here').swap(constant('err'), identity)
  const r = Result.Ok('here').swap(identity, constant('ok'))

  t.ok(l.equals(Result.Ok('err')), 'returns a Result.Ok wrapping err')
  t.ok(r.equals(Result.Err('ok')), 'returns a Result.Err wrapping ok')

  t.end()
})

test('Result coalesce', t => {
  const fn = bindFunc(Result.Ok(23).coalesce)

  const err = /Result.coalesce: Requires both left and right functions/
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

  const l = Result.Err('here').coalesce(constant('was left'), identity)
  const r = Result.Ok('here').coalesce(identity, constant('was right'))

  t.ok(l.equals(Result.Ok('was left')),'returns an Result.Ok wrapping was left' )
  t.ok(r.equals(Result.Ok('was right')),'returns an Result.Ok wrapping was right' )

  t.end()
})

test('Result bichain left errors', t => {
  const { Err } = Result
  const bichain = bindFunc(Err(0).bichain)

  const err = /Result.bichain: Both arguments must be Result returning functions/
  t.throws(bichain(undefined, Err), err, 'throws with undefined on left')
  t.throws(bichain(null, Err), err, 'throws with null on left')
  t.throws(bichain(0, Err), err, 'throws with falsy number on left')
  t.throws(bichain(1, Err), err, 'throws with truthy number on left')
  t.throws(bichain('', Err), err, 'throws with falsy string on left')
  t.throws(bichain('string', Err), err, 'throws with truthy string on left')
  t.throws(bichain(false, Err), err, 'throws with false on left')
  t.throws(bichain(true, Err), err, 'throws with true on left')
  t.throws(bichain([], Err), err, 'throws with an array on left')
  t.throws(bichain({}, Err), err, 'throws with an object on left')

  t.throws(bichain(unit, Err), err, 'throws with a non-Result returning function')

  t.end()
})

test('Result bichain right errors', t => {
  const { Ok } = Result
  const bichain = bindFunc(Ok(0).bichain)

  const err = /Result.bichain: Both arguments must be Result returning functions/
  t.throws(bichain(Ok, undefined), err, 'throws with undefined on left')
  t.throws(bichain(Ok, null), err, 'throws with null on left')
  t.throws(bichain(Ok, 0), err, 'throws with falsy number on left')
  t.throws(bichain(Ok, 1), err, 'throws with truthy number on left')
  t.throws(bichain(Ok, ''), err, 'throws with falsy string on left')
  t.throws(bichain(Ok, 'string'), err, 'throws with truthy string on left')
  t.throws(bichain(Ok, false), err, 'throws with false on left')
  t.throws(bichain(Ok, true), err, 'throws with true on left')
  t.throws(bichain(Ok, []), err, 'throws with an array on left')
  t.throws(bichain(Ok, {}), err, 'throws with an object on left')

  t.throws(bichain(Ok, unit), err, 'throws with a non-Result returning function')

  t.end()
})

test('Result bichain functionality', t => {
  const { Err, Ok } = Result

  const left = x => Err(x + 1)
  const right = x => Ok(x + 1)

  t.ok(equals(Err(0).bichain(right, left), Ok(1)), 'moves from Err to Ok')
  t.ok(equals(Ok(0).bichain(right, left), Err(1)), 'moves from Ok to Err')
  t.ok(equals(Ok(0).bichain(left, right), Ok(1)), 'moves from Ok to Ok')
  t.ok(equals(Err(0).bichain(left, right), Err(1)), 'moves from Err to Err')

  t.end()
})

test('Result equals functionality', t => {
  const la = Result.Err(0)
  const lb = Result.Err(0)
  const lc = Result.Err(1)

  const ra = Result.Ok(0)
  const rb = Result.Ok(0)
  const rc = Result.Ok(1)

  const value = 1
  const nonResult = { type: 'Result...Not' }

  t.equal(la.equals(lc), false, 'returns false when 2 Err Results are not equal')
  t.equal(la.equals(lb), true, 'returns true when 2 Err Results are equal')
  t.equal(lc.equals(value), false, 'returns when Err passed a simple value')

  t.equal(ra.equals(rc), false, 'returns false when 2 Ok Results are not equal')
  t.equal(ra.equals(rb), true, 'returns true when 2 Ok Results are equal')
  t.equal(rc.equals(value), false, 'returns when Ok passed a simple value')

  t.equal(la.equals(nonResult), false, 'returns false when passed a non-Result')
  t.equal(ra.equals(lb), false, 'returns false when Err compared to Ok')

  t.end()
})

test('Result equals properties (Setoid)', t => {
  const la = Result.Err(0)
  const lb = Result.Err(0)
  const lc = Result.Err(1)
  const ld = Result.Err(0)

  const ra = Result.Ok(0)
  const rb = Result.Ok(0)
  const rc = Result.Ok(1)
  const rd = Result.Ok(0)

  t.ok(isFunction(Result(null).equals), 'provides an equals function')

  t.equal(la.equals(la), true, 'Err reflexivity')
  t.equal(la.equals(lb), lb.equals(la), 'Err symmetry (equal)')
  t.equal(la.equals(lc), lc.equals(la), 'Err symmetry (!equal)')
  t.equal(la.equals(lb) && lb.equals(ld), la.equals(ld), 'Err transitivity')

  t.equal(ra.equals(ra), true, 'Ok reflexivity')
  t.equal(ra.equals(rb), rb.equals(ra), 'Ok symmetry (equal)')
  t.equal(ra.equals(rc), rc.equals(ra), 'Ok symmetry (!equal)')
  t.equal(ra.equals(rb) && rb.equals(rd), ra.equals(rd), 'Ok transitivity')

  t.end()
})

test('Result map errors', t => {
  const rmap = bindFunc(Result.Ok(0).map)
  const lmap = bindFunc(Result.Err(0).map)

  const err = /Result.map: Function required/
  t.throws(rmap(undefined), err, 'right map throws with undefined')
  t.throws(rmap(null), err, 'right map throws with null')
  t.throws(rmap(0), err, 'right map throws with falsey number')
  t.throws(rmap(1), err, 'right map throws with truthy number')
  t.throws(rmap(''), err, 'right map throws with falsey string')
  t.throws(rmap('string'), err, 'right map throws with truthy string')
  t.throws(rmap(false), err, 'right map throws with false')
  t.throws(rmap(true), err, 'right map throws with true')
  t.throws(rmap([]), err, 'right map throws with an array')
  t.throws(rmap({}), err, 'right map throws iwth object')

  t.throws(lmap(undefined), err, 'left map throws with undefined')
  t.throws(lmap(null), err, 'left map throws with null')
  t.throws(lmap(0), err, 'left map throws with falsey number')
  t.throws(lmap(1), err, 'left map throws with truthy number')
  t.throws(lmap(''), err, 'left map throws with falsey string')
  t.throws(lmap('string'), err, 'left map throws with truthy string')
  t.throws(lmap(false), err, 'left map throws with false')
  t.throws(lmap(true), err, 'left map throws with true')
  t.throws(lmap([]), err, 'left map throws with an array')
  t.throws(lmap({}), err, 'left map throws iwth object')

  t.end()
})

test('Result map fantasy-land errors', t => {
  const rmap = bindFunc(Result.Ok(0)[fl.map])
  const lmap = bindFunc(Result.Err(0)[fl.map])

  const err = /Result.fantasy-land\/map: Function required/
  t.throws(rmap(undefined), err, 'right map throws with undefined')
  t.throws(rmap(null), err, 'right map throws with null')
  t.throws(rmap(0), err, 'right map throws with falsey number')
  t.throws(rmap(1), err, 'right map throws with truthy number')
  t.throws(rmap(''), err, 'right map throws with falsey string')
  t.throws(rmap('string'), err, 'right map throws with truthy string')
  t.throws(rmap(false), err, 'right map throws with false')
  t.throws(rmap(true), err, 'right map throws with true')
  t.throws(rmap([]), err, 'right map throws with an array')
  t.throws(rmap({}), err, 'right map throws iwth object')

  t.throws(lmap(undefined), err, 'left map throws with undefined')
  t.throws(lmap(null), err, 'left map throws with null')
  t.throws(lmap(0), err, 'left map throws with falsey number')
  t.throws(lmap(1), err, 'left map throws with truthy number')
  t.throws(lmap(''), err, 'left map throws with falsey string')
  t.throws(lmap('string'), err, 'left map throws with truthy string')
  t.throws(lmap(false), err, 'left map throws with false')
  t.throws(lmap(true), err, 'left map throws with true')
  t.throws(lmap([]), err, 'left map throws with an array')
  t.throws(lmap({}), err, 'left map throws iwth object')

  t.end()
})

test('Result map functionality', t => {
  const lspy = sinon.spy(identity)
  const rspy = sinon.spy(identity)

  const l = Result.Err(0).map(lspy)
  const r = Result.Ok(0).map(rspy)

  t.ok(isSameType(Result, l), 'returns an Result Type')
  t.equal(l.either(identity, constant(1)), 0, 'returns the original Err value')
  t.notOk(lspy.called, 'mapped function is never called when Err')

  t.ok(isSameType(Result, r), 'returns an Result Type')
  t.equal(r.either(constant(1), identity), 0, 'returns a Ok Result with the same value when mapped with identity')
  t.ok(rspy.called, 'mapped function is called when Ok')

  t.end()
})

test('Result map properties (Functor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  const Ok = Result.Ok
  const Err = Result.Err

  t.ok(isFunction(Err(0).map), 'left provides a map function')
  t.ok(isFunction(Ok(0).map), 'right provides a map function')

  t.equal(Ok(30).map(identity).either(constant(0), identity), 30, 'Ok identity')

  t.equal(
    Ok(10).map(compose(f, g)).either(constant(0), identity),
    Ok(10).map(g).map(f).either(constant(0), identity),
    'Ok composition'
  )

  t.equal(Err(45).map(identity).either(identity, constant(0)), 45, 'Err identity')
  t.equal(
    Err(10).map(compose(f, g)).either(identity, constant(0)),
    Err(10).map(g).map(f).either(identity, constant(0)),
    'Err composition'
  )

  t.end()
})

test('Result bimap errors', t => {
  const bimap = bindFunc(Result.Ok('popcorn').bimap)

  const err = /Result.bimap: Requires both left and right functions/
  t.throws(bimap(undefined, unit), err, 'throws with undefined in first argument')
  t.throws(bimap(null, unit), err, 'throws with null in first argument')
  t.throws(bimap(0, unit), err, 'throws with falsey number in first argument')
  t.throws(bimap(1, unit), err, 'throws with truthy number in first argument')
  t.throws(bimap('', unit), err, 'throws with falsey string in first argument')
  t.throws(bimap('string', unit), err, 'throws with truthy string in first argument')
  t.throws(bimap(false, unit), err, 'throws with false in first argument')
  t.throws(bimap(true, unit), err, 'throws with true in first argument')
  t.throws(bimap([], unit), err, 'throws with an array in first argument')
  t.throws(bimap({}, unit), err, 'throws with object in first argument')

  t.throws(bimap(unit, undefined), err, 'throws with undefined in second argument')
  t.throws(bimap(unit, null), err, 'throws with null in second argument')
  t.throws(bimap(unit, 0), err, 'throws with falsey number in second argument')
  t.throws(bimap(unit, 1), err, 'throws with truthy number in second argument')
  t.throws(bimap(unit, ''), err, 'throws with falsey string in second argument')
  t.throws(bimap(unit, 'string'), err, 'throws with truthy string in second argument')
  t.throws(bimap(unit, false), err, 'throws with false in second argument')
  t.throws(bimap(unit, true), err, 'throws with true in second argument')
  t.throws(bimap(unit, []), err, 'throws with an array in second argument')
  t.throws(bimap(unit, {}), err, 'throws with object in second argument')

  t.end()
})

test('Result bimap fantasy-land errors', t => {
  const bimap = bindFunc(Result.Ok('popcorn')[fl.bimap])

  const err = /Result.fantasy-land\/bimap: Requires both left and right functions/
  t.throws(bimap(undefined, unit), err, 'throws with undefined in first argument')
  t.throws(bimap(null, unit), err, 'throws with null in first argument')
  t.throws(bimap(0, unit), err, 'throws with falsey number in first argument')
  t.throws(bimap(1, unit), err, 'throws with truthy number in first argument')
  t.throws(bimap('', unit), err, 'throws with falsey string in first argument')
  t.throws(bimap('string', unit), err, 'throws with truthy string in first argument')
  t.throws(bimap(false, unit), err, 'throws with false in first argument')
  t.throws(bimap(true, unit), err, 'throws with true in first argument')
  t.throws(bimap([], unit), err, 'throws with an array in first argument')
  t.throws(bimap({}, unit), err, 'throws with object in first argument')

  t.throws(bimap(unit, undefined), err, 'throws with undefined in second argument')
  t.throws(bimap(unit, null), err, 'throws with null in second argument')
  t.throws(bimap(unit, 0), err, 'throws with falsey number in second argument')
  t.throws(bimap(unit, 1), err, 'throws with truthy number in second argument')
  t.throws(bimap(unit, ''), err, 'throws with falsey string in second argument')
  t.throws(bimap(unit, 'string'), err, 'throws with truthy string in second argument')
  t.throws(bimap(unit, false), err, 'throws with false in second argument')
  t.throws(bimap(unit, true), err, 'throws with true in second argument')
  t.throws(bimap(unit, []), err, 'throws with an array in second argument')
  t.throws(bimap(unit, {}), err, 'throws with object in second argument')

  t.end()
})

test('Result bimap properties (Bifunctor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  const e = either(identity, identity)

  t.ok(isFunction(Result.Err(0).bimap), 'left provides a bimap function')
  t.ok(isFunction(Result.Ok(0).bimap), 'right provides a bimap function')

  t.equal(e(Result.Ok(30).bimap(constant(0), identity)), 30, 'Ok identity')
  t.equal(
    e(Result.Ok(10).bimap(constant(0), compose(f, g))),
    e(Result.Ok(10).bimap(constant(0), g).bimap(constant(0), f)),
    'Ok composition'
  )

  t.equal(e(Result.Err(45).bimap(identity, constant(0))), 45, 'Err identity')
  t.equal(
    e(Result.Err(10).bimap(compose(f, g), constant(0))),
    e(Result.Err(10).bimap(g, constant(0)).bimap(f, constant(0))),
    'Err composition'
  )

  t.end()
})

test('Result alt errors', t => {
  const m = { type: () => 'Result...Not' }

  const altOk = bindFunc(Result.of(0).alt)

  const err = /Result.alt: Result required/
  t.throws(altOk(undefined), err, 'throws when passed an undefined with Ok')
  t.throws(altOk(null), err, 'throws when passed a null with Ok')
  t.throws(altOk(0), err, 'throws when passed a falsey number with Ok')
  t.throws(altOk(1), err, 'throws when passed a truthy number with Ok')
  t.throws(altOk(''), err, 'throws when passed a falsey string with Ok')
  t.throws(altOk('string'), err, 'throws when passed a truthy string with Ok')
  t.throws(altOk(false), err, 'throws when passed false with Ok')
  t.throws(altOk(true), err, 'throws when passed true with Ok')
  t.throws(altOk([]), err, 'throws when passed an array with Ok')
  t.throws(altOk({}), err, 'throws when passed an object with Ok')
  t.throws(altOk(m), err, 'throws when container types differ on Ok')

  const altErr = bindFunc(Result.Err(0).alt)

  t.throws(altErr(undefined), err, 'throws when passed an undefined with Err')
  t.throws(altErr(null), err, 'throws when passed a null with Err')
  t.throws(altErr(0), err, 'throws when passed a falsey number with Err')
  t.throws(altErr(1), err, 'throws when passed a truthy number with Err')
  t.throws(altErr(''), err, 'throws when passed a falsey string with Err')
  t.throws(altErr('string'), err, 'throws when passed a truthy string with Err')
  t.throws(altErr(false), err, 'throws when passed false with Err')
  t.throws(altErr(true), err, 'throws when passed true with Err')
  t.throws(altErr([]), err, 'throws when passed an array with Err')
  t.throws(altErr({}), err, 'throws when passed an object with Err')
  t.throws(altErr(m), err, 'throws when container types differ on Err')

  t.end()
})

test('Result alt fantasy-land errors', t => {
  const m = { type: () => 'Result...Not' }

  const altOk = bindFunc(Result.of(0)[fl.alt])

  const err = /Result.fantasy-land\/alt: Result required/
  t.throws(altOk(undefined), err, 'throws when passed an undefined with Ok')
  t.throws(altOk(null), err, 'throws when passed a null with Ok')
  t.throws(altOk(0), err, 'throws when passed a falsey number with Ok')
  t.throws(altOk(1), err, 'throws when passed a truthy number with Ok')
  t.throws(altOk(''), err, 'throws when passed a falsey string with Ok')
  t.throws(altOk('string'), err, 'throws when passed a truthy string with Ok')
  t.throws(altOk(false), err, 'throws when passed false with Ok')
  t.throws(altOk(true), err, 'throws when passed true with Ok')
  t.throws(altOk([]), err, 'throws when passed an array with Ok')
  t.throws(altOk({}), err, 'throws when passed an object with Ok')
  t.throws(altOk(m), err, 'throws when container types differ on Ok')

  const altErr = bindFunc(Result.Err(0)[fl.alt])

  t.throws(altErr(undefined), err, 'throws when passed an undefined with Err')
  t.throws(altErr(null), err, 'throws when passed a null with Err')
  t.throws(altErr(0), err, 'throws when passed a falsey number with Err')
  t.throws(altErr(1), err, 'throws when passed a truthy number with Err')
  t.throws(altErr(''), err, 'throws when passed a falsey string with Err')
  t.throws(altErr('string'), err, 'throws when passed a truthy string with Err')
  t.throws(altErr(false), err, 'throws when passed false with Err')
  t.throws(altErr(true), err, 'throws when passed true with Err')
  t.throws(altErr([]), err, 'throws when passed an array with Err')
  t.throws(altErr({}), err, 'throws when passed an object with Err')
  t.throws(altErr(m), err, 'throws when container types differ on Err')

  t.end()
})

test('Result alt functionality with Semigroup Err', t => {
  const right = Result.of('Ok')
  const anotherOk = Result.of('Another Ok')

  const left = Result.Err([ 'Err' ])
  const anotherErr = Result.Err([ 'Another Err' ])

  const f = either(identity, identity)

  t.equals(f(right.alt(left).alt(anotherOk)), 'Ok', 'retains first Ok success')
  t.same(f(left.alt(anotherErr)), [ 'Err', 'Another Err' ], 'provdes accumulated Err when all Errs')

  t.end()
})

test('Result alt functionality without Semigroup Err', t => {
  const right = Result.of('Ok')
  const anotherOk = Result.of('Another Ok')

  const left = Result.Err(3)
  const anotherErr = Result.Err(13)

  const f = either(identity, identity)

  t.equals(f(right.alt(left).alt(anotherOk)), 'Ok', 'retains first Ok success')
  t.same(f(left.alt(anotherErr)), 13, 'provdes last Err when all Errs')

  t.end()
})

test('Result alt properties (Alt)', t => {
  const a = Result.of('a')
  const b = Result.Err('Err')
  const c = Result.of('c')

  const f = either(identity, identity)

  t.equals(f(a.alt(b).alt(c)), f(a.alt(b.alt(c))), 'assosiativity')

  t.equals(
    f(a.alt(b).map(identity)),
    f(a.map(identity).alt(b.map(identity))),
    'distributivity'
  )

  t.end()
})

test('Result ap errors', t => {
  const m = { type: () => 'Result...Not' }

  const left = bindFunc(x => Result.Ok(x).ap(Result.Ok(0)))
  const right = bindFunc(x => Result.Ok(unit).ap(x))

  const noFunc = /Result.ap: Wrapped value must be a function/
  t.throws(left(undefined), noFunc, 'throws when wrapped value is an undefined')
  t.throws(left(null), noFunc, 'throws when wrapped value is a null')
  t.throws(left(0), noFunc, 'throws when wrapped value is a falsey number')
  t.throws(left(1), noFunc, 'throws when wrapped value is a truthy number')
  t.throws(left(''), noFunc, 'throws when wrapped value is a falsey string')
  t.throws(left('string'), noFunc, 'throws when wrapped value is a truthy string')
  t.throws(left(false), noFunc, 'throws when wrapped value is false')
  t.throws(left(true), noFunc, 'throws when wrapped value is true')
  t.throws(left([]), noFunc, 'throws when wrapped value is an array')
  t.throws(left({}), noFunc, 'throws when wrapped value is an object')

  const noResult = /Result.ap: Result required/
  t.throws(right(undefined), noResult, 'throws when passed an undefined')
  t.throws(right(null), noResult, 'throws when passed a null')
  t.throws(right(0), noResult, 'throws when passed a falsey number')
  t.throws(right(1), noResult, 'throws when passed a truthy number')
  t.throws(right(''), noResult, 'throws when passed a falsey string')
  t.throws(right('string'), noResult, 'throws when passed a truthy string')
  t.throws(right(false), noResult, 'throws when passed false')
  t.throws(right(true), noResult, 'throws when passed true')
  t.throws(right([]), noResult, 'throws when passed an array')
  t.throws(right({}), noResult, 'throws when passed an object')
  t.throws(right(m), noResult, 'throws when container types differ on Ok')

  t.end()
})

test('Result Err ap functionality', t => {
  const Err = Result.Err
  const m = Result.Ok(x => () => () => x)

  const extract = either(identity, constant('Ok'))

  const sameSemigroup = m.ap(Err([ 1 ])).ap(Err([ 2 ]).ap(Err([ 3 ])))
  const diffSemigroup = m.ap(Err([ 1 ])).ap(Err('2')).ap(Err([ 3 ]))
  const noSemi = m.ap(Err(1)).ap(Err(2)).ap(Err(3))
  const withOk = m.ap(Err([ 1 ])).ap(Result.Ok(2)).ap(Result.Err([ 3 ]))

  t.ok(isSameType(Result), 'returns a Result')

  t.same(extract(sameSemigroup), [ 1, 2, 3 ], 'concats errors when semigroups are the same')
  t.same(extract(diffSemigroup), [ 1, 3 ], 'concats errors when semigroups are the same as first')
  t.same(extract(noSemi), 1, 'Only returns first Err, if first Err is not a semigroup')
  t.same(extract(withOk), [ 1, 3 ], 'Only concats Err, will skip over Ok')

  t.end()
})

test('Result ap properties (Apply)', t => {
  const Ok = Result.Ok
  const m = Ok(identity)

  const a = m.map(compose).ap(m).ap(m)
  const b = m.ap(m.ap(m))

  t.ok(isFunction(m.ap), 'provides an ap function')
  t.ok(isFunction(m.map), 'implements the Functor spec')

  t.equal(
    a.ap(Ok(3)).either(constant(0), identity),
    b.ap(Ok(3)).either(constant(0), identity),
    'composition Ok'
  )

  t.end()
})

test('Result of', t => {
  t.equal(Result.of, Result(0).of, 'Result.of is the same as the instance version')
  t.ok(isSameType(Result, Result.of(0)), 'returns an Result')
  t.equal(Result.of(0).either(constant('left'), identity), 0, 'wraps the value into an Result.Ok')

  t.end()
})

test('Result of properties (Applicative)', t => {
  const Ok = Result.Ok
  const Err = Result.Err

  const r = Ok(identity)
  const l = Err('left')

  t.ok(isFunction(r.of), 'Ok provides an of function')
  t.ok(isFunction(l.of), 'Err provides an of function')
  t.ok(isFunction(r.ap), 'Ok implements the Apply spec')
  t.ok(isFunction(l.ap), 'Err implements the Apply spec')

  t.equal(r.ap(Ok(3)).either(constant(0), identity), 3, 'identity Ok')
  t.equal(
    r.ap(Result.of(3)).either(constant(0), identity),
    Result.of(3).either(constant(0), identity),
    'homomorphism Ok'
  )

  const a = x => r.ap(Result.of(x))
  const b = x => Result.of(applyTo(x)).ap(r)

  t.equal(
    a(3).either(constant(0),identity),
    b(3).either(constant(0),identity),
    'interchange Ok'
  )

  t.end()
})

test('Result chain errors', t => {
  const ochain = bindFunc(Result.Ok(0).chain)
  const echain = bindFunc(Result.Err(0).chain)

  const err = /Result.chain: Result returning function required/
  t.throws(ochain(undefined), err, 'Ok throws with undefined')
  t.throws(ochain(null), err, 'Ok throws with null')
  t.throws(ochain(0), err, 'Ok throws falsey with number')
  t.throws(ochain(1), err, 'Ok throws truthy with number')
  t.throws(ochain(''), err, 'Ok throws falsey with string')
  t.throws(ochain('string'), err, 'Ok throws with truthy string')
  t.throws(ochain(false), err, 'Ok throws with false')
  t.throws(ochain(true), err, 'Ok throws with true')
  t.throws(ochain([]), err, 'Ok throws with an array')
  t.throws(ochain({}), err, 'Ok throws with an object')

  t.throws(echain(undefined), err, 'Err throws with undefined')
  t.throws(echain(null), err, 'Err throws with null')
  t.throws(echain(0), err, 'Err throws with falsey number')
  t.throws(echain(1), err, 'Err throws with truthy number')
  t.throws(echain(''), err, 'Err throws with falsey string')
  t.throws(echain('string'), err, 'Err throws with truthy string')
  t.throws(echain(false), err, 'Err throws with false')
  t.throws(echain(true), err, 'Err throws with true')
  t.throws(echain([]), err, 'Err throws with an array')
  t.throws(echain({}), err, 'Err throws with an object')

  const errNoResult = /Result.chain: Function must return a Result/
  t.throws(ochain(unit), errNoResult, 'Ok throws with a non Result returning function')

  t.end()
})

test('Result chain errors', t => {
  const ochain = bindFunc(Result.Ok(0)[fl.chain])
  const echain = bindFunc(Result.Err(0)[fl.chain])

  const err = /Result.fantasy-land\/chain: Result returning function required/
  t.throws(ochain(undefined), err, 'Ok throws with undefined')
  t.throws(ochain(null), err, 'Ok throws with null')
  t.throws(ochain(0), err, 'Ok throws falsey with number')
  t.throws(ochain(1), err, 'Ok throws truthy with number')
  t.throws(ochain(''), err, 'Ok throws falsey with string')
  t.throws(ochain('string'), err, 'Ok throws with truthy string')
  t.throws(ochain(false), err, 'Ok throws with false')
  t.throws(ochain(true), err, 'Ok throws with true')
  t.throws(ochain([]), err, 'Ok throws with an array')
  t.throws(ochain({}), err, 'Ok throws with an object')

  t.throws(echain(undefined), err, 'Err throws with undefined')
  t.throws(echain(null), err, 'Err throws with null')
  t.throws(echain(0), err, 'Err throws with falsey number')
  t.throws(echain(1), err, 'Err throws with truthy number')
  t.throws(echain(''), err, 'Err throws with falsey string')
  t.throws(echain('string'), err, 'Err throws with truthy string')
  t.throws(echain(false), err, 'Err throws with false')
  t.throws(echain(true), err, 'Err throws with true')
  t.throws(echain([]), err, 'Err throws with an array')
  t.throws(echain({}), err, 'Err throws with an object')

  const errNoResult = /Result.fantasy-land\/chain: Function must return a Result/
  t.throws(ochain(unit), errNoResult, 'Ok throws with a non Result returning function')

  t.end()
})

test('Result chain properties (Chain)', t => {
  const Ok = Result.Ok
  const Err = Result.Err

  t.ok(isFunction(Ok(0).chain), 'Ok provides a chain function')
  t.ok(isFunction(Ok(0).ap), 'Ok implements the Apply spec')

  t.ok(isFunction(Err(0).chain), 'Err provides a chain function')
  t.ok(isFunction(Err(0).ap), 'Err implements the Apply spec')

  const f = x => Ok(x + 2)
  const g = x => Ok(x + 10)

  const a = x => Ok(x).chain(f).chain(g)
  const b = x => Ok(x).chain(y => f(y).chain(g))

  t.equal(
    a(10).either(constant(0), identity),
    b(10).either(constant(0), identity),
    'assosiativity Ok'
  )

  t.end()
})

test('Result chain properties (Monad)', t => {
  const Ok = Result.Ok

  t.ok(isFunction(Ok(0).chain), 'Ok implements the Chain spec')
  t.ok(isFunction(Ok(0).of), 'Ok implements the Applicative spec')

  const f = x => Ok(x)

  t.equal(
    Result.of(3).chain(f).either(constant(0), identity),
    f(3).either(constant(0), identity),
    'left identity Ok'
  )

  const m = x => Ok(x)

  t.equal(
    m(3).chain(Result.of).either(constant(0), identity),
    m(3).either(constant(0), identity),
    'right identity Ok'
  )

  t.end()
})

test('Result sequence errors', t => {
  const oSeq = bindFunc(Result.Ok(MockCrock(0)).sequence)
  const eSeq = bindFunc(Result.Err('Err').sequence)

  const oSeqBad = bindFunc(Result.Ok(0).sequence)

  const noFunc = /Result.sequence: Applicative TypeRep or Apply returning function required/
  t.throws(oSeq(undefined), noFunc, 'Ok throws with undefined')
  t.throws(oSeq(null), noFunc, 'Ok throws with null')
  t.throws(oSeq(0), noFunc, 'Ok throws falsey with number')
  t.throws(oSeq(1), noFunc, 'Ok throws truthy with number')
  t.throws(oSeq(''), noFunc, 'Ok throws falsey with string')
  t.throws(oSeq('string'), noFunc, 'Ok throws with truthy string')
  t.throws(oSeq(false), noFunc, 'Ok throws with false')
  t.throws(oSeq(true), noFunc, 'Ok throws with true')
  t.throws(oSeq([]), noFunc, 'Ok throws with an array')
  t.throws(oSeq({}), noFunc, 'Ok throws with an object')

  t.throws(eSeq(undefined), noFunc, 'Err throws with undefined')
  t.throws(eSeq(null), noFunc, 'Err throws with null')
  t.throws(eSeq(0), noFunc, 'Err throws with falsey number')
  t.throws(eSeq(1), noFunc, 'Err throws with truthy number')
  t.throws(eSeq(''), noFunc, 'Err throws with falsey string')
  t.throws(eSeq('string'), noFunc, 'Err throws with truthy string')
  t.throws(eSeq(false), noFunc, 'Err throws with false')
  t.throws(eSeq(true), noFunc, 'Err throws with true')
  t.throws(eSeq([]), noFunc, 'Err throws with an array')
  t.throws(eSeq({}), noFunc, 'Err throws with an object')

  const noApply = /Result.sequence: Must wrap an Apply/
  t.throws(oSeqBad(unit), noApply, 'Ok without wrapping Apply throws')

  t.end()
})

test('Result sequence with Apply function', t => {
  const Ok = Result.Ok
  const Err = Result.Err

  const x = 284
  const fn = x => MockCrock(x)

  const o = Ok(MockCrock(x)).sequence(fn)
  const e = Err('Err').sequence(fn)

  t.ok(isSameType(MockCrock, o), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Result, o.valueOf()), 'Provides an inner type of Result')
  t.equal(o.valueOf().either(constant(0), identity), x, 'Result contains original inner value')

  t.ok(isSameType(MockCrock, e), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Result, e.valueOf()), 'Provides an inner type of Result')
  t.equal(e.valueOf().either(identity, constant(0)), 'Err', 'Result contains original Err value')

  const ar = x => [ x ]
  const arO = Ok([ x ]).sequence(ar)
  const arE = Err('Err').sequence(ar)

  t.ok(isSameType(Array, arO), 'Provides an outer type of Array')
  t.ok(isSameType(Result, arO[0]), 'Provides an inner type of Result')
  t.equal(arO[0].either(constant(0), identity), x, 'Result contains original inner value')

  t.ok(isSameType(Array, arE), 'Provides an outer type of Array')
  t.ok(isSameType(Result, arE[0]), 'Provides an inner type of Result')
  t.equal(arE[0].either(identity, constant(0)), 'Err', 'Result contains original Err value')

  t.end()
})

test('Result sequence with Applicative TypeRep', t => {
  const Ok = Result.Ok
  const Err = Result.Err

  const x = 'string'

  const o = Ok(MockCrock(x)).sequence(MockCrock)
  const e = Err('Err').sequence(MockCrock)

  t.ok(isSameType(MockCrock, o), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Result, o.valueOf()), 'Provides an inner type of Result')
  t.equal(o.valueOf().either(constant(0), identity), x, 'Result contains original inner value')

  t.ok(isSameType(MockCrock, e), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Result, e.valueOf()), 'Provides an inner type of Result')
  t.equal(e.valueOf().either(identity, constant(0)), 'Err', 'Result contains original Err value')

  const arO = Ok([ x ]).sequence(Array)
  const arE = Err('Err').sequence(Array)

  t.ok(isSameType(Array, arO), 'Provides an outer type of Array')
  t.ok(isSameType(Result, arO[0]), 'Provides an inner type of Result')
  t.equal(arO[0].either(constant(0), identity), x, 'Result contains original inner value')

  t.ok(isSameType(Array, arE), 'Provides an outer type of Array')
  t.ok(isSameType(Result, arE[0]), 'Provides an inner type of Result')
  t.equal(arE[0].either(identity, constant(0)), 'Err', 'Result contains original Err value')

  t.end()
})

test('Result traverse errors', t => {
  const otrav = bindFunc(Result.Ok(0).traverse)
  const etrav = bindFunc(Result.Err('Err').traverse)

  const f = x => MockCrock(x)

  const first = /Result.traverse: Applicative TypeRep of Apply returning function required for first argument/
  const last = /Result.traverse: Apply returning functions required for both arguments/

  t.throws(otrav(undefined, unit), first, 'Ok throws with undefined in first argument')
  t.throws(otrav(null, unit), first, 'Ok throws with null in first argument')
  t.throws(otrav(0, unit), first, 'Ok throws falsey with number in first argument')
  t.throws(otrav(1, unit), first, 'Ok throws truthy with number in first argument')
  t.throws(otrav('', unit), first, 'Ok throws falsey with string in first argument')
  t.throws(otrav('string', unit), first, 'Ok throws with truthy string in first argument')
  t.throws(otrav(false, unit), first, 'Ok throws with false in first argument')
  t.throws(otrav(true, unit), first, 'Ok throws with true in first argument')
  t.throws(otrav([], unit), first, 'Ok throws with an array in first argument')
  t.throws(otrav({}, unit), first, 'Ok throws with an object in first argument')

  t.throws(otrav(f, undefined), last, 'Ok throws with undefined in second argument')
  t.throws(otrav(f, null), last, 'Ok throws with null in second argument')
  t.throws(otrav(f, 0), last, 'Ok throws falsey with number in second argument')
  t.throws(otrav(f, 1), last, 'Ok throws truthy with number in second argument')
  t.throws(otrav(f, ''), last, 'Ok throws falsey with string in second argument')
  t.throws(otrav(f, 'string'), last, 'Ok throws with truthy string in second argument')
  t.throws(otrav(f, false), last, 'Ok throws with false in second argument')
  t.throws(otrav(f, true), last, 'Ok throws with true in second argument')
  t.throws(otrav(f, []), last, 'Ok throws with an array in second argument')
  t.throws(otrav(f, {}), last, 'Ok throws with an object in second argument')

  t.throws(etrav(undefined, MockCrock), first, 'Err throws with undefined in first argument')
  t.throws(etrav(null, MockCrock), first, 'Err throws with null in first argument')
  t.throws(etrav(0, MockCrock), first, 'Err throws with falsey number in first argument')
  t.throws(etrav(1, MockCrock), first, 'Err throws with truthy number in first argument')
  t.throws(etrav('', MockCrock), first, 'Err throws with falsey string in first argument')
  t.throws(etrav('string', MockCrock), first, 'Err throws with truthy string in first argument')
  t.throws(etrav(false, MockCrock), first, 'Err throws with false in first argument')
  t.throws(etrav(true, MockCrock), first, 'Err throws with true in first argument')
  t.throws(etrav([], MockCrock), first, 'Err throws with an array in first argument')
  t.throws(etrav({}, MockCrock), first, 'Err throws with an object in first argument')

  t.throws(etrav(unit, undefined), last, 'Err throws with undefined in second argument')
  t.throws(etrav(unit, null), last, 'Err throws with null in second argument')
  t.throws(etrav(unit, 0), last, 'Err throws falsey with number in second argument')
  t.throws(etrav(unit, 1), last, 'Err throws truthy with number in second argument')
  t.throws(etrav(unit, ''), last, 'Err throws falsey with string in second argument')
  t.throws(etrav(unit, 'string'), last, 'Err throws with truthy string in second argument')
  t.throws(etrav(unit, false), last, 'Err throws with false in second argument')
  t.throws(etrav(unit, true), last, 'Err throws with true in second argument')
  t.throws(etrav(unit, []), last, 'Err throws with an array in second argument')
  t.throws(etrav(unit, {}), last, 'Err throws with an object in second argument')

  const noApply = /Result.traverse: Both functions must return an Apply of the same type/
  t.throws(otrav(unit, unit), noApply, 'Ok throws when first function does not return an Applicative')
  t.throws(etrav(unit, unit), noApply, 'Err throws when second function does not return an Applicative')

  t.end()
})

test('Result traverse with Apply function', t => {
  const Ok = Result.Ok
  const Err = Result.Err

  const x = 98
  const res = 'result'
  const fn = m => constant(m(res))

  const f = x => MockCrock(x)
  const r = Ok(x).traverse(f, fn(MockCrock))
  const l = Err('Err').traverse(f, fn(MockCrock))

  t.ok(isSameType(MockCrock, r), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Result, r.valueOf()), 'Provides an inner type of Result')
  t.equal(r.valueOf().either(constant(0), identity), res, 'Result contains transformed value')

  t.ok(isSameType(MockCrock, l), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Result, l.valueOf()), 'Provides an inner type of Result')
  t.equal(l.valueOf().either(identity, constant(0)), 'Err', 'Result contains original Err value')

  const ar = x => [ x ]
  const arO = Ok(x).traverse(ar, fn(ar))
  const arE = Err('Err').traverse(ar, fn(ar))

  t.ok(isSameType(Array, arO), 'Provides an outer type of Array')
  t.ok(isSameType(Result, arO[0]), 'Provides an inner type of Result')
  t.equal(arO[0].either(constant(0), identity), res, 'Result contains original inner value')

  t.ok(isSameType(Array, arE), 'Provides an outer type of Array')
  t.ok(isSameType(Result, arE[0]), 'Provides an inner type of Result')
  t.equal(arE[0].either(identity, constant(0)), 'Err', 'Result contains original Err value')

  t.end()
})

test('Result traverse with Applicative TypeRep', t => {
  const Ok = Result.Ok
  const Err = Result.Err

  const x = 98
  const res = false
  const fn = m => constant(m(res))

  const r = Ok(x).traverse(MockCrock, fn(MockCrock))
  const l = Err('Err').traverse(MockCrock, fn(MockCrock))

  t.ok(isSameType(MockCrock, r), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Result, r.valueOf()), 'Provides an inner type of Result')
  t.equal(r.valueOf().either(constant(0), identity), res, 'Result contains transformed value')

  t.ok(isSameType(MockCrock, l), 'Provides an outer type of MockCrock')
  t.ok(isSameType(Result, l.valueOf()), 'Provides an inner type of Result')
  t.equal(l.valueOf().either(identity, constant(0)), 'Err', 'Result contains original Err value')

  const ar = x => [ x ]
  const arO = Ok(x).traverse(Array, fn(ar))
  const arE = Err('Err').traverse(Array, fn(ar))

  t.ok(isSameType(Array, arO), 'Provides an outer type of Array')
  t.ok(isSameType(Result, arO[0]), 'Provides an inner type of Result')
  t.equal(arO[0].either(constant(0), identity), res, 'Result contains original inner value')

  t.ok(isSameType(Array, arE), 'Provides an outer type of Array')
  t.ok(isSameType(Result, arE[0]), 'Provides an inner type of Result')
  t.equal(arE[0].either(identity, constant(0)), 'Err', 'Result contains original Err value')

  t.end()
})
