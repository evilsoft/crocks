/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 5

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Async')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const array = require('../core/array')
const compose = require('../core/compose')
const curry = require('../core/curry')
const once = require('../core/once')
const unit = require('../core/_unit')

const isArray = require('../core/isArray')
const isFoldable = require('../core/isFoldable')
const isFunction = require('../core/isFunction')
const isInteger = require('../core/isInteger')
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
    throw new TypeError('Async.all: Argument must be a Foldable structure of Asyncs')
  }

  if(isArray(asyncs)) {
    return array.sequence(Async.of, asyncs)
  }

  return asyncs.sequence(Async.of)
}

function fromNode(fn, ctx) {
  if(!isFunction(fn)) {
    throw new TypeError('Async.fromNode: Argument must be a continuation-passing-style Function')
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
    throw new TypeError('Async.fromPromise: Argument must be a Function that returns a Promise')
  }

  const _fn = curry(fn)

  return function() {
    const promiseArgs = arguments

    const promise = _fn.apply(null, promiseArgs)

    if (isFunction(promise)) {
      return fromPromise(promise)
    }

    return Async(function(reject, resolve) {

      if(!isPromise(promise)) {
        throw new TypeError('Async.fromPromise: Argument must be a Function that returns a Promise')
      }

      promise
        .then(resolve, reject)
    })
  }
}

function rejectAfter(ms, value) {
  if(!(isInteger(ms) && ms >= 0)) {
    throw new TypeError(
      'Async.rejectAfter: First argument must be a positive Integer'
    )
  }

  return Async(rej => {
    const token = setTimeout(() => {
      rej(value)
    }, ms)

    return () => { clearTimeout(token) }
  })
}

function resolveAfter(ms, value) {
  if(!(isInteger(ms) && ms >= 0)) {
    throw new TypeError(
      'Async.resolveAfter: First argument must be a positive Integer'
    )
  }

  return Async((_, res) => {
    const token = setTimeout(() => {
      res(value)
    }, ms)

    return () => { clearTimeout(token) }
  })
}

function Async(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('Async: Argument must be a Function')
  }

  const of =
    _of

  const inspect =
    () => `Async${_inspect(fn)}`

  function fork(reject, resolve, cleanup) {
    if(!isFunction(reject) || !isFunction(resolve)) {
      throw new TypeError('Async.fork: Reject and resolve arguments must both be Functions')
    }

    let cancelled = false
    let settled = false

    const cancel =
      () => { cancelled = true }

    const forkCancel =
      isFunction(cleanup) ? cleanup : unit

    const settle = (f, x) => {
      if(!settled) {
        settled = true

        if(cancelled) {
          return unit()
        }

        return f(x)
      }
    }

    const internal = fn(
      settle.bind(null, reject),
      settle.bind(null, resolve)
    )

    const internalFn = isFunction(internal) ? internal : unit

    return once(() => forkCancel(cancel(internalFn())))
  }

  function toPromise() {
    return new Promise(function(resolve, reject) {
      fork(reject, resolve)
    })
  }

  function race(m) {
    if(!isSameType(Async, m)) {
      throw new TypeError('Async.race: Argument must be an Async')
    }

    return Async(function(reject, resolve) {
      const settle = once(
        (resolved, value) => resolved ? resolve(value) : reject(value)
      )

      const res = settle.bind(null, true)
      const rej = settle.bind(null, false)

      const cancelOne = fork(rej, res)
      const cancelTwo = m.fork(rej, res)

      return () => { cancelOne(); cancelTwo() }
    })
  }

  function swap(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Async.swap: Both arguments must be Functions')
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
      throw new TypeError('Async.coalesce: Both arguments must be Functions')
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
        throw new TypeError(`Async.${method}: Argument must be a Function`)
      }

      return Async(function(reject, resolve) {
        return fork(reject, compose(resolve, mapFn))
      })
    }
  }

  function bimap(method) {
    return function(l, r) {
      if(!isFunction(l) || !isFunction(r)) {
        throw new TypeError(`Async.${method}: Both arguments must be Functions`)
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
        throw new TypeError(`Async.${method}: Argument must be an Async`)
      }

      return Async((rej, res) => {
        let cancel = unit
        let innerCancel = unit
        cancel = fork(
          () => { innerCancel = m.fork(rej, res) },
          res
        )
        return once(() => innerCancel(cancel()))
      })
    }
  }

  function ap(m) {
    if(!isSameType(Async, m)) {
      throw new TypeError('Async.ap: Argument must be an Async')
    }

    return Async(function(reject, resolve) {
      let apFn = null
      let value = null
      let fnDone = false
      let valueDone = false
      let cancelled = false

      const cancel = () => { cancelled = true }
      const rejectOnce = once(reject)

      function resolveBoth() {
        if(!cancelled && fnDone && valueDone) {
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

      return () => { fnCancel(); valueCancel(); cancel() }
    })
  }

  function chain(method) {
    return function(mapFn) {
      if(!isFunction(mapFn)) {
        throw new TypeError(
          `Async.${method}: Argument must be a Function that returns an Async`
        )
      }

      return Async(function(reject, resolve) {
        let cancel = unit
        let innerCancel = unit
        cancel = fork(reject, function(x) {
          const m = mapFn(x)

          if(!isSameType(Async, m)) {
            throw new TypeError(
              `Async.${method}: Function must return another Async`
            )
          }

          innerCancel = m.fork(reject, resolve)
        })
        return once(() => innerCancel(cancel()))
      })
    }
  }

  function bichain(l, r) {
    const bichainErr = 'Async.bichain: Both arguments must be Async returning functions'

    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError(bichainErr)
    }

    return Async(function(rej, res) {
      let cancel = unit
      let innerCancel = unit

      function setInnerCancel(mapFn) {
        return function(x) {
          const m = mapFn(x)

          if(!isSameType(Async, m)) {
            throw new TypeError(bichainErr)
          }

          innerCancel = m.fork(rej, res)
        }
      }

      cancel = fork(setInnerCancel(l), setInnerCancel(r))

      return once(() => innerCancel(cancel()))
    })
  }

  return {
    fork, toPromise, inspect,
    toString: inspect, type,
    swap, race, coalesce, ap,
    of,
    alt: alt('alt'),
    bimap: bimap('bimap'),
    map: map('map'),
    chain: chain('chain'),
    bichain,
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
Async.rejectAfter = rejectAfter
Async.resolveAfter = resolveAfter

Async['@@implements'] = _implements(
  [ 'alt', 'ap', 'bimap', 'chain', 'map', 'of' ]
)

module.exports = Async
