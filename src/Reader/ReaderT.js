/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 1

import _implements from '../core/implements'
import _inspect from '../core/inspect'
import fl from '../core/flNames'

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isMonad from '../core/isMonad'
import isSameType from '../core/isSameType'

import { typeFn, type as getType } from '../core/types'

const _type = getType('Reader')()

const _typeString = typeFn(_type, VERSION)

export default function _ReaderT(Monad) {
  if(!isMonad(Monad)) {
    throw new TypeError('ReaderT: Monad required for construction')
  }

  const type =
    () => `${_type}( ${Monad.type()} )`

  const typeString =
    `${_typeString}( ${Monad['@@type']} )`

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
      inspect, toString: inspect, type,
      runWith, of, map, ap, chain,
      [fl.of]: of,
      [fl.map]: map,
      [fl.chain]: chain,
      ['@@type']: typeString,
      constructor: ReaderT
    }
  }

  ReaderT.type = type
  ReaderT.of = of
  ReaderT.ask = ask
  ReaderT.lift = lift
  ReaderT.liftFn = curry(liftFn)

  ReaderT[fl.of] = of
  ReaderT['@@type'] = typeString

  ReaderT['@@implements'] = _implements(
    [ 'ap', 'chain', 'map', 'of' ]
  )

  return ReaderT
}
