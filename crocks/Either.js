const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')
const constant    = require('../combinators/constant')
const composeB    = require('../combinators/composeB')

const isEqual = x => y => x === y

const _of   = () => {}
const _type = constant('Either')

const isLeft = l => l !== null

function Either(l, r) {
  if(arguments.length < 2) {
    throw new TypeError('Either: Requires two arguments')
  } else if(l === null && r === null) {
    throw new TypeError('Either: Requires at least one of its arguments to be none-null')
  }

  const type    = _type
  const value   = () => isLeft(l) ? l : r
  const equals  = m => isType(type(), m) && m.either(isEqual(l), isEqual(r))

  function either(lf, rf) {
    if(!isFunction(lf) || !isFunction(rf)) {
      throw new TypeError('Either.either: Requires both left and right functions')
    }

    return isLeft(l) ? lf(l) : rf(r)
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('Either.map: function required')
    }

    return either(Either.Left, composeB(Either.Right, fn))
  }

  return { type, either, value, equals, map }
}

Either.of   = _of
Either.type = _type

Either.Left   = l => Either(l, null)
Either.Right  = r => Either(null, r)

module.exports = Either
