/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction  = require('../internal/isFunction')
const isType      = require('../internal/isType')

const _inspect = require('../funcs/inspect')

const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')

const _type = constant('IO')
const _of   = x => IO(constant(x))

function IO(run) {
  if(!arguments.length || !isFunction(run)) {
    throw new TypeError('IO: Must wrap a function')
  }

  const type    = _type
  const of      = _of
  const inspect = constant(`IO${_inspect(run)}`)

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('IO.map: Function required')
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
      throw new TypeError('IO.chain: Function required')
    }

    return IO(_ => fn(run()).run())
  }

  return {
    inspect, run, type,
    map, ap, of, chain
  }
}

IO.of   = _of
IO.type = _type

module.exports = IO
