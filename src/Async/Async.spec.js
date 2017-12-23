const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const List = require('../core/List')
const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isObject = require('../core/isObject')
const isFunction = require('../core/isFunction')
const unit = require('../core/_unit')

const constant = x => () => x
const identity = x => x

const reverseApply =
  x => fn => fn(x)

const Async = require('.')

test('Async', t => {
  const m = Async(unit)
  const a = bindFunc(Async)

  t.ok(isFunction(Async), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Async.of), 'provides an of function')
  t.ok(isFunction(Async.type), 'provides a type function')

  t.equals(Async.Resolved(3).constructor, Async, 'provides TypeRep on constructor on Resolved')
  t.equals(Async.Rejected(3).constructor, Async, 'provides TypeRep on constructor on Rejected')

  t.ok(isFunction(Async.Resolved), 'provides a Resolved function')
  t.ok(isFunction(Async.Rejected), 'provides a Rejected function')

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

test('Async @@implements', t => {
  const f = Async['@@implements']

  t.equal(f('alt'), true, 'implements alt func')
  t.equal(f('ap'), true, 'implements ap func')
  t.equal(f('bimap'), true, 'implements bimap func')
  t.equal(f('chain'), true, 'implements chain func')
  t.equal(f('map'), true, 'implements map func')
  t.equal(f('of'), true, 'implements of func')

  t.end()
})

test('Async Rejected', t => {
  const x = 'sorry'
  const m = Async.Rejected(x)

  const rej = sinon.spy()
  const res = sinon.spy()

  m.fork(rej, res)

  t.ok(rej.calledWith(x), 'calls the rejected function with rejected value')
  t.notOk(res.called, 'does not call the resolved function')

  t.end()
})

test('Async Resolved', t => {
  const x = 'sorry'
  const m = Async.Resolved(x)

  const rej = sinon.spy()
  const res = sinon.spy()

  m.fork(rej, res)

  t.ok(res.calledWith(x), 'calls the resolved function with resolved value')
  t.notOk(rej.called, 'does not call the rejected function')

  t.end()
})

test('Async fromPromise', t => {
  const resProm = x => new Promise((res) => res(x))

  t.ok(isFunction(Async.fromPromise), 'is a function')
  t.ok(isFunction(Async.fromPromise(resProm)), 'returns a function')

  const fn = bindFunc(Async.fromPromise)
  const fork = bindFunc(x => Async.fromPromise(() => x)().fork(unit, unit))

  t.throws(fn(undefined), TypeError, 'throws with undefined')
  t.throws(fn(null), TypeError, 'throws with null')
  t.throws(fn(0), TypeError, 'throws with falsey number')
  t.throws(fn(1), TypeError, 'throws with truthy number')
  t.throws(fn(''), TypeError, 'throws with falsey string')
  t.throws(fn('string'), TypeError, 'throws with truthy string')
  t.throws(fn(false), TypeError, 'throws with false')
  t.throws(fn(true), TypeError, 'throws with true')
  t.throws(fn([]), TypeError, 'throws with an array')
  t.throws(fn({}), TypeError, 'throws with an object')

  t.throws(fork(undefined), TypeError, 'throws when undefined is returned from promise function')
  t.throws(fork(null), TypeError, 'throws when null is returned from promise function')
  t.throws(fork(0), TypeError, 'throws when falsey number is returned from promise function')
  t.throws(fork(1), TypeError, 'throws when truthy number is returned from promise function')
  t.throws(fork(''), TypeError, 'throws when falsey string is returned from promise function')
  t.throws(fork('string'), TypeError, 'throws when truthy string is returned from promise function')
  t.throws(fork(false), TypeError, 'throws when false is returned from promise function')
  t.throws(fork(true), TypeError, 'throws when true is returned from promise function')
  t.throws(fork([]), TypeError, 'throws when an array is returned from promise function')
  t.throws(fork({}), TypeError, 'throws when an object is returned from promise function')
  t.throws(fork(unit), TypeError, 'throws when an object is returned from promise function')

  t.end()
})

test('Async fromPromise resolution', t => {
  t.plan(2)

  const val = 'super fun'

  const rejProm = x => new Promise((_, rej) => rej(x))
  const resProm = x => new Promise((res) => res(x))

  const rej = y => x => t.equal(x, y, 'rejects a rejected Promise')
  const res = y => x => t.equal(x, y, 'resolves a resolved Promise')


  Async.fromPromise(rejProm)(val).fork(rej(val), res(val))
  Async.fromPromise(resProm)(val).fork(rej(val), res(val))
})

test('Async fromNode', t => {
  const resCPS = (x, cf) => cf(null, x)

  t.ok(isFunction(Async.fromNode), 'is a function')
  t.ok(isFunction(Async.fromNode(resCPS)), 'returns a function')

  const fn = bindFunc(Async.fromNode)

  t.throws(fn(undefined), TypeError, 'throws with undefined')
  t.throws(fn(null), TypeError, 'throws with null')
  t.throws(fn(0), TypeError, 'throws with falsey number')
  t.throws(fn(1), TypeError, 'throws with truthy number')
  t.throws(fn(''), TypeError, 'throws with falsey string')
  t.throws(fn('string'), TypeError, 'throws with truthy string')
  t.throws(fn(false), TypeError, 'throws with false')
  t.throws(fn(true), TypeError, 'throws with true')
  t.throws(fn([]), TypeError, 'throws with an array')
  t.throws(fn({}), TypeError, 'throws with an object')

  t.end()
})

test('Async fromNode resolution', t => {
  t.plan(2)

  const val = 'super fun'

  const rejCPS = (x, cf) => cf(x)
  const resCPS = (x, cf) => cf(null, x)

  const rej = y => x => t.equal(x, y, 'rejects an erred CPS')
  const res = y => x => t.equal(x, y, 'resolves a good CPS')

  Async.fromNode(rejCPS)(val).fork(rej(val), res(val))
  Async.fromNode(resCPS)(val).fork(rej(val), res(val))
})

test('Async all', t => {
  const all = bindFunc(Async.all)

  t.ok(isFunction(Async.all), 'is a function')

  t.throws(all(undefined), TypeError, 'throws with undefined')
  t.throws(all(null), TypeError, 'throws with null')
  t.throws(all(0), TypeError, 'throws with falsey number')
  t.throws(all(1), TypeError, 'throws with truthy number')
  t.throws(all(''), TypeError, 'throws with falsey string')
  t.throws(all('string'), TypeError, 'throws with truthy string')
  t.throws(all(false), TypeError, 'throws with false')
  t.throws(all(true), TypeError, 'throws with true')
  t.throws(all({}), TypeError, 'throws with an object')
  t.throws(all(unit), TypeError, 'throws with a function')

  t.throws(all([ undefined ]), TypeError, 'throws an array of with undefineds')
  t.throws(all([ null ]), TypeError, 'throws an array of with nulls')
  t.throws(all([ 0 ]), TypeError, 'throws with an array of falsey numbers')
  t.throws(all([ 1 ]), TypeError, 'throws with an array of truthy numbers')
  t.throws(all([ '' ]), TypeError, 'throws with an array of falsey strings')
  t.throws(all([ 'string' ]), TypeError, 'throws with an array of truthy strings')
  t.throws(all([ false ]), TypeError, 'throws with an array of falses')
  t.throws(all([ true ]), TypeError, 'throws with an array of trues')
  t.throws(all([ {} ]), TypeError, 'throws with an objects')
  t.throws(all([ [] ]), TypeError, 'throws with an array of arrays')
  t.throws(all([ unit ]), TypeError, 'throws with an array of functions')

  t.end()
})

test('Async all resolution with Array', t => {
  t.plan(3)

  const val = 'super fun'
  const bad = 'issues'

  const rej = y => x => t.same(x, y, 'rejects when one rejects')
  const res = y => x => t.same(x, y, 'resolves with array of values when all resolve')
  const empty = y => x => t.same(x, y, 'resolves with an empty array when passed an empty array')

  Async.all([ Async.Resolved(val), Async.Resolved(val) ]).fork(rej(bad), res([ val, val ]))
  Async.all([ Async.Rejected(bad), Async.Resolved(val) ]).fork(rej(bad), res([ val, val ]))
  Async.all([]).fork(rej(bad), empty([]))
})

test('Async all resolution with List', t => {
  t.plan(3)

  const val = 'super fun'
  const bad = 'issues'

  const rej = y => x => t.same(x, y, 'rejects when one rejects')
  const res = y => x => t.same(x.toArray(), y, 'resolves with List of values when all resolve')
  const empty = y => x => t.same(x.toArray(), y, 'resolves with an empty List when passed an empty List')

  Async.all(List([ Async.Resolved(val), Async.Resolved(val) ])).fork(rej(bad), res([ val, val ]))
  Async.all(List([ Async.Rejected(bad), Async.Resolved(val) ])).fork(rej(bad), res([ val, val ]))
  Async.all(List([])).fork(rej(bad), empty([]))
})

test('Async inspect', t => {
  const a = Async(unit)

  t.ok(isFunction(a.inspect), 'provides an inspect function')
  t.equals(a.inspect(), 'Async Function', 'returns the expected result')

  t.end()
})

test('Async type', t => {
  t.equal(Async(unit).type(), 'Async', 'returns Async')

  t.end()
})

test('Async fork', t => {
  const resolved = Async((_, res) => res('resolved'))
  const rejected = Async((rej) => rej('rejected'))

  const res = sinon.spy(identity)
  const rej = sinon.spy(identity)
  const noCall = sinon.spy(unit)

  const fork = bindFunc(resolved.fork)

  t.throws(fork(undefined, unit), 'throws with undefined in first argument')
  t.throws(fork(null, unit), 'throws with null in first argument')
  t.throws(fork(0, unit), 'throws with falsey number in first argument')
  t.throws(fork(1, unit), 'throws with truthy number in first argument')
  t.throws(fork('', unit), 'throws with falsey string in first argument')
  t.throws(fork('string', unit), 'throws with truthy string in first argument')
  t.throws(fork(false, unit), 'throws with false in first argument')
  t.throws(fork(true, unit), 'throws with true in first argument')
  t.throws(fork({}, unit), 'throws with an object in first argument')
  t.throws(fork([], unit), 'throws with an array in first argument')

  t.throws(fork(unit, undefined), 'throws with undefined in first argument')
  t.throws(fork(unit, null), 'throws with null in first argument')
  t.throws(fork(unit, 0), 'throws with falsey number in first argument')
  t.throws(fork(unit, 1), 'throws with truthy number in first argument')
  t.throws(fork(unit, ''), 'throws with falsey string in first argument')
  t.throws(fork(unit, 'string'), 'throws with truthy string in first argument')
  t.throws(fork(unit, false), 'throws with false in first argument')
  t.throws(fork(unit, true), 'throws with true in first argument')
  t.throws(fork(unit, {}), 'throws with an object in first argument')
  t.throws(fork(unit, []), 'throws with an array in first argument')

  resolved.fork(noCall, res)
  rejected.fork(rej, noCall)

  t.ok(isFunction(Async.of(34).fork(unit, unit)), 'fork returns a function')
  t.ok(res.calledWith('resolved'), 'calls resolved function when Async is resolved')
  t.ok(rej.calledWith('rejected'), 'calls rejected function when Async is rejected')
  t.notOk(noCall.called, 'does not call the other function')

  t.end()
})

test('Async cancel chain cleanup functions', t => {
  const resCleanUp = sinon.spy()
  const rejCleanUp = sinon.spy()
  const forkCleanUp = sinon.spy()

  const cancel =
    Async.of(0)
      .chain(x => Async((_, res) => { res(x) }, resCleanUp))
      .chain(x => Async(rej => { rej(x) }, rejCleanUp))
      .fork(unit, unit, forkCleanUp)

  cancel()

  t.ok(rejCleanUp.calledAfter(resCleanUp), 'calls the first Async cleanup first')
  t.ok(forkCleanUp.calledAfter(rejCleanUp), 'calls the fork cleanup last')

  cancel()

  t.ok(resCleanUp.calledOnce, 'calls the Async level cleanup only once')
  t.ok(rejCleanUp.calledOnce, 'calls the Async level cleanup only once')
  t.ok(forkCleanUp.calledOnce, 'calls the fork level cleanup only once')

  t.end()
})

test('Async cancel ap cleanup functions', t => {
  const resCleanUp = sinon.spy()
  const rejCleanUp = sinon.spy()
  const forkCleanUp = sinon.spy()

  const cancel =
    Async.of(x => y => [ x, y ])
      .ap(Async((_, res) => { res(1) }, resCleanUp))
      .ap(Async((_, rej) => { rej(1) }, rejCleanUp))
      .fork(unit, unit, forkCleanUp)

  cancel()

  t.ok(rejCleanUp.calledAfter(resCleanUp), 'calls the first Async cleanup first')
  t.ok(forkCleanUp.calledAfter(resCleanUp), 'calls the fork cleanup last')

  cancel()

  t.ok(resCleanUp.calledOnce, 'calls the resolved Async level cleanup only once')
  t.ok(rejCleanUp.calledOnce, 'calls the rejected Async level cleanup only once')
  t.ok(forkCleanUp.calledOnce, 'calls the fork level cleanup only once')

  t.end()
})

test('Async cancel alt cleanup functions', t => {
  const rejCleanUp = sinon.spy()
  const resCleanUp = sinon.spy()
  const forkCleanUp = sinon.spy()

  const cancel =
    Async.Rejected(0)
      .alt(Async(rej => { rej(1) }, rejCleanUp))
      .alt(Async((_, res) => { res(1) }, resCleanUp))
      .fork(unit, unit, forkCleanUp)

  cancel()

  t.ok(resCleanUp.calledAfter(rejCleanUp), 'calls the first Async cleanup first')
  t.ok(forkCleanUp.calledAfter(resCleanUp), 'calls the fork cleanup last')

  cancel()

  t.ok(rejCleanUp.calledOnce, 'calls the rejected Async level cleanup only once')
  t.ok(resCleanUp.calledOnce, 'calls the resolved Async level cleanup only once')
  t.ok(forkCleanUp.calledOnce, 'calls the fork level cleanup only once')

  t.end()
})

test('Async cancel cancellation', t => {
  t.plan(5)

  function cancelTest(rejected, func) {
    return function() {
      return Async((rej, res) => setTimeout(() => rejected ? rej(0) : res(0)))[func].apply(null, arguments).fork(
        t.fail.bind(t, `reject called after a ${func}`),
        t.fail.bind(t, `resolve called after a ${func}`)
      )
    }
  }

  const swap = sinon.spy()
  const coalesce = sinon.spy()
  const map = sinon.spy()
  const bimap = sinon.spy()
  const chain = sinon.spy(x => Async.of(x))

  cancelTest(true, 'swap')(swap, swap)()
  cancelTest(false, 'swap')(swap, swap)()
  cancelTest(true, 'coalesce')(coalesce, coalesce)()
  cancelTest(false, 'coalesce')(coalesce, coalesce)()
  cancelTest(true, 'map')(map)()
  cancelTest(false, 'map')(map)()
  cancelTest(true, 'bimap')(bimap, bimap)()
  cancelTest(false, 'bimap')(bimap, bimap)()
  cancelTest(true, 'chain')(chain)()
  cancelTest(false, 'chain')(chain)()

  setTimeout(() => {
    t.notOk(swap.called, 'does not run swap')
    t.notOk(coalesce.called, 'does not run coalesce')
    t.notOk(map.called, 'does not run map')
    t.notOk(bimap.called, 'does not run bimap')
    t.notOk(chain.called, 'does not run chain')
  })
})

test('Async toPromise', t => {
  t.plan(2)

  const val = 1337

  const rej = y => x => t.equal(x, y, 'rejects a rejected Async')
  const res = y => x => t.equal(x, y, 'resolves a resolved Async')

  Async.Rejected(val).toPromise().then(res(val)).catch(rej(val))
  Async.Resolved(val).toPromise().then(res(val)).catch(rej(val))
})

test('Async swap', t => {
  const fn = bindFunc(Async(unit).swap)

  t.throws(fn(null, unit), TypeError, 'throws with null in left')
  t.throws(fn(undefined, unit), TypeError, 'throws with undefined in left')
  t.throws(fn(0, unit), TypeError, 'throws with falsey number in left')
  t.throws(fn(1, unit), TypeError, 'throws with truthy number in left')
  t.throws(fn('', unit), TypeError, 'throws with falsey string in left')
  t.throws(fn('string', unit), TypeError, 'throws with truthy string in left')
  t.throws(fn(false, unit), TypeError, 'throws with false in left')
  t.throws(fn(true, unit), TypeError, 'throws with true in left')
  t.throws(fn({}, unit), TypeError, 'throws with object in left')
  t.throws(fn([], unit), TypeError, 'throws with array in left')

  t.throws(fn(unit, null), TypeError, 'throws with null in right')
  t.throws(fn(unit, undefined), TypeError, 'throws with undefined in right')
  t.throws(fn(unit, 0), TypeError, 'throws with falsey number in right')
  t.throws(fn(unit, 1), TypeError, 'throws with truthy number in right')
  t.throws(fn(unit, ''), TypeError, 'throws with falsey string in right')
  t.throws(fn(unit, 'string'), TypeError, 'throws with truthy string in right')
  t.throws(fn(unit, false), TypeError, 'throws with false in right')
  t.throws(fn(unit, true), TypeError, 'throws with true in right')
  t.throws(fn(unit, {}), TypeError, 'throws with object in right')
  t.throws(fn(unit, []), TypeError, 'throws with array in right')

  const rejected = Async((rej) => rej('silly')).swap(constant('was rejected'), identity)
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
  const fn = bindFunc(Async(unit).coalesce)

  t.throws(fn(null, unit), TypeError, 'throws with null in left')
  t.throws(fn(undefined, unit), TypeError, 'throws with undefined in left')
  t.throws(fn(0, unit), TypeError, 'throws with falsey number in left')
  t.throws(fn(1, unit), TypeError, 'throws with truthy number in left')
  t.throws(fn('', unit), TypeError, 'throws with falsey string in left')
  t.throws(fn('string', unit), TypeError, 'throws with truthy string in left')
  t.throws(fn(false, unit), TypeError, 'throws with false in left')
  t.throws(fn(true, unit), TypeError, 'throws with true in left')
  t.throws(fn({}, unit), TypeError, 'throws with object in left')
  t.throws(fn([], unit), TypeError, 'throws with array in left')

  t.throws(fn(unit, null), TypeError, 'throws with null in right')
  t.throws(fn(unit, undefined), TypeError, 'throws with undefined in right')
  t.throws(fn(unit, 0), TypeError, 'throws with falsey number in right')
  t.throws(fn(unit, 1), TypeError, 'throws with truthy number in right')
  t.throws(fn(unit, ''), TypeError, 'throws with falsey string in right')
  t.throws(fn(unit, 'string'), TypeError, 'throws with truthy string in right')
  t.throws(fn(unit, false), TypeError, 'throws with false in right')
  t.throws(fn(unit, true), TypeError, 'throws with true in right')
  t.throws(fn(unit, {}), TypeError, 'throws with object in right')
  t.throws(fn(unit, []), TypeError, 'throws with array in right')

  const rejected = Async((rej) => rej()).coalesce(constant('was rejected'), identity)
  const resolved = Async((_, res) => res()).coalesce(identity, constant('was resolved'))

  const rej = sinon.spy()
  const res = sinon.spy()

  rejected.fork(unit, rej)
  resolved.fork(unit, res)

  t.ok(rej.calledWith('was rejected'), 'resolves a rejected, applying left coalesce function')
  t.ok(res.calledWith('was resolved'), 'resolves a resolved, applying right coalesce function')


  t.end()
})

test('Async map errors', t => {
  const map = bindFunc(Async(unit).map)

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

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Async map functionality', t => {
  const mapFn = sinon.spy()

  Async((rej) => rej('rejected')).map(mapFn).fork(unit, unit)
  Async((_, res) => res('resolved')).map(mapFn).fork(unit, unit)

  t.equal(Async(unit).map(unit).type(), 'Async', 'returns an Async')
  t.ok(mapFn.calledWith('resolved'), 'calls map function on resolved')
  t.notOk(mapFn.calledWith('rejected'), 'does not calls map function on rejected')

  t.end()
})

test('Async map properties (Functor)', t => {
  const f = x => x + 2
  const g = x => x * 2

  t.ok(isFunction(Async(unit).map), 'provides a map function')

  const x = 30
  const id = sinon.spy()

  Async((_, res) => res(x)).map(identity).fork(unit, id)

  const y = 10
  const left = sinon.spy()
  const right = sinon.spy()

  Async((_, res) => res(y)).map(compose(f, g)).fork(unit, left)
  Async((_, res) => res(y)).map(g).map(f).fork(unit, right)

  t.ok(id.calledWith(x), 'identity')
  t.same(left.args[0], right.args[0], 'composition')

  t.end()
})

test('Async bimap errors', t => {
  const bimap = bindFunc(Async(unit).bimap)

  t.throws(bimap(undefined, unit), TypeError, 'throws with undefined in first argument')
  t.throws(bimap(null, unit), TypeError, 'throws with null in first argument')
  t.throws(bimap(0, unit), TypeError, 'throws with falsey number in first argument')
  t.throws(bimap(1, unit), TypeError, 'throws with truthy number in first argument')
  t.throws(bimap('', unit), TypeError, 'throws with falsey string in first argument')
  t.throws(bimap('string', unit), TypeError, 'throws with truthy string in first argument')
  t.throws(bimap(false, unit), TypeError, 'throws with false in first argument')
  t.throws(bimap(true, unit), TypeError, 'throws with true in first argument')
  t.throws(bimap([], unit), TypeError, 'throws with an array in first argument')
  t.throws(bimap({}, unit), TypeError, 'throws with object in first argument')

  t.throws(bimap(unit, undefined), TypeError, 'throws with undefined in second argument')
  t.throws(bimap(unit, null), TypeError, 'throws with null in second argument')
  t.throws(bimap(unit, 0), TypeError, 'throws with falsey number in second argument')
  t.throws(bimap(unit, 1), TypeError, 'throws with truthy number in second argument')
  t.throws(bimap(unit, ''), TypeError, 'throws with falsey string in second argument')
  t.throws(bimap(unit, 'string'), TypeError, 'throws with truthy string in second argument')
  t.throws(bimap(unit, false), TypeError, 'throws with false in second argument')
  t.throws(bimap(unit, true), TypeError, 'throws with true in second argument')
  t.throws(bimap(unit, []), TypeError, 'throws with an array in second argument')
  t.throws(bimap(unit, {}), TypeError, 'throws with object in second argument')

  t.doesNotThrow(bimap(unit, unit), 'allows functions')

  t.end()
})

test('Async bimap functionality', t => {
  const left = sinon.spy(constant('left'))
  const right = sinon.spy(constant('right'))

  const rej = sinon.spy()
  const res = sinon.spy()

  Async((rej) => rej('rejected')).bimap(left, right).fork(rej, res)
  Async((_, res) => res('resolved')).bimap(left, right).fork(rej, res)

  t.equal(Async(unit).bimap(unit, unit).type(), 'Async', 'returns an Async')

  t.ok(rej.calledWith('left'), 'reject called with result of left function')
  t.ok(res.calledWith('right'), 'resolve called with result of right function')

  t.ok(left.calledWith('rejected'), 'left function called with rejected value')
  t.ok(right.calledWith('resolved'), 'right function called with resolved value')

  t.end()
})

test('Async bimap properties (Bifunctor)', t => {
  const bimap = (f, g) => m => m.bimap(f, g)

  const rej = Async.Rejected(20)
  const res = Async.Resolved(10)

  const rejId = sinon.spy()
  const resId = sinon.spy()

  const bimapId = bimap(identity, identity)

  rej.fork(rejId, unit)
  bimapId(rej).fork(rejId, unit)

  res.fork(unit, resId)
  bimapId(res).fork(unit, resId)

  t.same(rejId.args[0], rejId.args[1], 'rejected identity')
  t.same(resId.args[0], resId.args[1], 'resolved identity')

  const f = x => x + 2
  const g = x => x * 2
  const comp = compose(f, g)

  const rejComp = sinon.spy()
  const resComp = sinon.spy()

  const bimapComp = bimap(comp, comp)

  bimapComp(rej).fork(rejComp, unit)
  rej.bimap(g, g).bimap(f, f).fork(rejComp, unit)

  bimapComp(res).fork(unit, resComp)
  res.bimap(g, g).bimap(f, f).fork(unit, resComp)

  t.same(rejComp.args[0], rejComp.args[1], 'rejected composition')
  t.same(resComp.args[0], resComp.args[1], 'resovled composition')

  t.end()
})

test('Async alt errors', t => {
  const m = { type: () => 'Async...Not' }

  const altResolved = bindFunc(Async.of(0).alt)

  t.throws(altResolved(undefined), TypeError, 'throws when passed an undefined with Resolved')
  t.throws(altResolved(null), TypeError, 'throws when passed a null with Resolved')
  t.throws(altResolved(0), TypeError, 'throws when passed a falsey number with Resolved')
  t.throws(altResolved(1), TypeError, 'throws when passed a truthy number with Resolved')
  t.throws(altResolved(''), TypeError, 'throws when passed a falsey string with Resolved')
  t.throws(altResolved('string'), TypeError, 'throws when passed a truthy string with Resolved')
  t.throws(altResolved(false), TypeError, 'throws when passed false with Resolved')
  t.throws(altResolved(true), TypeError, 'throws when passed true with Resolved')
  t.throws(altResolved([]), TypeError, 'throws when passed an array with Resolved')
  t.throws(altResolved({}), TypeError, 'throws when passed an object with Resolved')
  t.throws(altResolved(m), TypeError, 'throws when container types differ on Resolved')

  const altRejected = bindFunc(Async.Rejected(0).alt)

  t.throws(altRejected(undefined), TypeError, 'throws when passed an undefined with Rejected')
  t.throws(altRejected(null), TypeError, 'throws when passed a null with Rejected')
  t.throws(altRejected(0), TypeError, 'throws when passed a falsey number with Rejected')
  t.throws(altRejected(1), TypeError, 'throws when passed a truthy number with Rejected')
  t.throws(altRejected(''), TypeError, 'throws when passed a falsey string with Rejected')
  t.throws(altRejected('string'), TypeError, 'throws when passed a truthy string with Rejected')
  t.throws(altRejected(false), TypeError, 'throws when passed false with Rejected')
  t.throws(altRejected(true), TypeError, 'throws when passed true with Rejected')
  t.throws(altRejected([]), TypeError, 'throws when passed an array with Rejected')
  t.throws(altRejected({}), TypeError, 'throws when passed an object with Rejected')
  t.throws(altRejected(m), TypeError, 'throws when container types differ on Rejected')

  t.end()
})

test('Async alt functionality', t => {
  const resolved = Async.of('Resolved')
  const anotherResolved = Async.of('Another Resolved')

  const rejected = Async.Rejected('Rejected')
  const anotherRejected = Async.Rejected('Another Rejected')

  const res = sinon.spy()
  const rej = sinon.spy()

  rejected.alt(anotherRejected).fork(rej, unit)
  resolved.alt(rejected).alt(anotherResolved).fork(unit, res)

  t.ok(res.calledWith('Resolved'), 'retains first Resolved')
  t.ok(rej.calledWith('Another Rejected'), 'provdes last Rejected when all Rejects')

  t.end()
})

test('Async alt properties (Alt)', t => {
  const a = Async.of('a')
  const b = Async.Rejected('Rejected')
  const c = Async.of('c')

  const assocLeft = sinon.spy()
  const assocRight = sinon.spy()

  a.alt(b).alt(c).fork(unit, assocLeft)
  a.alt(b.alt(c)).fork(unit, assocRight)

  t.same(assocLeft.args[0], assocRight.args[0], 'assosiativity')

  const distLeft = sinon.spy()
  const distRight = sinon.spy()

  a.alt(b).map(identity).fork(unit, distLeft)
  a.map(identity).alt(b.map(identity)).fork(unit, distRight)

  t.same(distLeft.args[0], distRight.args[0], 'distributivity')

  t.end()
})

test('Async ap errors', t => {
  const m = { type: () => 'Async...Not' }

  const lift = v =>
    Async.of(v).ap(Async.of(0)).fork.bind(null, unit, unit)

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

  t.throws(Async.of(unit).ap.bind(null, undefined), TypeError, 'throws when passed undefined')
  t.throws(Async.of(unit).ap.bind(null, null), TypeError, 'throws when passed null')
  t.throws(Async.of(unit).ap.bind(null, 0), TypeError, 'throws when passed a falsey number')
  t.throws(Async.of(unit).ap.bind(null, 1), TypeError, 'throws when passed a truthy number')
  t.throws(Async.of(unit).ap.bind(null, ''), TypeError, 'throws when passed a falsey string')
  t.throws(Async.of(unit).ap.bind(null, 'string'), TypeError, 'throws when passed a truthy string')
  t.throws(Async.of(unit).ap.bind(null, false), TypeError, 'throws when passed false')
  t.throws(Async.of(unit).ap.bind(null, true), TypeError, 'throws when passed true')
  t.throws(Async.of(unit).ap.bind(null, []), TypeError, 'throws when passed an array')
  t.throws(Async.of(unit).ap.bind(null, {}), TypeError, 'throws when passed an object')

  t.throws(Async.of(unit).ap.bind(null, m), TypeError, 'throws when container types differ')

  t.end()
})

test('Async ap properties (Apply)', t => {
  const m = Async.of(identity)

  const a = m.map(compose).ap(m).ap(m).ap(Async.of(3))
  const b = m.ap(m.ap(m)).ap(Async.of(3))

  const aRes = sinon.spy()
  const bRes = sinon.spy()

  t.ok(isFunction(Async(unit).map), 'implements the Functor spec')
  t.ok(isFunction(Async(unit).ap), 'provides an ap function')

  a.fork(unit, aRes)
  b.fork(unit, bRes)

  t.same(aRes.args[0], bRes.args[0], 'compostion')

  t.end()
})

test('Async of', t => {
  const f = sinon.spy()

  t.equal(Async.of, Async(unit).of, 'Async.of is the same as the instance version')
  t.equal(Async.of(0).type(), 'Async', 'returns an Async')

  Async.of(0).fork(unit, f)

  t.ok(f.calledWith(0), 'wraps the value passed into an Async')

  t.end()
})

test('Async of properties (Applicative)', t => {
  const m = Async.of(identity)

  t.ok(isFunction(Async(unit).of), 'provides an of function')
  t.ok(isFunction(Async(unit).ap), 'implements the Apply spec')

  const idRes = sinon.spy()
  m.ap(Async.of(3)).fork(unit, idRes)

  t.ok(idRes.calledWith(3), 'identity')

  const aHomoRes = sinon.spy()
  const bHomoRes = sinon.spy()

  m.ap(Async.of(3)).fork(unit, aHomoRes)
  Async.of(identity(3)).fork(unit, bHomoRes)

  t.same(aHomoRes.args[0], bHomoRes.args[0], 'homomorphism')

  const aInterRes = sinon.spy()
  const bInterRes = sinon.spy()

  m.ap(Async.of(3)).fork(unit, aInterRes)
  Async.of(reverseApply(3)).ap(m).fork(unit, bInterRes)

  t.same(aInterRes.args[0], bInterRes.args[0], 'interchange')

  t.end()
})

test('Async chain errors', t => {
  const chain = bindFunc(Async(unit).chain)

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

  t.throws(Async.of(3).chain(unit).fork.bind(null, unit, unit), TypeError, 'throws with a non-Async returning function')

  t.doesNotThrow(Async.of(3).chain(Async.of).fork.bind(null, unit, unit), 'allows an Async returning function')

  t.end()
})

test('Async chain properties (Chain)', t => {
  t.ok(isFunction(Async(unit).chain), 'provides a chain function')
  t.ok(isFunction(Async(unit).ap), 'implements the Apply spec')

  const aRes = sinon.spy()
  const bRes = sinon.spy()

  const f = x => Async((_, res) => res(x + 2))
  const g = x => Async((_, res) => res(x + 10))

  const x = 12

  Async((_, res) => res(x)).chain(f).chain(g).fork(unit, aRes)
  Async((_, res) => res(x)).chain(y => f(y).chain(g)).fork(unit, bRes)

  t.same(aRes.args[0], bRes.args[0], 'assosiativity')

  t.end()
})

test('Async chain properties (Monad)', t => {
  t.ok(isFunction(Async(unit).chain), 'implements the Chain spec')
  t.ok(isFunction(Async(unit).of), 'implements the Applicative spec')

  const f = x => Async((_, res) => res(x))

  const aLeft = sinon.spy()
  const bLeft = sinon.spy()

  Async.of(3).chain(f).fork(unit, aLeft)
  f(3).fork(unit, bLeft)

  t.same(aLeft.args[0], bLeft.args[0], 'left identity')

  const aRight = sinon.spy()
  const bRight = sinon.spy()

  f(3).chain(Async.of).fork(unit, aRight)
  f(3).fork(unit, bRight)

  t.same(aRight.args[0], bRight.args[0], 'right identity')

  t.end()
})
