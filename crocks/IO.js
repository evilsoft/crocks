const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')

const _type = constant('IO')
const _of   = x => IO(constant(x))

function IO(run) {
  if(!arguments.length || !isFunction(run)) {
    throw new TypeError('IO: Must wrap a function')
  }

  const type  = _type
  const of    = _of

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('IO.map: function required')
    }

    return IO(composeB(fn, run))
  }

  function ap(m) {
    if(!isType(type(), m)) {
      throw new TypeError('IO.ap: IO required')
    }

    return chain(f => m.map(f))
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('IO.chain: function required')
    }

    return IO(_ => fn(run()).run())
  }

  return { run, type, map, ap, of, chain }
}

IO.of   = _of
IO.type = _type

module.exports = IO
