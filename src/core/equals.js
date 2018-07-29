/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isSameType from './isSameType'
import isSame from './isSame'
import hasAlg from './hasAlg'
import type from './type'
import fl from './flNames'

const comp = (a, b) =>
  a.valueOf() === b.valueOf()

const strats = {
  'Array': (a, b) =>
    a.length === b.length
      && deepEquals(a, b),

  'Date': (a, b) =>
    isSame(a.valueOf(), b.valueOf()),

  'Error': (a, b) =>
    a.name === b.name
      && a.message === b.message,

  'Object': (a, b) =>
    Object.keys(a).length === Object.keys(b).length
      && deepEquals(a, b),

  'RegExp': (a, b) =>
    a.source === b.source
      && a.ignoreCase === b.ignoreCase
      && a.global === b.global
      && a.multiline === b.multiline
      && a.unicode === b.unicode
}

function deepEquals(a, b) {
  for(const key in a) {
    if(!equals(a[key], b[key])) {
      return false
    }
  }
  return true
}

export default function equals(a, b) {
  if(isSame(a, b)) {
    return true
  }

  if(!isSameType(a, b)) {
    return false
  }

  if(hasAlg('equals', a)) {
    return (b[fl.equals] || b.equals).call(b, a)
  }

  return (strats[type(a)] || comp)(a, b)
}
