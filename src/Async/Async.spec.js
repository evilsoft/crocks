const test = require('tape')
const sinon = require('sinon')
const helpers = require('../test/helpers')

const bindFunc = helpers.bindFunc

const List = require('../core/List')
const curry = require('../core/curry')
const compose = curry(require('../core/compose'))
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isString = require('../core/isString')
const unit = require('../core/_unit')

const fl = require('../core/flNames')

const constant = x => () => x
const identity = x => x

const applyTo =
  x => fn => fn(x)

const Async = require('.')

test('Async', t => {
  const m = Async(unit)
  const a = bindFunc(Async)

  t.ok(isFunction(Async), 'is a function')
  t.ok(isObject(m), 'returns an object')

  t.ok(isFunction(Async.of), 'provides an of function')
  t.ok(isFunction(Async.type), 'provides a type function')
  t.ok(isString(Async['@@type']), 'provides a @@type string')

  t.equals(Async.Resolved(3).constructor, Async, 'provides TypeRep on constructor on Resolved')
  t.equals(Async.Rejected(3).constructor, Async, 'provides TypeRep on constructor on Rejected')

  t.ok(isFunction(Async.Resolved), 'provides a Resolved function')
  t.ok(isFunction(Async.Rejected), 'provides a Rejected function')

  const err = /Async: Argument must be a Function/
  t.throws(Async, err, 'throws with no parameters')
  t.throws(a(undefined), err, 'throws with undefined')
  t.throws(a(null), err, 'throws with null')
  t.throws(a(0), err, 'throws with falsey number')
  t.throws(a(1), err, 'throws with truthy number')
  t.throws(a(''), err, 'throws with falsey string')
  t.throws(a('string'), err, 'throws with truthy string')
  t.throws(a(false), err, 'throws with false')
  t.throws(a(true), err, 'throws with true')
  t.throws(a([]), err, 'throws with an array')
  t.throws(a({}), err, 'throws with an object')

  t.end()
})

test('Async fantasy-land api', t => {
  const rej = Async.Rejected('')
  const res = Async.Resolved('')

  t.ok(isFunction(Async[fl.of]), 'provides of function on constructor')

  t.ok(isFunction(res[fl.of]), 'provides of method on resolved instance')
  t.ok(isFunction(res[fl.alt]), 'provides alt method on resolved instance')
  t.ok(isFunction(res[fl.bimap]), 'provides bimap method on resolved instance')
  t.ok(isFunction(res[fl.map]), 'provides map method on resolved instance')
  t.ok(isFunction(res[fl.chain]), 'provides chain method on resolved instance')

  t.ok(isFunction(rej[fl.of]), 'provides of method on rejected instance')
  t.ok(isFunction(rej[fl.alt]), 'provides empty method on rejected instance')
  t.ok(isFunction(rej[fl.bimap]), 'provides bimap method on rejected instance')
  t.ok(isFunction(rej[fl.map]), 'provides map method on rejected instance')
  t.ok(isFunction(rej[fl.chain]), 'provides chain method on rejected instance')

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
  const resProm = x => new Promise(res => res(x))

  t.ok(isFunction(Async.fromPromise), 'is a function')
  t.ok(isFunction(Async.fromPromise(resProm)), 'returns a function')

  const fn = bindFunc(Async.fromPromise)
  const fork = bindFunc(x => Async.fromPromise(() => x)().fork(unit, unit))

  const err = /Async\.fromPromise: Argument must be a Function that returns a Promise/
  t.throws(fn(undefined), err, 'throws with undefined')
  t.throws(fn(null), err, 'throws with null')
  t.throws(fn(0), err, 'throws with falsey number')
  t.throws(fn(1), err, 'throws with truthy number')
  t.throws(fn(''), err, 'throws with falsey string')
  t.throws(fn('string'), err, 'throws with truthy string')
  t.throws(fn(false), err, 'throws with false')
  t.throws(fn(true), err, 'throws with true')
  t.throws(fn([]), err, 'throws with an array')
  t.throws(fn({}), err, 'throws with an object')

  t.throws(fork(undefined), err, 'throws when undefined is returned from promise function')
  t.throws(fork(null), err, 'throws when null is returned from promise function')
  t.throws(fork(0), err, 'throws when falsey number is returned from promise function')
  t.throws(fork(1), err, 'throws when truthy number is returned from promise function')
  t.throws(fork(''), err, 'throws when falsey string is returned from promise function')
  t.throws(fork('string'), err, 'throws when truthy string is returned from promise function')
  t.throws(fork(false), err, 'throws when false is returned from promise function')
  t.throws(fork(true), err, 'throws when true is returned from promise function')
  t.throws(fork([]), err, 'throws when an array is returned from promise function')
  t.throws(fork({}), err, 'throws when an object is returned from promise function')

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

test('Async fromPromise resolution with partially applied function', t => {
  t.plan(2)

  const val1 = 1
  const val2 = 2

  const val = val1 + val2

  const rejProm = x => y => new Promise((_, rej) => rej(x + y))
  const resProm = x => y => new Promise((res) => res(x + y))

  const rej = y => x => t.equal(x, y, 'rejects a rejected Promise')
  const res = y => x => t.equal(x, y, 'resolves a resolved Promise')

  Async.fromPromise(rejProm)(val1)(val2).fork(rej(val), res(val))
  Async.fromPromise(resProm)(val1)(val2).fork(rej(val), res(val))
})

test('Async fromNode', t => {
  const resCPS = (x, cf) => cf(null, x)

  t.ok(isFunction(Async.fromNode), 'is a function')
  t.ok(isFunction(Async.fromNode(resCPS)), 'returns a function')

  const fn = bindFunc(Async.fromNode)

  const err = /Async\.fromNode: Argument must be a continuation-passing-style Function/
  t.throws(fn(undefined), err, 'throws with undefined')
  t.throws(fn(null), err, 'throws with null')
  t.throws(fn(0), err, 'throws with falsey number')
  t.throws(fn(1), err, 'throws with truthy number')
  t.throws(fn(''), err, 'throws with falsey string')
  t.throws(fn('string'), err, 'throws with truthy string')
  t.throws(fn(false), err, 'throws with false')
  t.throws(fn(true), err, 'throws with true')
  t.throws(fn([]), err, 'throws with an array')
  t.throws(fn({}), err, 'throws with an object')

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

  const err = /Async\.all: Argument must be a Foldable structure of Asyncs/
  t.throws(all(undefined), err, 'throws with undefined')
  t.throws(all(null), err, 'throws with null')
  t.throws(all(0), err, 'throws with falsey number')
  t.throws(all(1), err, 'throws with truthy number')
  t.throws(all(''), err, 'throws with falsey string')
  t.throws(all('string'), err, 'throws with truthy string')
  t.throws(all(false), err, 'throws with false')
  t.throws(all(true), err, 'throws with true')
  t.throws(all({}), err, 'throws with an object')
  t.throws(all(unit), err, 'throws with a function')

  t.throws(all([ undefined ]), err, 'throws an array of with undefineds')
  t.throws(all([ null ]), err, 'throws an array of with nulls')
  t.throws(all([ 0 ]), err, 'throws with an array of falsey numbers')
  t.throws(all([ 1 ]), err, 'throws with an array of truthy numbers')
  t.throws(all([ '' ]), err, 'throws with an array of falsey strings')
  t.throws(all([ 'string' ]), err, 'throws with an array of truthy strings')
  t.throws(all([ false ]), err, 'throws with an array of falses')
  t.throws(all([ true ]), err, 'throws with an array of trues')
  t.throws(all([ {} ]), err, 'throws with an objects')
  t.throws(all([ [] ]), err, 'throws with an array of arrays')
  t.throws(all([ unit ]), err, 'throws with an array of functions')

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

test('Async rejectAfter errors', t => {
  const rejectAfter = bindFunc(Async.rejectAfter)

  const err = /Async\.rejectAfter: First argument must be a positive Integer/
  t.throws(rejectAfter(undefined), err, 'throws with undefined')
  t.throws(rejectAfter(null), err, 'throws with null')
  t.throws(rejectAfter(-1), err, 'throws with neg integer')
  t.throws(rejectAfter(3.14), err, 'throws with float number')
  t.throws(rejectAfter(''), err, 'throws with falsey string')
  t.throws(rejectAfter('string'), err, 'throws with truthy string')
  t.throws(rejectAfter(false), err, 'throws with false')
  t.throws(rejectAfter(true), err, 'throws with true')
  t.throws(rejectAfter({}), err, 'throws with an object')
  t.throws(rejectAfter(unit), err, 'throws with a function')

  t.end()
})

test('Async rejectAfter', t => {
  t.plan(2)

  const value = 'value'

  t.ok(isFunction(Async.rejectAfter), 'provides a rejectAfter function on TypeRep')

  Async.rejectAfter(0, value)
    .fork(x => {
      t.equals(x, value, 'rejects with the value')
    }, unit)
})

test('Async rejectAfter cancellation', t => {
  t.plan(2)

  const value = 'value'

  const res = sinon.spy(() => t.fail('resolve called'))
  const rej = sinon.spy(() => t.fail('rejected called'))

  const cancel = Async.rejectAfter(0, value)
    .fork(rej, res)

  cancel()

  setTimeout(() => {
    t.notOk(res.called, 'resolved is never called')
    t.notOk(rej.called, 'rejected is never called')
  }, 200)
})

test('Async resolveAfter errors', t => {
  const resolveAfter = bindFunc(Async.resolveAfter)

  const err = /Async\.resolveAfter: First argument must be a positive Integer/
  t.throws(resolveAfter(undefined), err, 'throws with undefined')
  t.throws(resolveAfter(null), err, 'throws with null')
  t.throws(resolveAfter(-1), err, 'throws with neg integer')
  t.throws(resolveAfter(3.14), err, 'throws with float number')
  t.throws(resolveAfter(''), err, 'throws with falsey string')
  t.throws(resolveAfter('string'), err, 'throws with truthy string')
  t.throws(resolveAfter(false), err, 'throws with false')
  t.throws(resolveAfter(true), err, 'throws with true')
  t.throws(resolveAfter({}), err, 'throws with an object')
  t.throws(resolveAfter(unit), err, 'throws with a function')

  t.end()
})

test('Async resolveAfter', t => {
  t.plan(2)

  const value = 42

  t.ok(isFunction(Async.resolveAfter), 'provides a resolveAfter function on TypeRep')

  Async.resolveAfter(0, value)
    .fork(unit, x => {
      t.equals(x, value, 'resolves with the value')
    })
})

test('Async resolveAfter cancellation', t => {
  t.plan(2)

  const value = 'value'

  const res = sinon.spy()
  const rej = sinon.spy()

  const cancel = Async.resolveAfter(0, value)
    .fork(rej, res)

  cancel()

  setTimeout(() => {
    t.notOk(res.called, 'resolved is never called')
    t.notOk(rej.called, 'rejected is never called')
  }, 200)
})

test('Async inspect', t => {
  const a = Async(unit)

  t.ok(isFunction(a.inspect), 'provides an inspect function')
  t.equal(a.inspect, a.toString, 'toString is the same function as inspect')
  t.equals(a.inspect(), 'Async Function', 'returns the expected result')

  t.end()
})

test('Async type', t => {
  t.ok(isFunction(Async(unit).type), 'is a function')

  t.equal(Async(unit).type, Async.type, 'static and instance versions are the same')
  t.equal(Async(unit).type(), 'Async', 'returns Async')

  t.end()
})

test('Async @@type', t => {
  t.equal(Async(unit)['@@type'], Async['@@type'], 'static and instance versions are the same')
  t.equal(Async(unit)['@@type'], 'crocks/Async@5', 'returns crocks/Async@5')

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

test('Async fork settle', t => {

  const res = sinon.spy(identity)
  const rej = sinon.spy(identity)

  Async(rej => { rej(10); rej(10) }).fork(rej, res)
  t.ok(rej.calledOnce, 'calls reject once when called twice in an Async')

  rej.resetHistory()
  Async((_, res) => { res(10); res(10) }).fork(rej, res)
  t.ok(res.calledOnce, 'calls resolve once when called twice in an Async')

  res.resetHistory()
  Async((rej, res) => { rej(10); res(10) }).fork(rej, res)
  t.ok(rej.calledOnce, 'calls reject when called before a resolve in an Async')
  t.ok(res.notCalled, 'does not call resolve after reject in an Async')

  rej.resetHistory()
  res.resetHistory()
  Async((rej, res) => { res(10); rej(10) }).fork(rej, res)
  t.ok(res.calledOnce, 'calls resolve when called before a reject in an Async')
  t.ok(rej.notCalled, 'does not call reject after resolve in an Async')

  t.end()
})

test('Async cancel bichain cleanup functions - rejected', t => {
  const rejCleanUp = sinon.spy()
  const forkCleanUp = sinon.spy()

  const cancel =
    Async.Rejected(0)
      .bichain(x => Async(rej => { rej(x); return rejCleanUp }), Async.of)
      .fork(unit, unit, forkCleanUp)

  cancel()

  t.ok(forkCleanUp.calledAfter(rejCleanUp), 'calls the fork cleanup last')

  cancel()

  t.ok(rejCleanUp.calledOnce, 'calls the Async level cleanup only once')
  t.ok(forkCleanUp.calledOnce, 'calls the fork level cleanup only once')

  t.end()
})

test('Async cancel chain cleanup functions', t => {
  const resCleanUp = sinon.spy()
  const rejCleanUp = sinon.spy()
  const forkCleanUp = sinon.spy()

  const cancel =
    Async.of(0)
      .chain(x => Async((_, res) => { res(x); return resCleanUp }))
      .chain(x => Async(rej => { rej(x); return rejCleanUp }))
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
      .ap(Async((_, res) => { res(1); return resCleanUp }))
      .ap(Async(rej => { rej(1); return rejCleanUp }))
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
      .alt(Async(rej => { rej(1); return rejCleanUp }))
      .alt(Async((_, res) => { res(1); return resCleanUp }))
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
  }, 100)
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

  const err = /Async\.swap: Both arguments must be Functions/
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

  const err = /Async\.coalesce: Both arguments must be Functions/
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

test('Async race errors', t => {
  const race = bindFunc(Async(unit).race)

  const err = /Async\.race: Argument must be an Async/
  t.throws(race(null), err, 'throws with null')
  t.throws(race(undefined), err, 'throws with undefined')
  t.throws(race(0), err, 'throws with falsey number')
  t.throws(race(1), err, 'throws with truthy number')
  t.throws(race(''), err, 'throws with falsey string')
  t.throws(race('string'), err, 'throws with truthy string')
  t.throws(race(false), err, 'throws with false')
  t.throws(race(true), err, 'throws with true')
  t.throws(race({}), err, 'throws with object')
  t.throws(race([]), err, 'throws with array')

  t.end()
})

test('Async race', t => {
  t.plan(9)

  t.ok(isFunction(Async(unit).race), 'instance provides a race function')

  const value = 'some value'
  const another = 'another value'

  const res = (t, v) => Async((_, r) => setTimeout(() => r(v), t))
  const rej = (t, v) => Async(r => setTimeout(() => r(v), t))

  const failRej = t.fail.bind(t, 'called reject')
  const failRes = t.fail.bind(t, 'called resolve')

  const testRej = v => x => t.equals(v, x, 'rejects with value')
  const testRes = v => x => t.equals(v, x, 'resolves with value')

  res(10, value).race(rej(20, value)).fork(failRej, testRes(value))
  res(20, value).race(rej(10, value)).fork(testRej(value), failRes)

  rej(10, value).race(res(20, value)).fork(testRej(value), failRes)
  rej(20, value).race(res(10, value)).fork(failRej, testRes(value))

  rej(10, value).race(rej(20, another)).fork(testRej(value), failRes)
  rej(20, another).race(rej(10, value)).fork(testRej(value), failRes)

  res(10, value).race(res(20, another)).fork(failRej, testRes(value))
  res(20, another).race(res(10, value)).fork(failRej, testRes(value))
})

test('Async race cancelled', t => {
  t.plan(5)

  const firstCleanup = sinon.spy()
  const secondCleanup = sinon.spy()
  const forkCleanup = sinon.spy()

  const fail = x => () => t.fail(`${x} called`)

  const cancel =
    Async((rej, res) => { setTimeout(res); return firstCleanup })
      .race(Async(rej => { setTimeout(rej); return secondCleanup }))
      .fork(fail('rejected'), fail('resolved'), forkCleanup)

  cancel()

  t.ok(secondCleanup.calledAfter(firstCleanup), 'second cleanup called after first')
  t.ok(forkCleanup.calledAfter(secondCleanup), 'fork cleanup called after second')

  cancel()

  t.ok(firstCleanup.calledOnce, 'calls first cleanup only once')
  t.ok(secondCleanup.calledOnce, 'calls second cleanup only once')
  t.ok(forkCleanup.calledOnce, 'calls fork cleanup only once')
})

test('Async map errors', t => {
  const map = bindFunc(Async(unit).map)

  const err = /Async\.map: Argument must be a Function/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws iwth object')

  t.doesNotThrow(map(unit), 'allows a function')

  t.end()
})

test('Async map fantasy-land errors', t => {
  const map = bindFunc(Async(unit)[fl.map])

  const err = /Async\.fantasy-land\/map: Argument must be a Function/
  t.throws(map(undefined), err, 'throws with undefined')
  t.throws(map(null), err, 'throws with null')
  t.throws(map(0), err, 'throws with falsey number')
  t.throws(map(1), err, 'throws with truthy number')
  t.throws(map(''), err, 'throws with falsey string')
  t.throws(map('string'), err, 'throws with truthy string')
  t.throws(map(false), err, 'throws with false')
  t.throws(map(true), err, 'throws with true')
  t.throws(map([]), err, 'throws with an array')
  t.throws(map({}), err, 'throws iwth object')

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

  const err = /Async\.bimap: Both arguments must be Functions/
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

  t.doesNotThrow(bimap(unit, unit), 'allows functions')

  t.end()
})

test('Async bimap fantasy-land errors', t => {
  const bimap = bindFunc(Async(unit)[fl.bimap])

  const err = /Async\.fantasy-land\/bimap: Both arguments must be Functions/
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

  const err = /Async\.alt: Argument must be an Async/
  t.throws(altResolved(undefined), err, 'throws when passed an undefined with Resolved')
  t.throws(altResolved(null), err, 'throws when passed a null with Resolved')
  t.throws(altResolved(0), err, 'throws when passed a falsey number with Resolved')
  t.throws(altResolved(1), err, 'throws when passed a truthy number with Resolved')
  t.throws(altResolved(''), err, 'throws when passed a falsey string with Resolved')
  t.throws(altResolved('string'), err, 'throws when passed a truthy string with Resolved')
  t.throws(altResolved(false), err, 'throws when passed false with Resolved')
  t.throws(altResolved(true), err, 'throws when passed true with Resolved')
  t.throws(altResolved([]), err, 'throws when passed an array with Resolved')
  t.throws(altResolved({}), err, 'throws when passed an object with Resolved')
  t.throws(altResolved(m), err, 'throws when container types differ on Resolved')

  const altRejected = bindFunc(Async.Rejected(0).alt)

  t.throws(altRejected(undefined), err, 'throws when passed an undefined with Rejected')
  t.throws(altRejected(null), err, 'throws when passed a null with Rejected')
  t.throws(altRejected(0), err, 'throws when passed a falsey number with Rejected')
  t.throws(altRejected(1), err, 'throws when passed a truthy number with Rejected')
  t.throws(altRejected(''), err, 'throws when passed a falsey string with Rejected')
  t.throws(altRejected('string'), err, 'throws when passed a truthy string with Rejected')
  t.throws(altRejected(false), err, 'throws when passed false with Rejected')
  t.throws(altRejected(true), err, 'throws when passed true with Rejected')
  t.throws(altRejected([]), err, 'throws when passed an array with Rejected')
  t.throws(altRejected({}), err, 'throws when passed an object with Rejected')
  t.throws(altRejected(m), err, 'throws when container types differ on Rejected')

  t.end()
})

test('Async alt fantasy-land errors', t => {
  const m = { type: () => 'Async...Not' }

  const altResolved = bindFunc(Async.of(0)[fl.alt])

  const err = /Async\.fantasy-land\/alt: Argument must be an Async/
  t.throws(altResolved(undefined), err, 'throws when passed an undefined with Resolved')
  t.throws(altResolved(null), err, 'throws when passed a null with Resolved')
  t.throws(altResolved(0), err, 'throws when passed a falsey number with Resolved')
  t.throws(altResolved(1), err, 'throws when passed a truthy number with Resolved')
  t.throws(altResolved(''), err, 'throws when passed a falsey string with Resolved')
  t.throws(altResolved('string'), err, 'throws when passed a truthy string with Resolved')
  t.throws(altResolved(false), err, 'throws when passed false with Resolved')
  t.throws(altResolved(true), err, 'throws when passed true with Resolved')
  t.throws(altResolved([]), err, 'throws when passed an array with Resolved')
  t.throws(altResolved({}), err, 'throws when passed an object with Resolved')
  t.throws(altResolved(m), err, 'throws when container types differ on Resolved')

  const altRejected = bindFunc(Async.Rejected(0)[fl.alt])

  t.throws(altRejected(undefined), err, 'throws when passed an undefined with Rejected')
  t.throws(altRejected(null), err, 'throws when passed a null with Rejected')
  t.throws(altRejected(0), err, 'throws when passed a falsey number with Rejected')
  t.throws(altRejected(1), err, 'throws when passed a truthy number with Rejected')
  t.throws(altRejected(''), err, 'throws when passed a falsey string with Rejected')
  t.throws(altRejected('string'), err, 'throws when passed a truthy string with Rejected')
  t.throws(altRejected(false), err, 'throws when passed false with Rejected')
  t.throws(altRejected(true), err, 'throws when passed true with Rejected')
  t.throws(altRejected([]), err, 'throws when passed an array with Rejected')
  t.throws(altRejected({}), err, 'throws when passed an object with Rejected')
  t.throws(altRejected(m), err, 'throws when container types differ on Rejected')

  t.doesNotThrow(altResolved(Async.of(0)), 'does not throw when passed an Async with Resolved')
  t.doesNotThrow(altRejected(Async.of(0)), 'does not throw when passed an Async with Rejected')

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

  t.same(assocLeft.args[0], assocRight.args[0], 'associativity')

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

  const err = /Async\.ap: Wrapped value must be a function/
  t.throws(lift(undefined), err, 'throws when wrapped value is undefined')
  t.throws(lift(null), err, 'throws when wrapped value is null')
  t.throws(lift(0), err, 'throws when wrapped value is a falsey number')
  t.throws(lift(1), err, 'throws when wrapped value is a truthy number')
  t.throws(lift(''), err, 'throws when wrapped value is a falsey string')
  t.throws(lift('string'), err, 'throws when wrapped value is a truthy string')
  t.throws(lift(false), err, 'throws when wrapped value is false')
  t.throws(lift(true), err, 'throws when wrapped value is true')
  t.throws(lift([]), err, 'throws when wrapped value is an array')
  t.throws(lift({}), err, 'throws when wrapped value is an object')

  const noAsync = /Async\.ap: Argument must be an Async/
  t.throws(Async.of(unit).ap.bind(null, undefined), noAsync, 'throws when passed undefined')
  t.throws(Async.of(unit).ap.bind(null, null), noAsync, 'throws when passed null')
  t.throws(Async.of(unit).ap.bind(null, 0), noAsync, 'throws when passed a falsey number')
  t.throws(Async.of(unit).ap.bind(null, 1), noAsync, 'throws when passed a truthy number')
  t.throws(Async.of(unit).ap.bind(null, ''), noAsync, 'throws when passed a falsey string')
  t.throws(Async.of(unit).ap.bind(null, 'string'), noAsync, 'throws when passed a truthy string')
  t.throws(Async.of(unit).ap.bind(null, false), noAsync, 'throws when passed false')
  t.throws(Async.of(unit).ap.bind(null, true), noAsync, 'throws when passed true')
  t.throws(Async.of(unit).ap.bind(null, []), noAsync, 'throws when passed an array')
  t.throws(Async.of(unit).ap.bind(null, {}), noAsync, 'throws when passed an object')

  t.throws(Async.of(unit).ap.bind(null, m), noAsync, 'throws when container types differ')

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
  Async.of(applyTo(3)).ap(m).fork(unit, bInterRes)

  t.same(aInterRes.args[0], bInterRes.args[0], 'interchange')

  t.end()
})

test('Async chain errors', t => {
  const chain = bindFunc(Async(unit).chain)

  const err = /Async\.chain: Argument must be a Function that returns an Async/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws with null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  const noAsync = /Async\.chain: Function must return another Async/
  t.throws(Async.of(3).chain(unit).fork.bind(null, unit, unit), noAsync, 'throws with a non-Async returning function')

  t.doesNotThrow(Async.of(3).chain(Async.of).fork.bind(null, unit, unit), 'allows an Async returning function')

  t.end()
})

test('Async chain fantasy-land errors', t => {
  const chain = bindFunc(Async(unit)[fl.chain])

  const err = /Async\.fantasy-land\/chain: Argument must be a Function that returns an Async/
  t.throws(chain(undefined), err, 'throws with undefined')
  t.throws(chain(null), err, 'throws with null')
  t.throws(chain(0), err, 'throws with falsey number')
  t.throws(chain(1), err, 'throws with truthy number')
  t.throws(chain(''), err, 'throws with falsey string')
  t.throws(chain('string'), err, 'throws with truthy string')
  t.throws(chain(false), err, 'throws with false')
  t.throws(chain(true), err, 'throws with true')
  t.throws(chain([]), err, 'throws with an array')
  t.throws(chain({}), err, 'throws with an object')

  const noAsync = /Async\.fantasy-land\/chain: Function must return another Async/
  t.throws(Async.of(3)[fl.chain](unit).fork.bind(null, unit, unit), noAsync, 'throws with a non-Async returning function')

  t.doesNotThrow(Async.of(3)[fl.chain](Async.of).fork.bind(null, unit, unit), 'allows an Async returning function with Resolved')
  t.doesNotThrow(Async.Rejected(3)[fl.chain](Async.of).fork.bind(null, unit, unit), 'allows an Async returning function with Rejected')

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

  t.same(aRes.args[0], bRes.args[0], 'associativity')

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

test('Async bichain left errors', t => {
  const { Rejected } = Async
  const bichain = bindFunc(Async(unit).bichain)

  const err = /Async.bichain: Both arguments must be Async returning functions/
  t.throws(bichain(undefined, Rejected), err, 'throws with undefined on left')
  t.throws(bichain(null, Rejected), err, 'throws with null on left')
  t.throws(bichain(0, Rejected), err, 'throws with falsy number on left')
  t.throws(bichain(1, Rejected), err, 'throws with truthy number on left')
  t.throws(bichain('', Rejected), err, 'throws with falsy string on left')
  t.throws(bichain('string', Rejected), err, 'throws with truthy string on left')
  t.throws(bichain(false, Rejected), err, 'throws with false on left')
  t.throws(bichain(true, Rejected), err, 'throws with true on left')
  t.throws(bichain([], Rejected), err, 'throws with an array on left')
  t.throws(bichain({}, Rejected), err, 'throws with an object on left')

  const fn = () => Rejected(0)
    .bichain(unit, Rejected)
    .fork(unit, unit)

  t.throws(fn, err, 'throws with a non-Async returning function')

  t.end()
})

test('Async bichain right errors', t => {
  const { Resolved } = Async
  const bichain = bindFunc(Async(unit).bichain)

  const err = /Async.bichain: Both arguments must be Async returning functions/

  t.throws(bichain(Resolved, undefined), err, 'throws with undefined on right')
  t.throws(bichain(Resolved, null), err, 'throws with null on right')
  t.throws(bichain(Resolved, 0), err, 'throws with falsy number on right')
  t.throws(bichain(Resolved, 1), err, 'throws with truthy number on right')
  t.throws(bichain(Resolved, ''), err, 'throws with falsy string on right')
  t.throws(bichain(Resolved, 'string'), err, 'throws with truthy string on right')
  t.throws(bichain(Resolved, false), err, 'throws with false on right')
  t.throws(bichain(Resolved, true), err, 'throws with true on right')
  t.throws(bichain(Resolved, []), err, 'throws with an array on right')
  t.throws(bichain(Resolved, {}), err, 'throws with an object on right')

  const fn = () => Resolved(0)
    .bichain(Resolved, unit)
    .fork(unit, unit)

  t.throws(fn, err, 'throws with a non-Async returning function')

  t.end()
})

test('Async bichain functionality', t => {
  const { Rejected, Resolved } = Async

  const left = x => Rejected(x + 1)
  const right = x => Resolved(x + 1)

  const ltr = sinon.spy()
  const rtl = sinon.spy()
  const rtr = sinon.spy()
  const ltl = sinon.spy()

  Rejected(0).bichain(right, left).fork(unit, ltr)
  Resolved(0).bichain(right, left).fork(rtl, unit)
  Resolved(0).bichain(left, right).fork(unit, rtr)
  Rejected(0).bichain(left, right).fork(ltl, unit)

  t.equals(ltr.args[0][0], 1, 'moves from Rejected to Resolved')
  t.equals(rtl.args[0][0], 1, 'moves from Resolved to Rejected')
  t.equals(rtr.args[0][0], 1, 'moves from Resolved to Resolved')
  t.equals(ltl.args[0][0], 1, 'moves from Rejected to Rejected')

  t.end()
})
