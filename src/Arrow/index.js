/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('Arrow')
const _type = require('../core/types').typeFn(type(), VERSION)
const fl = require('../core/flNames')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const Pair = require('../core/types').proxy('Pair')

const _id =
  () => Arrow(x => x)

function Arrow(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('Arrow: Argument must be a Function')
  }

  const inspect =
    () => `Arrow${_inspect(runWith)}`

  const id =
    _id

  const _map = fn =>
    Arrow(x => fn(runWith(x)))

  function compose(method) {
    return function(m) {
      if(!isSameType(Arrow, m)) {
        throw new TypeError(`Arrow.${method}: Argument must be an Arrow`)
      }

      return _map(m.runWith)
    }
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Arrow.${method}: Argument must be a Function`)
      }

      return _map(fn)
    }
  }

  function contramap(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`Arrow.${method}: Argument must be a Function`)
      }

      return Arrow(x => runWith(fn(x)))
    }
  }

  function promap(method) {
    return function(l, r) {
      if(!isFunction(l) || !isFunction(r)) {
        throw new TypeError(`Arrow.${method}: Both arguments must be Functions`)
      }

      return Arrow(x => r(runWith(l(x))))
    }
  }

  function first() {
    return Arrow(function(x) {
      if(!isSameType(Pair, x)) {
        throw TypeError('Arrow.first: Inner argument must be a Pair')
      }
      return x.bimap(runWith, x => x)
    })
  }

  function second() {
    return Arrow(function(x) {
      if(!isSameType(Pair, x)) {
        throw TypeError('Arrow.second: Inner argument must be a Pair')
      }

      return x.bimap(x => x, runWith)
    })
  }

  function both() {
    return Arrow(function(x) {
      if(!isSameType(Pair, x)) {
        throw TypeError('Arrow.both: Inner argument must be a Pair')
      }
      return x.bimap(runWith, runWith)
    })
  }

  return {
    inspect, toString: inspect, type,
    runWith, id, first, second, both,
    compose: compose('compose'),
    map: map('map'),
    contramap: contramap('contramap'),
    promap: promap('promap'),
    [fl.id]: id,
    [fl.compose]: compose(fl.compose),
    [fl.map]: map(fl.map),
    [fl.contramap]: contramap(fl.contramap),
    [fl.promap]: promap(fl.promap),
    ['@@type']: _type,
    constructor: Arrow
  }
}

Arrow.id = _id
Arrow.type = type

Arrow[fl.id] = _id
Arrow['@@type'] = _type

Arrow['@@implements'] = _implements(
  [ 'compose', 'contramap', 'id', 'map', 'promap' ]
)

module.exports = Arrow
