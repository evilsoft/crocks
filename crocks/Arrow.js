/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')

const _inspect = require('../funcs/inspect')

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')
const compose = require('../funcs/compose')

const Pair = require('./Pair')

const _type =
  constant('Arrow')

const _empty =
  () => Arrow(identity)

function Arrow(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Arrow: Function required')
  }

  const type =
    _type

  const empty =
    _empty

  const value =
    constant(runWith)

  const inspect =
    constant(`Arrow${_inspect(value())}`)

  function concat(m) {
    if(!(m && isType(type(), m))) {
      throw new TypeError('Arrow.concat: Arrow required')
    }

    return map(m.runWith)
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Arrow.map: Function required')
    }

    return Arrow(compose(fn, runWith))
  }

  function contramap(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Arrow.contramap: Function required')
    }

    return Arrow(compose(runWith, fn))
  }

  function promap(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Arrow.promap: Functions required for both arguments')
    }

    return Arrow(compose(r, runWith, l))
  }

  function first(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Arrow.first: Function required')
    }

    return map(function(x) {
      if(!(x && x.type && x.type() === Pair.type())) {
        throw TypeError('Arrow.first: Pair required for inner argument')
      }
      return x.bimap(fn, identity)
    })
  }

  function second(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Arrow.second: Function required')
    }

    return map(function(x) {
      if(!(x && x.type && x.type() === Pair.type())) {
        throw TypeError('Arrow.second: Pair required for inner argument')
      }

      return x.bimap(identity, fn)
    })
  }


  return {
    inspect, type, value, runWith,
    concat, empty, map, contramap,
    promap, first, second
  }
}

Arrow.empty = _empty
Arrow.type = _type

module.exports = Arrow
