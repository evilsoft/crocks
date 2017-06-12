/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../internal/implements')
const _inspect = require('../internal/inspect')
const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')
const identity = require('../combinators/identity')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Pair = require('./Pair')

const _type =
  constant('Arrow')

const _id =
  () => Arrow(identity)

function Arrow(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Arrow: Function required')
  }

  const type =
    _type

  const value =
    constant(runWith)

  const inspect =
    constant(`Arrow${_inspect(value())}`)

  const id =
    _id

  function compose(m) {
    if(!(isSameType(Arrow, m))) {
      throw new TypeError('Arrow.compose: Arrow required')
    }

    return map(m.runWith)
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Arrow.map: Function required')
    }

    return Arrow(composeB(fn, runWith))
  }

  function contramap(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Arrow.contramap: Function required')
    }

    return Arrow(composeB(runWith, fn))
  }

  function promap(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Arrow.promap: Functions required for both arguments')
    }

    return Arrow(composeB(r, composeB(runWith, l)))
  }

  function first() {
    return Arrow(function(x) {
      if(!(isSameType(Pair, x))) {
        throw TypeError('Arrow.first: Pair required for inner argument')
      }
      return x.bimap(runWith, identity)
    })
  }

  function second() {
    return Arrow(function(x) {
      if(!(isSameType(Pair, x))) {
        throw TypeError('Arrow.second: Pair required for inner argument')
      }

      return x.bimap(identity, runWith)
    })
  }

  function both() {
    return Arrow(function(x) {
      if(!(isSameType(Pair, x))) {
        throw TypeError('Arrow.both: Pair required for inner argument')
      }
      return x.bimap(runWith, runWith)
    })
  }

  return {
    inspect, type, value, runWith,
    id, compose, map, contramap,
    promap, first, second, both
  }
}

Arrow.id = _id
Arrow.type = _type

Arrow['@@implements'] = _implements(
  [ 'compose', 'contramap', 'id', 'map', 'promap' ]
)

module.exports = Arrow
