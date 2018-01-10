/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _type = require('../core/types').type('Reader')()
const _inspect = require('../core/inspect')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isMonad = require('../core/isMonad')
const isSameType = require('../core/isSameType')

function _ReaderT(Monad) {
  if(!isMonad(Monad)) {
    throw new TypeError('ReaderT: Monad required for construction')
  }

  const type =
    () => `${_type}( ${Monad.type()} )`

  const of =
    x => ReaderT(() => Monad.of(x))

  function ask(fn) {
    if(!arguments.length) {
      return ReaderT(Monad.of)
    }

    if(isFunction(fn)) {
      return ReaderT(Monad.of).map(fn)
    }

    throw new TypeError(`${type()}.ask: No argument or function required`)
  }

  function lift(m) {
    if(!isSameType(Monad, m)) {
      throw new TypeError(`${type()}.lift: ${Monad.type()} instance required`)
    }

    return ReaderT(() => m)
  }

  function liftFn(fn, x) {
    if(!isFunction(fn)) {
      throw new TypeError(`${type()}.liftFn: ${Monad.type()} returning function required`)
    }

    return ReaderT(function() {
      const m = fn(x)

      if(!isSameType(Monad, m)) {
        throw new TypeError(`${type()}.liftFn: ${Monad.type()} returning function required`)
      }

      return m
    })
  }

  function ReaderT(wrapped) {
    if(!isFunction(wrapped)) {
      throw new TypeError(`${type()}: ${Monad.type()} returning function required`)
    }

    const inspect =
      () => `${type()}${_inspect(wrapped)}`

    function runWith(x) {
      const result = wrapped(x)

      if(!isSameType(Monad, result)) {
        throw new TypeError(`${type()}: ${Monad.type()} must be returned by wrapped function`)
      }

      return result
    }

    function map(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`${type()}.map: Function required`)
      }

      return ReaderT(e => runWith(e).map(fn))
    }

    function ap(m) {
      if(!isSameType(ReaderT, m)) {
        throw new TypeError(`${type()}.ap: ${type()} required`)
      }

      return ReaderT(e => runWith(e).ap(m.runWith(e)))
    }

    function chain(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`${type()}.chain: ${type()} returning function required`)
      }

      return ReaderT(e =>
        runWith(e).chain(inner => {
          const m = fn(inner)

          if(!isSameType(ReaderT, m)) {
            throw new TypeError(`${type()}.chain: Function must return a ${type()}`)
          }

          return m.runWith(e)
        })
      )
    }

    return {
      type, inspect, runWith,
      of, map, ap, chain
    }
  }

  ReaderT.type = type
  ReaderT.of = of
  ReaderT.ask = ask
  ReaderT.lift = lift
  ReaderT.liftFn = curry(liftFn)

  ReaderT['@@implements'] = _implements(
    [ 'ap', 'chain', 'map', 'of' ]
  )

  return ReaderT
}

module.exports = _ReaderT
