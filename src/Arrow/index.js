/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Arrow')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const Pair = require('../core/types').proxy('Pair')

const _id =
  () => Arrow(x => x)

function Arrow(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Arrow: Function required')
  }

  const inspect =
    () => `Arrow${_inspect(runWith)}`

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

    return Arrow(x => fn(runWith(x)))
  }

  function contramap(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Arrow.contramap: Function required')
    }

    return Arrow(x => runWith(fn(x)))
  }

  function promap(l, r) {
    if(!isFunction(l) || !isFunction(r)) {
      throw new TypeError('Arrow.promap: Functions required for both arguments')
    }

    return Arrow(x => r(runWith(l(x))))
  }

  function first() {
    return Arrow(function(x) {
      if(!(isSameType(Pair, x))) {
        throw TypeError('Arrow.first: Pair required for inner argument')
      }
      return x.bimap(runWith, x => x)
    })
  }

  function second() {
    return Arrow(function(x) {
      if(!(isSameType(Pair, x))) {
        throw TypeError('Arrow.second: Pair required for inner argument')
      }

      return x.bimap(x => x, runWith)
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
    inspect, type, runWith,
    id, compose, map, contramap,
    promap, first, second, both,
    constructor: Arrow
  }
}

Arrow.id = _id
Arrow.type = type

Arrow['@@implements'] = _implements(
  [ 'compose', 'contramap', 'id', 'map', 'promap' ]
)

module.exports = Arrow
