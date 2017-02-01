/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')

const isType = require('../internal/isType')
const _inspect = require('../internal/inspect')

const compose = require('../helpers/compose')

const identity = require('../combinators/identity')
const constant = require('../combinators/constant')

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

  function first() {
    return Arrow(function(x) {
      if(!(x && x.type && x.type() === Pair.type())) {
        throw TypeError('Arrow.first: Pair required for inner argument')
      }
      return x.bimap(runWith, identity)
    })
  }

  function second() {
    return Arrow(function(x) {
      if(!(x && x.type && x.type() === Pair.type())) {
        throw TypeError('Arrow.second: Pair required for inner argument')
      }

      return x.bimap(identity, runWith)
    })
  }

  function both() {
    return Arrow(function(x) {
      if(!(x && x.type && x.type() === Pair.type())) {
        throw TypeError('Arrow.both: Pair required for inner argument')
      }
      return x.bimap(runWith, runWith)
    })
  }

  return {
    inspect, type, value, runWith,
    concat, empty, map, contramap,
    promap, first, second, both
  }
}

Arrow.empty = _empty
Arrow.type = _type

module.exports = Arrow
