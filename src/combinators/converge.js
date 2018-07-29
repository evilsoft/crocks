/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Matt Ross (amsross) */

import curry from '../core/curry'
import isFunction from '../core/isFunction'

// converge (Phoenix or Starling Prime)
// (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d
function converge(f, g, h, x) {
  if(!isFunction(f) || !isFunction(g) || !isFunction(h)) {
    throw new TypeError('converge: Functions required for first three arguments')
  }

  return curry(f)(g(x), h(x))
}

export default curry(converge)
