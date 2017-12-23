/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Async')

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
    fork, toPromise, inspect, type,
    swap, coalesce, map, bimap, alt,
    ap, chain, of,
    constructor: Async
  }
}

Async.type = type
Async.of = _of

Async.Rejected = Rejected
Async.Resolved = _of

Async.fromPromise = fromPromise
Async.fromNode = fromNode

Async.all = all

Async['@@implements'] = _implements(
  [ 'alt', 'ap', 'bimap', 'chain', 'map', 'of' ]
)

module.exports = Async
