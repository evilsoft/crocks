/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isFunctor = require('../predicates/isFunctor')
const isMonad = require('../predicates/isMonad')

const isType = require('../internal/isType')
const _inspect = require('../internal/inspect')

const identity = require('../combinators/identity')
const compose = require('../helpers/compose')
const constant = require('../combinators/constant')

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

  function concat(s) {
    if(!(s && isType(type(), s))) {
      throw new TypeError('Star.concat: Star required')
    }

    return Star(function(x) {
      const m = runWith(x)

      if(!isMonad(m)) {
        throw new TypeError('Star.concat: Computations must return a Monad')
      }

      return m.chain(function(val) {
        const inner = s.runWith(val)

        if(!(inner && isType(m.type(), inner))) {
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

    return Star(compose(runWith, fn))
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
      if(!isType(Pair.type(), x)) {
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
      if(!isType(Pair.type(), x)) {
        throw TypeError('Star.second: Pair required for computation input')
      }

      const m = runWith(x.snd())

      if(!isFunctor(m)) {
        throw new TypeError('Star.second: Computation must return a Functor')
      }

      return m.map(r => Pair(x.fst(), r))
    })
  }

  return {
    inspect, type, runWith, concat, map,
    contramap, promap, first, second
  }
}

Star.type = _type

module.exports = Star
