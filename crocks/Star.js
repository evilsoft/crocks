/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isFunctor = require('../internal/isFunctor')

const _inspect = require('../internal/inspect')

const constant = require('../combinators/constant')
const compose = require('../helpers/compose')

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

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Star.map: Function required')
    }

    return Star(function(x) {
      const m = runWith(x)

      if(!isFunctor(m)) {
        throw new TypeError('Star.map: Internal function must return a Functor')
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
        throw new TypeError('Star.promap: Internal function must return a Functor')
      }

      return m.map(r)
    })
  }

  return {
    inspect, type, runWith, map,
    contramap, promap
  }
}

Star.type = _type

module.exports = Star
