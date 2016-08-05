const isMonoid    = require('../internal/isMonoid')
const isFunction  = require('../internal/isFunction')
const constant    = require('../combinators/constant')

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

    function concat(m) {
      return Flipped(m.inner().concat(x).value())
    }

    const inner = constant(x)
    const value = constant(x.value())
    const empty = _empty
    const type  = _type

    return { inner, value, type, concat, empty }
  }

  Flipped.empty = _empty
  Flipped.type  = _type

  return Flipped
}

module.exports = Flip
