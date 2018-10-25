/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Matt Ross (amsross) */

const curry = require('../helpers/curry')
const isFunction = require('../predicates/isFunction')

// converge (Phoenix or Starling Prime)
// (b -> c -> d) -> (a -> b) -> (a -> c) -> a -> d
function converge(f, g, h, x) {
  if(!isFunction(f) || !isFunction(g) || !isFunction(h)) {
    throw new TypeError('converge: Functions required for first two arguments')
  }

  return curry(f)(g(x), h(x))
}

module.exports = curry(converge)
