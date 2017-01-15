const test = require('tape')
const sinon = require('sinon')

const helpers = require('../test/helpers')

const noop = helpers.noop
const bindFunc = helpers.bindFunc
const isObject = require('../predicates/isObject')
const isFunction = require('../predicates/isFunction')

const constant = require('../combinators/constant')
const composeB = require('../combinators/composeB')
const identity = require('../combinators/identity')
const reverseApply = require('../combinators/reverseApply')

const Async = require('./Async')

test('Async', t => {
  const m = Async(noop)
  const a = bindFunc(Async)

  t.ok(isFunction(Async), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Async.of), 'provides an of function')
  t.ok(isFunction(Async.type), 'provides a type function')
  t.ok(isFunction(Async.rejected), 'provides a rejected function')
  t.ok(isFunction(Async.fromPromise), 'provides a fromPromise function')

  t.throws(Async, TypeError, 'throws with no parameters')
  t.throws(a(undefined), TypeError, 'throws with undefined')
  t.throws(a(null), TypeError, 'throws with null')
  t.throws(a(0), TypeError, 'throws with falsey number')
  t.throws(a(1), TypeError, 'throws with truthy number')
  t.throws(a(''), TypeError, 'throws with falsey string')
  t.throws(a('string'), TypeError, 'throws with truthy string')
  t.throws(a(false), TypeError, 'throws with false')
  t.throws(a(true), TypeError, 'throws with true')
  t.throws(a([]), TypeError, 'throws with an array')
  t.throws(a({}), TypeError, 'throws with an object')

  t.end()
})

test('Async rejected', t => {
  const x = 'sorry'
  const m = Async.rejected(x)

  const rej = sinon.spy()
  const res = sinon.spy()

  m.fork(rej, res)

  t.ok(rej.calledWith(x), 'calls the rejected function with rejected value')
  t.notOk(res.called, 'does not call the resolved function')

  t.end()
})

test('Async fromPromise', t => {
  const val = 'super fun'

  const rejProm = x => new Promise((_, rej) => rej(x))
  const resProm = x => new Promise((res, _) => res(x))

  const rej = y => x => t.equal(x, y, 'rejects a rejected Promise')
  const res = y => x => t.equal(x, y, 'resolves a resolved Promise')

  Async.fromPromise(rejProm)(val).fork(rej(val), res(val))
  Async.fromPromise(resProm)(val).fork(rej(val), res(val))

  t.plan(2)
})

test('Async inspect', t => {
  const a = Async(noop)

  t.ok(isFunction(a.inspect), 'provides an inspect function')
  t.equals(a.inspect(), 'Async Function', 'returns the expected result')

  t.end()
})

test('Async type', t => {
  t.equal(Async(noop).type(), 'Async', 'returns Async')

  t.end()
})

test('Async fork', t => {
  const resolved = Async((_, res) => res('resolved'))
  const rejected = Async((rej, _) => rej('rejected'))

  const res = sinon.spy(identity)
  const rej = sinon.spy(identity)
  const noCall = sinon.spy(noop)

  resolved.fork(noCall, res)
  rejected.fork(rej, noCall)

  t.ok(res.calledWith('resolved'), 'calls resolved function when Async is resolved')
  t.ok(rej.calledWith('rejected'), 'calls rejected function when Async is rejected')
  t.notOk(noCall.called, 'does not call the other function')

  t.end()
})

test('Async toPromise', t => {
  const val = 1337

  const rej = y => x => t.equal(x, y, 'rejects a rejected Async')
  const res = y => x => t.equal(x, y, 'resolves a resolved Async')

  Async.rejected(val).toPromise().then(res(val)).catch(rej(val))
  Async.of(val).toPromise().then(res(val)).catch(rej(val))

  t.plan(2)
})

test('Async swap', t => {
  const fn = bindFunc(Async(noop).swap)

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

  const rejected = Async((rej, _) => rej('silly')).swap(constant('was rejected'), identity)
  const resolved = Async((_, res) => res('silly')).swap(identity, constant('was resolved'))

  const rej = sinon.spy()
  const res = sinon.spy()
  const noCall = sinon.spy()

  rejected.fork(noCall, res)
  resolved.fork(rej, noCall)

  t.ok(res.calledWith('was rejected'), 'rejects a resolved Async')
  t.ok(rej.calledWith('was resolved'), 'resolves a rejected Async')

  t.end()
})

test('Async coalesce', t => {
  const fn = bindFunc(Async(noop).coalesce)

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

  const rejected = Async((rej, _) => rej()).coalesce(constant('was rejected'), identity)
  const resolved = Async((_, res) => res()).coalesce(identity, constant('was resolved'))

  const rej = sinon.spy()
  const res = sinon.spy()

  rejected.fork(noop, rej)
  resolved.fork(noop, res)

  t.ok(rej.calledWith('was rejected'), 'resolves a rejected, applying left coalesce function')
  t.ok(res.calledWith('was resolved'), 'resolves a resolved, applying right coalesce function')


  t.end()
})

test('Async map errors', t => {
  const map = bindFunc(Async(noop).map)

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

test('Async map functionality', t => {
  const mapFn = sinon.spy()

  const rejected = Async((rej, _) => rej('rejected')).map(mapFn).fork(noop, noop)
  const resolved = Async((_, res) => res('resolved')).map(mapFn).fork(noop, noop)

  t.equal(Async(noop).map(noop).type(), 'Async', 'returns an Async')
  t.ok(mapFn.calledWith('resolved'), 'calls map function on resolved')
  t.notOk(mapFn.calledWith('rejected'), 'does not calls map function on rejected')

  t.end()
})

test('Async map properties (Functor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  t.ok(isFunction(Async(noop).map), 'provides a map function')

  const x = 30
  const id = sinon.spy()

  Async((_, res) => res(x)).map(identity).fork(noop, id)

  const y = 10
  const left = sinon.spy()
  const right = sinon.spy()

  Async((_, res) => res(y)).map(composeB(f, g)).fork(noop, left)
  Async((_, res) => res(y)).map(g).map(f).fork(noop, right)

  t.ok(id.calledWith(x), 'identity')
  t.same(left.args[0], right.args[0], 'composition')

  t.end()
})

test('Async bimap errors', t => {
  const bimap = bindFunc(Async(noop).bimap)

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

test('Async bimap functionality', t => {
  const left = sinon.spy(constant('left'))
  const right = sinon.spy(constant('right'))

  const rej = sinon.spy()
  const res = sinon.spy()

  Async((rej, _) => rej('rejected')).bimap(left, right).fork(rej, res)
  Async((_, res) => res('resolved')).bimap(left, right).fork(rej, res)

  t.equal(Async(noop).bimap(noop, noop).type(), 'Async', 'returns an Async')

  t.ok(rej.calledWith('left'), 'reject called with result of left function')
  t.ok(res.calledWith('right'), 'resolve called with result of right function')

  t.ok(left.calledWith('rejected'), 'left function called with rejected value')
  t.ok(right.calledWith('resolved'), 'right function called with resolved value')

  t.end()
})

test('Async bimap properties (Bifunctor)', t => {
  const bimap = (f, g) => m => m.bimap(f, g)

  const rej = Async.rejected(10)
  const res = Async.of(10)

  const rejId = sinon.spy()
  const resId = sinon.spy()

  const bimapId = bimap(identity, identity)

  rej.fork(rejId, noop)
  bimapId(rej).fork(rejId, noop)

  res.fork(noop, resId)
  bimapId(res).fork(noop, resId)

  t.same(rejId.args[0], rejId.args[1], 'rejected identity')
  t.same(resId.args[0], resId.args[1], 'resolved identity')

  const f = x => x + 2
  const g = x => x * 2
  const comp = composeB(f, g)

  const rejComp = sinon.spy()
  const resComp = sinon.spy()

  const bimapComp = bimap(comp, comp)

  bimapComp(rej).fork(rejComp, noop)
  rej.bimap(g, g).bimap(f, f).fork(rejComp, noop)

  bimapComp(res).fork(noop, resComp)
  res.bimap(g, g).bimap(f, f).fork(noop, resComp)

  t.same(rejComp.args[0], rejComp.args[1], 'rejected composition')
  t.same(resComp.args[0], resComp.args[1], 'resovled composition')

  t.end()
})

test('Async ap errors', t => {
  const m = { type: () => 'Async...Not' }

  const lift = v =>
    Async.of(v).ap(Async.of(0)).fork.bind(null, noop, noop)

  t.throws(lift(undefined), TypeError, 'throws when wrapped value is undefined')
  t.throws(lift(null), TypeError, 'throws when wrapped value is null')
  t.throws(lift(0), TypeError, 'throws when wrapped value is a falsey number')
  t.throws(lift(1), TypeError, 'throws when wrapped value is a truthy number')
  t.throws(lift(''), TypeError, 'throws when wrapped value is a falsey string')
  t.throws(lift('string'), TypeError, 'throws when wrapped value is a truthy string')
  t.throws(lift(false), TypeError, 'throws when wrapped value is false')
  t.throws(lift(true), TypeError, 'throws when wrapped value is true')
  t.throws(lift([]), TypeError, 'throws when wrapped value is an array')
  t.throws(lift({}), TypeError, 'throws when wrapped value is an object')

  t.throws(Async.of(noop).ap.bind(null, undefined), TypeError, 'throws when passed undefined')
  t.throws(Async.of(noop).ap.bind(null, null), TypeError, 'throws when passed null')
  t.throws(Async.of(noop).ap.bind(null, 0), TypeError, 'throws when passed a falsey number')
  t.throws(Async.of(noop).ap.bind(null, 1), TypeError, 'throws when passed a truthy number')
  t.throws(Async.of(noop).ap.bind(null, ''), TypeError, 'throws when passed a falsey string')
  t.throws(Async.of(noop).ap.bind(null, 'string'), TypeError, 'throws when passed a truthy string')
  t.throws(Async.of(noop).ap.bind(null, false), TypeError, 'throws when passed false')
  t.throws(Async.of(noop).ap.bind(null, true), TypeError, 'throws when passed true')
  t.throws(Async.of(noop).ap.bind(null, []), TypeError, 'throws when passed an array')
  t.throws(Async.of(noop).ap.bind(null, {}), TypeError, 'throws when passed an object')

  t.throws(Async.of(noop).ap.bind(null, m), TypeError, 'throws when container types differ')

  t.end()
})

test('Async ap properties (Apply)', t => {
  const m = Async.of(identity)

  const a = m.map(composeB).ap(m).ap(m).ap(Async.of(3))
  const b = m.ap(m.ap(m)).ap(Async.of(3))

  const aRes = sinon.spy()
  const bRes = sinon.spy()

  t.ok(isFunction(Async(noop).map), 'implements the Functor spec')
  t.ok(isFunction(Async(noop).ap), 'provides an ap function')

  a.fork(noop, aRes)
  b.fork(noop, bRes)

  t.same(aRes.args[0], bRes.args[0], 'compostion')

  t.end()
})

test('Aync of', t => {
  const f = sinon.spy()

  t.equal(Async.of, Async(noop).of, 'Async.of is the same as the instance version')
  t.equal(Async.of(0).type(), 'Async', 'returns an Async')

  Async.of(0).fork(noop, f)

  t.ok(f.calledWith(0), 'wraps the value passed into an Async')

  t.end()
})

test('Async of properties (Applicative)', t => {
  const m = Async.of(identity)

  t.ok(isFunction(Async(noop).of), 'provides an of function')
  t.ok(isFunction(Async(noop).ap), 'implements the Apply spec')

  const idRes = sinon.spy()
  m.ap(Async.of(3)).fork(noop, idRes)

  t.ok(idRes.calledWith(3), 'identity')

  const aHomoRes = sinon.spy()
  const bHomoRes = sinon.spy()

  m.ap(Async.of(3)).fork(noop, aHomoRes)
  Async.of(identity(3)).fork(noop, bHomoRes)

  t.same(aHomoRes.args[0], bHomoRes.args[0], 'homomorphism')

  const aInterRes = sinon.spy()
  const bInterRes = sinon.spy()

  m.ap(Async.of(3)).fork(noop, aInterRes)
  Async.of(reverseApply(3)).ap(m).fork(noop, bInterRes)

  t.same(aInterRes.args[0], bInterRes.args[0], 'interchange')

  t.end()
})

test('Async chain errors', t => {
  const chain = bindFunc(Async(noop).chain)

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

  t.throws(Async.of(3).chain(noop).fork.bind(null, noop, noop), TypeError, 'throws with a non-Async returning function')

  t.doesNotThrow(Async.of(3).chain(Async.of).fork.bind(null, noop, noop), 'allows an Async returning function')

  t.end()
})

test('Async chain properties (Chain)', t => {
  t.ok(isFunction(Async(noop).chain), 'provides a chain function')
  t.ok(isFunction(Async(noop).ap), 'implements the Apply spec')

  const aRes = sinon.spy()
  const bRes = sinon.spy()

  const f = x => Async((_, res) => res(x + 2))
  const g = x => Async((_, res) => res(x + 10))

  const a = x => Async((_, res) => res(x)).chain(f).chain(g).fork(noop, aRes)
  const b = x => Async((_, res) => res(x)).chain(y => f(y).chain(g)).fork(noop, bRes)

  t.same(aRes.args[0], bRes.args[0], 'assosiativity')

  t.end()
})

test('Async chain properties (Monad)', t => {
  t.ok(isFunction(Async(noop).chain), 'implements the Chain spec')
  t.ok(isFunction(Async(noop).of), 'implements the Applicative spec')

  const f = x => Async((_, res) => res(x))

  aLeft = sinon.spy()
  bLeft = sinon.spy()

  Async.of(3).chain(f).fork(noop, aLeft)
  f(3).fork(noop, bLeft)

  t.same(aLeft.args[0], bLeft.args[0], 'left identity')

  aRight = sinon.spy()
  bRight = sinon.spy()

  f(3).chain(Async.of).fork(noop, aRight)
  f(3).fork(noop, bRight)

  t.same(aRight.args[0], bRight.args[0], 'right identity')

  t.end()
})
