/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')

// compose2 :: (c -> d -> e) -> (a -> c) -> (b -> d) -> a -> b -> e
function compose2(f, g, h, x, y) {
  if(!isFunction(f) || !isFunction(g) || !isFunction(h)) {
    throw new TypeError('compose2: First, second and third arguments must be functions')
  }

  return curry(f)(g(x), h(y))
}

module.exports = curry(compose2)
