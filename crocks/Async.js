/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFoldable= require('../predicates/isFoldable')
const isFunction = require('../predicates/isFunction')

const _inspect = require('../internal/inspect')
const argsArray = require('../internal/argsArray')
const isType = require('../internal/isType')

const constant = require('../combinators/constant')
const composeB = require('../combinators/composeB')

const sequence = require('../pointfree/sequence')

const once = require('../helpers/once')
const mreduceMap = require('../helpers/mreduceMap')

const All = require('../monoids/All')

const allAsyncs =
  mreduceMap(All, x => isType(Async.type(), x))

const _type =
  constant('Async')

const _of =
  x => Async((_, resolve) => resolve(x))

const _rejected =
  x => Async((reject, _) => reject(x))

function all(asyncs) {
  if(!(isFoldable(asyncs) && allAsyncs(asyncs))) {
    throw new TypeError('Async.all: Foldable structure of Asyncs required')
  }

  return sequence(Async.of, asyncs)
}

function fromNode(fn, ctx) {
  if(!isFunction(fn)) {
    throw new TypeError('Async.fromNode: CPS function required')
  }

  return function() {
    const args = argsArray(arguments)

    return Async((reject, resolve) => {
      fn.apply(ctx,
        args.concat(
          (err, data) => err ? reject(err) : resolve(data)
        )
      )
    })
  }
}

const hasPromiseInterface =
  x => x && isFunction(x.then) && isFunction(x.catch)

function fromPromise(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('Async.fromPromise: Promise returning function required')
  }

  return function() {
    const promiseArgs = arguments

    return Async(function(reject, resolve) {
      const promise = fn.apply(null, promiseArgs)

      if(!hasPromiseInterface(promise)) {
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

  const type =
    _type

  const of =
    _of

  const inspect =
    constant(`Async${_inspect(fn)}`)

  function fork(reject, resolve) {
    if(!isFunction(reject) || !isFunction(resolve)) {
      throw new TypeError('Async.fork: reject and resolve functions required')
    }

    fn(reject, resolve)
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
        composeB(resolve, l),
        composeB(reject, r)
      )
    })
  }

  function coalesce(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Async.coalesce: Functions required for both arguments')
    }

    return Async(function(reject, resolve) {
      fork(
        composeB(resolve, l),
        composeB(resolve, r)
      )
    })
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Async.map: Function required')
    }

    return Async(function(reject, resolve) {
      fork(reject, composeB(resolve, fn))
    })
  }

  function bimap(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Async.bimap: Functions required for both arguments')
    }

    return Async(function(reject, resolve) {
      fork(
        composeB(reject, l),
        composeB(resolve, r)
      )
    })
  }

  function ap(m) {
    var fn, value
    var fnDone = false
    var valueDone = false

    if(!isType(type(), m)) {
      throw new TypeError('Async.ap: Async required')
    }

    return Async(function(reject, resolve) {
      const rejectOnce = once(reject)

      function resolveBoth() {
        if(fnDone && valueDone) {
          composeB(resolve, fn, value)
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

      m.fork(rejectOnce, function(x) {
        valueDone = true
        value = x
        resolveBoth()
      })
    })
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Async.chain: Async returning function required')
    }

    return Async(function(reject, resolve) {
      fork(reject, function(x) {
        const m = fn(x)

        if(!isType(type(), m)) {
          throw new TypeError('Async.chain: Function must return another Async')
        }

        m.fork(reject, resolve)
      })
    })
  }

  return {
    fork, toPromise, inspect, type,
    swap, coalesce, map, bimap, ap,
    chain, of
  }
}

Async.type = _type
Async.of = _of
Async.rejected = _rejected
Async.fromPromise = fromPromise
Async.fromNode = fromNode
Async.all = all

module.exports = Async
