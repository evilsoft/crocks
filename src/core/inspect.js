/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isArray from './isArray'
import isFunction from './isFunction'
import isObject from './isObject'
import isString from './isString'
import isSymbol from './isSymbol'
import isDate from './isDate'

function arrayInspect(xs) {
  return xs.length
    ? xs.map(inspect).reduce((a, x) => a + ',' + x)
    : xs
}

// inspect : a -> String
export default function inspect(x) {
  if(x && isFunction(x.inspect)) {
    return ` ${x.inspect()}`
  }

  if(isFunction(x)) {
    return ' Function'
  }

  if(isArray(x)) {
    return ` [${arrayInspect(x) } ]`
  }

  if(isObject(x)) {
    return ` { ${Object.keys(x).reduce((acc, key) => {
      return acc.concat([ `${key}:${inspect(x[key])}` ])
    }, []).join(', ')} }`
  }

  if(isString(x)) {
    return ` "${x}"`
  }

  if(isSymbol(x) || isDate(x)) {
    return ` ${x.toString()}`
  }

  return ` ${x}`
}
