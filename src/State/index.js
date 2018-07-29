/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements'
import _inspect from '../core/inspect'
import fl from '../core/flNames'

import Pair from '../core/Pair'
import Unit from '../core/Unit'

import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

import { typeFn, type as getType } from '../core/types'

export const type = getType('State')

const _type = typeFn(type(), VERSION)

export const of =
  x => State(s => Pair(x, s))

export function get(fn) {
  if(!arguments.length) {
    return State(s => Pair(s, s))
  }

  if(isFunction(fn)) {
    return State(s => Pair(fn(s), s))
  }

  throw new TypeError('State.get: No arguments or function required')
}

export function modify(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('State.modify: Function Required')
  }

  return State(s => Pair(Unit(), fn(s)))
}

export const put =
  x => modify(() => x)

export default function State(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('State: Must wrap a function in the form (s -> Pair a s)')
  }

  const inspect =
    () => `State${_inspect(fn)}`

  function runWith(state, ...params) {
    const [ func = 'runWith' ] = params
    const m = fn(state)

    if(!isSameType(Pair, m)) {
      throw new TypeError(`State.${func}: Must wrap a function in the form (s -> Pair a s)`)
    }

    return m
  }

  function execWith(s) {
    const pair = runWith(s, 'execWith')
    return pair.snd()
  }

  function evalWith(s) {
    const pair = runWith(s, 'evalWith')
    return pair.fst()
  }

  function map(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`State.${method}: Function required`)
      }

      return State(s => {
        const m = runWith(s, method)
        return Pair(fn(m.fst()), m.snd())
      })
    }
  }

  function ap(m) {
    if(!isSameType(State, m)) {
      throw new TypeError('State.ap: State required')
    }

    return State(s => {
      const pair = runWith(s, 'ap')
      const fn = pair.fst()

      if(!isFunction(fn)) {
        throw new TypeError('State.ap: Source value must be a function')
      }

      return m.map(fn).runWith(pair.snd())
    })
  }

  function chain(method) {
    return function(fn) {
      if(!isFunction(fn)) {
        throw new TypeError(`State.${method}: State returning function required`)
      }

      return State(s => {
        const pair = runWith(s, method)
        const m = fn(pair.fst())

        if(!isSameType(State, m)) {
          throw new TypeError(`State.${method}: Function must return another State`)
        }

        return m.runWith(pair.snd())
      })
    }
  }

  return {
    inspect, toString: inspect, runWith,
    execWith, evalWith, type, ap, of,
    map: map('map'),
    chain: chain('chain'),
    [fl.of]: of,
    [fl.map]: map(fl.map),
    [fl.chain]: chain(fl.chain),
    ['@@type']: _type,
    constructor: State
  }
}

State.of = of
State.get = get
State.modify = modify
State.put = put
State.type = type

State[fl.of] = of
State['@@type'] = _type

State['@@implements'] = _implements(
  [ 'ap', 'chain', 'map', 'of' ]
)
