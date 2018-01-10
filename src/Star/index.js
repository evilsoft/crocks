/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const _type = require('../core/types').type('Star')

const array = require('../core/array')
const isFunction = require('../core/isFunction')
const isMonad = require('../core/isMonad')
const isSameType = require('../core/isSameType')

const Pair = require('../core/Pair')

const merge =
  (fn, m) => m.merge(fn)

const sequence =
  (af, m) => array.sequence(af, m)

function _Star(Monad) {
  if(!isMonad(Monad)) {
    throw new TypeError('Star: Monad required for construction')
  }

  const _id =
    () => Star(Monad.of)

  const innerType =
    Monad.type()

  const outerType =
    `${_type()}( ${innerType} )`

  const type =
    () => outerType

  function Star(runWith) {
    if(!isFunction(runWith)) {
      throw new TypeError(`${outerType}: Function in the form (a -> m b) required`)
    }

    const inspect =
      () => `${outerType}${_inspect(runWith)}`

    const id =
      _id

    function compose(s) {
      if(!isSameType(Star, s)) {
        throw new TypeError(`${outerType}.compose: ${outerType} required`)
      }

      return Star(function(x) {
        const m = runWith(x)

        if(!isSameType(Monad, m)) {
          throw new TypeError(`${outerType}.compose: Computations must return a type of ${innerType}`)
        }

        return m.chain(function(val) {
          const inner = s.runWith(val)

          if(!isSameType(m, inner)) {
            throw new TypeError(`${outerType}.compose: Both computations must return a type of ${innerType}`)
          }

          return inner
        })
      })
    }

    function map(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`${outerType}.map: Function required`)
      }

      return Star(function(x) {
        const m = runWith(x)

        if(!isSameType(Monad, m)) {
          throw new TypeError(`${outerType}.map: Computations must return a type of ${innerType}`)
        }

        return m.map(fn)
      })
    }

    function contramap(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`${outerType}.contramap: Function required`)
      }

      return Star(x => runWith(fn(x)))
    }

    function promap(l, r) {
      if(!isFunction(l) || !isFunction(r)) {
        throw new TypeError(`${outerType}.promap: Functions required for both arguments`)
      }

      return Star(function(x) {
        const m = runWith(l(x))

        if(!isSameType(Monad, m)) {
          throw new TypeError(`${outerType}.promap: Computation must return a type of ${innerType}`)
        }

        return m.map(r)
      })
    }

    function first() {
      return Star(function(x) {
        if(!isSameType(Pair, x)) {
          throw TypeError(`${outerType}.first: Pair required for computation input`)
        }

        const m = runWith(x.fst())

        if(!isSameType(Monad, m)) {
          throw new TypeError(`${outerType}.first: Computation must return a type of ${innerType}`)
        }

        return m.map(l => Pair(l, x.snd()))
      })
    }

    function second() {
      return Star(function(x) {
        if(!isSameType(Pair, x)) {
          throw TypeError(`${outerType}.second: Pair required for computation input`)
        }

        const m = runWith(x.snd())

        if(!isSameType(Monad, m)) {
          throw new TypeError(`${outerType}.second: Computation must return a type of ${innerType}`)
        }

        return m.map(r => Pair(x.fst(), r))
      })
    }

    function both() {
      return Star(function(x) {
        if(!isSameType(Pair, x)) {
          throw TypeError(`${outerType}.both: Pair required for computation input`)
        }

        const p = x.bimap(runWith, runWith)
        const m = p.fst()

        if(!isSameType(Monad, m)) {
          throw new TypeError(`${outerType}.both: Computation must return a type of ${innerType}`)
        }

        return sequence(m.of, merge((x, y) => [ x, y ], p)).map(x => Pair(x[0], x[1]))
      })
    }

    return {
      inspect, type, runWith,
      id, compose, map, contramap,
      promap, first, second, both,
      constructor: Star
    }
  }

  Star.id = _id
  Star.type = type

  Star['@@implements'] = _implements(
    [ 'compose', 'contramap', 'id', 'map', 'promap' ]
  )

  return Star
}

module.exports = _Star
