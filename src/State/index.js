/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _implements = require('../core/implements')
const _inspect = require('../core/inspect')
const type = require('../core/types').type('State')

const Pair = require('../core/Pair')
const Unit = require('../core/Unit')

const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const _of =
  x => State(s => Pair(x, s))

function get(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('State.get: Function Required')
  }

  return State(s => Pair(fn(s), s))
}

function modify(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('State.modify: Function Required')
  }

  return State(s => Pair(Unit(), fn(s)))
}

function State(runWith) {
  if(!isFunction(runWith)) {
    throw new TypeError('State: Must wrap a function in the form (s -> Pair a s)')
  }

  const of =
    _of

  const inspect =
    () => `State${_inspect(runWith)}`

  function execWith(s) {
    const pair = runWith(s)

    if(!isSameType(Pair, pair)) {
      throw new TypeError('State.execWith: Must wrap a function in the form (s -> Pair a s)')
    }

    return pair.snd()
  }

  function evalWith(s) {
    const pair = runWith(s)

    if(!isSameType(Pair, pair)) {
      throw new TypeError('State.evalWith: Must wrap a function in the form (s -> Pair a s)')
    }

    return pair.fst()
  }

  function map(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('State.map: Function required')
    }

    return State(s => {
      const m = runWith(s)

      if(!isSameType(Pair, m)) {
        throw new TypeError('State.map: Must wrap a function in the form (s -> Pair a s)')
      }

      return Pair(fn(m.fst()), m.snd())
    })
  }

  function ap(m) {
    if(!isSameType(State, m)) {
      throw new TypeError('State.ap: State required')
    }

    return State(s => {
      const pair = runWith(s)

      if(!isSameType(Pair, pair)) {
        throw new TypeError('State.ap: Must wrap a function in the form (s -> Pair a s)')
      }

      const fn = pair.fst()

      if(!isFunction(fn)) {
        throw new TypeError('State.ap: Source value must be a function')
      }

      return m.map(fn).runWith(pair.snd())
    })
  }

  function chain(fn) {
    if(!isFunction(fn)) {
      throw new TypeError('State.chain: Function required')
    }

    return State(s => {
      const pair = runWith(s)

      if(!isSameType(Pair, pair)) {
        throw new TypeError('State.chain: Must wrap a function in the form (s -> Pair a s)')
      }

      const m = fn(pair.fst())

      if(!isSameType(State, m)) {
        throw new TypeError('State.chain: Function must return another State')
      }

      return m.runWith(pair.snd())
    })
  }

  return {
    runWith, execWith, evalWith,
    inspect, type, map, ap, chain,
    of
  }
}

State.of = _of
State.type = type
State.get = get

State.modify = modify

State.put =
  x => modify(() => (x))

State['@@implements'] = _implements(
  [ 'ap', 'chain', 'map', 'of' ]
)

module.exports = State
