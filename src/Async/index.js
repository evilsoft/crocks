/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

import _implements from '../core/implements.js'
import _inspect from '../core/inspect.js'
import types from '../core/types.js'
const type = types.type('Async')
const _type = types.typeFn(type(), VERSION)
import fl from '../core/flNames.js'

import array from '../core/array.js'
import compose from '../core/compose.js'
import once from '../core/once.js'
import unit from '../core/_unit.js'

import isArray from '../core/isArray.js'
import isFoldable from '../core/isFoldable.js'
import isFunction from '../core/isFunction.js'
import isPromise from '../core/isPromise.js'
import isSameType from '../core/isSameType.js'

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

function Async(fn, parentCancel) {
  if(!isFunction(fn)) {
    throw new TypeError('Async: Function required')
  }

  var cancelled

  const cancel = compose(
    () => { cancelled = true },
    isFunction(parentCancel) ? parentCancel : unit
  )

  const of =
    _of

  const inspect =
    () => `Async${_inspect(fn)}`

  function fork(reject, resolve, cleanup) {
    if(!isFunction(reject) || !isFunction(resolve)) {
      throw new TypeError('Async.fork: Reject and resolve functions required')
    }

    const forkCancel =
      isFunction(cleanup) ? cleanup : unit

    fn(
      x => cancelled ? unit() : reject(x),
      x => cancelled ? unit() : resolve(x)
    )

    return once(compose(forkCancel, cancel))
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
      fork(
        compose(resolve, l),
        compose(reject, r)
      )
    }, cancel)
  }

  function coalesce(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Async.coalesce: Functions required for both arguments')
    }

    return Async(function(reject, resolve) {
      fork(
        compose(resolve, l),
        compose(resolve, r)
      )
    }, cancel)
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Async.map: Function required')
    }

    return Async(function(reject, resolve) {
      fork(reject, compose(resolve, fn))
    }, cancel)
  }

  function bimap(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Async.bimap: Functions required for both arguments')
    }

    return Async(function(reject, resolve) {
      fork(
        compose(reject, l),
        compose(resolve, r)
      )
    }, cancel)
  }

  function alt(m) {
    var innerCancel = unit

    if(!isSameType(Async, m)) {
      throw new TypeError('Async.alt: Async required')
    }

    return Async((rej, res) => {
      fork(
        () => { innerCancel = m.fork(rej, res) },
        res
      )
    }, once(() => innerCancel(cancel())))
  }

  function ap(m) {
    var fn, value
    var fnDone = false
    var valueDone = false
    var innerCancel = unit

    if(!isSameType(Async, m)) {
      throw new TypeError('Async.ap: Async required')
    }

    return Async(function(reject, resolve) {
      const rejectOnce = once(reject)

      function resolveBoth() {
        if(fnDone && valueDone) {
          compose(resolve, fn)(value)
        }
      }

      fork(rejectOnce, function(f) {
        if(!isFunction(f)) {
          throw new TypeError('Async.ap: Wrapped value must be a function')
        }

        fnDone = true
        fn = f
        resolveBoth()
      })

      innerCancel = m.fork(rejectOnce, x => {
        valueDone = true
        value = x
        resolveBoth()
      })
    }, once(() => { innerCancel(cancel()) }))
  }

  function chain(fn) {
    var innerCancel = unit

    if(!isFunction(fn)) {
      throw new TypeError('Async.chain: Async returning function required')
    }

    return Async(function(reject, resolve) {
      fork(reject, function(x) {
        const m = fn(x)

        if(!isSameType(Async, m)) {
          throw new TypeError('Async.chain: Function must return another Async')
        }

        innerCancel = m.fork(reject, resolve)
      })
    }, once(() =>  { innerCancel(cancel()) }))
  }

  return {
    fork, toPromise, inspect,
    toString: inspect, type,
    swap, coalesce, map, bimap,
    alt, ap, chain, of,
    [fl.of]: of,
    [fl.alt]: alt,
    [fl.bimap]: bimap,
    [fl.map]: map,
    [fl.chain]: chain,
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

export default Async
