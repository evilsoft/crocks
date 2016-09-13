/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isMonoid = require('../internal/isMonoid')
const isFunction = require('../internal/isFunction')

const _inspect = require('../funcs/inspect')

const constant = require('../combinators/constant')

function Flip(M) {
  if(!arguments.length || !isFunction(M.empty)) {
    throw new TypeError('Flip: Monoid required')
  }

  function _empty() {
    return Flipped(M.empty().value())
  }

  function _type() {
    return `Flip(${M.type()})`
  }

  function Flipped(y) {
    const x = M(y)

    const inspect =
      constant(`Flip(${_inspect(x)} )`)

    function concat(m) {
      return Flipped(m.inner().concat(x).value())
    }

    const inner =
      constant(x)

    const value =
      constant(x.value())

    const empty =
      _empty

    const type =
      _type

    return { inspect, inner, value, type, concat, empty }
  }

  Flipped.empty =
    _empty

  Flipped.type  =
    _type

  return Flipped
}

module.exports = Flip
