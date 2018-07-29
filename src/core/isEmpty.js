/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */
import isObject from './isObject'
import isMonoid from './isMonoid'
import equals from './equals'
import fl from './flNames'

export default function isEmpty(x) {
  if(isMonoid(x)) {
    const empty = x.constructor[fl['empty']] || x.constructor['empty'] || x['empty']

    return equals(x, empty())
  }

  if(isObject(x)) {
    return !Object.keys(x).length
  }

  if(x && x.length !== undefined) {
    return !x.length
  }

  return true
}
