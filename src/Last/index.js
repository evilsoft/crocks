/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const VERSION = 2

import _implements from '../core/implements'
import _inspect from '../core/inspect'
import _equals from '../core/equals'
import fl from '../core/flNames'

import isSameType from '../core/isSameType'

import Maybe from '../core/Maybe'

import { typeFn, type as getType } from '../core/types'

export const type = getType('Last')

const _type = typeFn(type(), VERSION)

export const empty =
  () => Last(Maybe.Nothing())

function Last(x) {
  if(!arguments.length) {
    throw new TypeError('Last: Requires one argument')
  }

  const maybe =
    !isSameType(Maybe, x) ? Maybe.of(x) : x.map(x => x)

  const valueOf =
    () => maybe

  const inspect =
    () => `Last(${_inspect(maybe)} )`

  const equals =
  m => isSameType(Last, m)
    && _equals(maybe, m.valueOf())

  const option =
    maybe.option

  function concat(method) {
    return function(m) {
      if(!isSameType(Last, m)) {
        throw new TypeError(`Last.${method}: Last required`)
      }

      const n =
        m.valueOf().map(x => x)

      return Last(
        maybe.either(
          () => n,
          () => n.either(() => maybe, () => n)
        )
      )
    }
  }

  return {
    inspect, toString: inspect,
    equals, empty, option, type, valueOf,
    concat: concat('concat'),
    [fl.equals]: equals,
    [fl.empty]: empty,
    [fl.concat]: concat(fl.concat),
    ['@@type']: _type,
    constructor: Last
  }
}

Last['@@implements'] = _implements(
  [ 'equals', 'concat', 'empty' ]
)

Last.empty = empty
Last.type = type

Last[fl.empty] = empty
Last['@@type'] = _type

export default Last
