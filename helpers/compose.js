/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const pipe = require('./pipe')
const argsArray = require('../internal/argsArray')
const isFunction = require('../internal/isFunction')

// compose : ((y -> z), (x -> y), ..., (a -> b)) -> a -> z
function compose() {
  if(!arguments.length) {
    throw new TypeError('compose: At least one function required')
  }

  const fns =
    argsArray(arguments)

  if(fns.filter(x => !isFunction(x)).length) {
    throw new TypeError('compose: Only accepts functions')
  }

  return pipe.apply(null, fns.slice().reverse())
}

module.exports = compose
