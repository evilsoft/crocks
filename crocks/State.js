/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')

const _inspect = require('../funcs/inspect')

const constant = require('../combinators/constant')

const Pair = require('../crocks/Pair')

const _of =
  Function.prototype

const _type =
  constant('State')

function State(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('State: Must wrap a function in the form (s -> Pair a s)')
  }

  const type =
    _type

  const inspect =
    constant(`State${_inspect(runWith)}`)

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('State.map: Function required')
    }

    return State(s => {
      const m = runWith(s)

      if(!isType(Pair.type(), m)) {
        throw new TypeError('State.map: Must wrap a function in the form (s -> Pair a s)')
      }

      return Pair(fn(m.fst()), m.snd())
    })
  }

  return {
    runWith, inspect, type, map
  }
}

State.of =
  _of

State.type =
  _type

module.exports = State
