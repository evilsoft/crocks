/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import List from '../core/List'
import Pair from '../core/Pair'
import isObject from '../core/isObject'

// toPairs : Object -> List (Pair String a)
export default function toPairs(obj) {
  if(!isObject(obj)) {
    throw new TypeError('toPairs: Object required for argument')
  }

  return Object.keys(obj).reduce(
    (acc, key) => obj[key] !== undefined
      ? acc.concat(List.of(Pair(key, obj[key])))
      : acc,
    List.empty()
  )
}
