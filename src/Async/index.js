/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Async')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const array = require('../core/array')
const compose = require('../core/compose')
const once = require('../core/once')
const unit = require('../core/_unit')

const isArray = require('../core/isArray')
const isFoldable = require('../core/isFoldable')
const isFunction = require('../core/isFunction')
const isPromise = require('../core/isPromise')
const isSameType = require('../core/isSameType')

const allAsyncs = xs =>
  xs.reduce((acc, x) => acc && isSameType(Async, x), true)

const _of =
  x => Async((_, resolve) => resolve(x))

const Rejected =
  x => Async((reject) => reject(x))

function all(asyncs) {
  if(!(isFoldable(asyncs) && allAsyncs(asyncs))) {
    throw new TypeError('Async.all: Foldable structure of Asyncs required')
  }

  if(isArray(asyncs)) {
    return array.sequence(Async.of, asyncs)
  }

  return asyncs.sequence(Async.of)
}

function fromNode(fn, ctx) {
  if(!isFunction(fn)) {
    throw new TypeError('Async.fromNode: CPS function required')
  }

  return (...args) =>
    Async((reject, resolve) => {
      fn.apply(ctx,
        args.concat(
          (err, data) => err ? reject(err) : resolve(data)
        )
      )
    })
}

function fromPromise(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('Async.fromPromise: Promise returning function required')
  }

  return function() {
    const promiseArgs = arguments

    return Async(function(reject, resolve) {
      const promise = fn.apply(null, promiseArgs)

      if(!isPromise(promise)) {
        throw new TypeError('Async.fromPromise: Promise returning function required')
      }

      promise
        .then(resolve)
        .catch(reject)
    })
  }
}

function Async(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('Async: Function required')
  }

  const of =
    _of

  const inspect =
    () => `Async${_inspect(fn)}`

  function fork(reject, resolve, cleanup) {
    if(!isFunction(reject) || !isFunction(resolve)) {
      throw new TypeError('Async.fork: Reject and resolve functions required')
    }

    let cancelled = false

    const cancel = () => { cancelled = true }

    const forkCancel =
      isFunction(cleanup) ? cleanup : unit

    const internal = fn(
      x => cancelled ? unit() : reject(x),
      x => cancelled ? unit() : resolve(x)
    )
    const internalFn = isFunction(internal) ? internal : unit

    return once(() => forkCancel(internalFn(cancel())))
  }

  function toPromise() {
    return new Promise(function(resolve, reject) {
      fork(reject, resolve)
    })
  }

  function swap(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Async.swap: Functions required for both arguments')
    }

    return Async(function(reject, resolve) {
      return fork(
        compose(resolve, l),
        compose(reject, r)
      )
    })
  }

  function coalesce(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Async.coalesce: Functions required for both arguments')
    }

    return Async(function(reject, resolve) {
      return fork(
        compose(resolve, l),
        compose(resolve, r)
      )
    })
  }

  function map(method) {
    return function(mapFn) {
      if(!isFunction(mapFn)) {
        throw new TypeError(`Async.${method}: Function required`)
      }

      return Async(function(reject, resolve) {
        return fork(reject, compose(resolve, mapFn))
      })
    }
  }

  function bimap(method) {
    return function(l, r) {
      if(!isFunction(l) || !isFunction(r)) {
        throw new TypeError(`Async.${method}: Functions required for both arguments`)
      }

      return Async(function(reject, resolve) {
        return fork(
          compose(reject, l),
          compose(resolve, r)
        )
      })
    }
  }

  function alt(method) {
    return function(m) {
      if(!isSameType(Async, m)) {
        throw new TypeError(`Async.${method}: Async required`)
      }

      return Async((rej, res) => {
        let cancel = fork(
          () => { cancel = m.fork(rej, res) },
          res
        )
        return () => cancel()
      })
    }
  }

  function ap(m) {
    if(!isSameType(Async, m)) {
      throw new TypeError('Async.ap: Async required')
    }

    return Async(function(reject, resolve) {
      let apFn = null
      let value = null
      let fnDone = false
      let valueDone = false
      let canceled = false

      const cancel = () => { canceled = true }
      const rejectOnce = once(reject)

      function resolveBoth() {
        if(!canceled && fnDone && valueDone) {
          compose(resolve, apFn)(value)
        }
      }

      const fnCancel = fork(rejectOnce, function(f) {
        if(!isFunction(f)) {
          throw new TypeError('Async.ap: Wrapped value must be a function')
        }

        fnDone = true
        apFn = f
        resolveBoth()
      })

      const valueCancel = m.fork(rejectOnce, x => {
        valueDone = true
        value = x
        resolveBoth()
      })
      return () => cancel(fnCancel(valueCancel()))
    })
  }

  function chain(method) {
    return function(mapFn) {
      if(!isFunction(mapFn)) {
        throw new TypeError(
          `Async.${method}: Async returning function required`
        )
      }

      return Async(function(reject, resolve) {
        let cancel = fork(reject, function(x) {
          const m = mapFn(x)

          if(!isSameType(Async, m)) {
            throw new TypeError(
              `Async.${method}: Function must return another Async`
            )
          }

          cancel = m.fork(reject, resolve)
        })
        return () => cancel()
      })
    }
  }

  return {
    fork, toPromise, inspect,
    toString: inspect, type,
    swap, coalesce, ap, of,
    alt: alt('alt'),
    bimap: bimap('bimap'),
    map: map('map'),
    chain: chain('chain'),
    [fl.of]: of,
    [fl.alt]: alt(fl.alt),
    [fl.bimap]: bimap(fl.bimap),
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: Async
  }
}

Async.of = _of
Async.type = type

Async[fl.of] = _of
Async['@@type'] = _type

Async.Rejected = Rejected
Async.Resolved = _of

Async.fromPromise = fromPromise
Async.fromNode = fromNode

Async.all = all

Async['@@implements'] = _implements(
  [ 'alt', 'ap', 'bimap', 'chain', 'map', 'of' ]
)

module.exports = Async
