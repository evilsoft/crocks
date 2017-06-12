/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../internal/implements')
const _inspect = require('../internal/inspect')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const isFunction = require('../predicates/isFunction')
const isFunctor = require('../predicates/isFunctor')
const isMonad = require('../predicates/isMonad')
const isSameType = require('../predicates/isSameType')
const merge = require('../pointfree/merge')
const sequence = require('../pointfree/sequence')

const Pair = require('./Pair')

const _type =
  constant('Star')

function Star(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Star: Function in the form (a -> f b) required')
  }

  const type =
    _type

  const inspect =
    constant(`Star${_inspect(runWith)}`)

  function compose(s) {
    if(!isSameType(Star, s)) {
      throw new TypeError('Star.concat: Star required')
    }

    return Star(function(x) {
      const m = runWith(x)

      if(!isMonad(m)) {
        throw new TypeError('Star.concat: Computations must return a Monad')
      }

      return m.chain(function(val) {
        const inner = s.runWith(val)

        if(!isSameType(m, inner)) {
          throw new TypeError('Star.concat: Computations must return Monads of the same type')
        }

        return inner
      })
    })
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Star.map: Function required')
    }

    return Star(function(x) {
      const m = runWith(x)

      if(!isFunctor(m)) {
        throw new TypeError('Star.map: Computation must return a Functor')
      }

      return m.map(fn)
    })
  }

  function contramap(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Star.contramap: Function required')
    }

    return Star(composeB(runWith, fn))
  }

  function promap(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Star.promap: Functions required for both arguments')
    }

    return Star(function(x) {
      const m = runWith(l(x))

      if(!isFunctor(m)) {
        throw new TypeError('Star.promap: Computation must return a Functor')
      }

      return m.map(r)
    })
  }

  function first() {
    return Star(function(x) {
      if(!isSameType(Pair, x)) {
        throw TypeError('Star.first: Pair required for computation input')
      }

      const m = runWith(x.fst())

      if(!isFunctor(m)) {
        throw new TypeError('Star.first: Computaion must return a Functor')
      }

      return m.map(l => Pair(l, x.snd()))
    })
  }

  function second() {
    return Star(function(x) {
      if(!isSameType(Pair, x)) {
        throw TypeError('Star.second: Pair required for computation input')
      }

      const m = runWith(x.snd())

      if(!isFunctor(m)) {
        throw new TypeError('Star.second: Computation must return a Functor')
      }

      return m.map(r => Pair(x.fst(), r))
    })
  }

  function both() {
    return Star(function(x) {
      if(!isSameType(Pair, x)) {
        throw TypeError('Star.both: Pair required for computation input')
      }

      const p = x.bimap(runWith, runWith)
      const m = p.fst()

      if(!isMonad(m)) {
        throw new TypeError('Star.both: Computaion must return a Monad')
      }

      return sequence(m.of, merge((x, y) => [ x, y ], p)).map(x => Pair(x[0], x[1]))
    })
  }

  return {
    inspect, type, runWith, compose, map,
    contramap, promap, first, second, both
  }
}

Star.type = _type

Star['@@implements'] = _implements(
  [ 'compose', 'contramap', 'map', 'promap' ]
)

module.exports = Star
