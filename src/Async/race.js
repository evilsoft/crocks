/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isSameType from '../core/isSameType'

import { proxy } from '../core/types'

const Async = proxy('Async')

function race(m, a) {
  if(!(isSameType(m, a) && isSameType(Async, m))) {
    throw new TypeError('race: Both arguments must be Asyncs')
  }

  return a.race(m)
}

export default curry(race)
